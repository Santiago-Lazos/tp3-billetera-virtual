import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getBalance, getTransactions } from '../services/authService';

const Transfer = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const receiver = location.state?.receiver;
  const operationToken = location.state?.operationToken;

  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const { username, email } = userData;

  if (!receiver || !operationToken) {
    message.error('Faltan datos de la operación');
    navigate('/search-users');
    return null;
  }

  const handleTransfer = async () => {
    if (amount.trim() === '' || isNaN(amount) || Number(amount) <= 0) {
      message.warning('Ingresá un monto válido');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://raulocoin.onrender.com/api/transfer', {
        fromUsername: username,
        toUsername: receiver.username,
        amount: Number(amount),
        description: description,
        operationToken: operationToken
      });

      const res = response.data;

      if (res.success) {
        const balanceRes = await getBalance(email);
        if (balanceRes.success) {
          localStorage.setItem('userData', JSON.stringify({
            ...userData,
            balance: balanceRes.user.balance
          }));
        }

        const transactionsRes = await getTransactions(email);
        if (transactionsRes.success) {
          localStorage.setItem('transactions', JSON.stringify(transactionsRes.transactions));
        }

        navigate('/comprobante', { state: { transfer: res.transfer } });

      } else {
        message.error(res.message);
      }

    } catch (error) {
      console.error('Error al realizar la transferencia', error);
      message.error('Error al realizar la transferencia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="auth-title">Transferir a</h2>
      <p className="auth-subtitle">{receiver.name}</p>

      <Input
        className="auth-input"
        placeholder="Monto en R$"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
      />

      <Input
        className="auth-input"
        placeholder="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button
        type="primary"
        className="auth-button"
        onClick={handleTransfer}
        loading={loading}
      >
        Confirmar Transferencia
      </Button>

      <Button
      className='auth-button'
        onClick={() => navigate('/account')}
        style={{ marginTop: 20 }}
      >
        Cancelar
      </Button>
    </div>
  );
};

export default Transfer;
