import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Transfer = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const receiver = location.state?.receiver;
  const operationToken = location.state?.operationToken;

  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const { username } = userData;

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
        // Actualizar saldo en localStorage
        const newBalance = res.transfer.from.newBalance;
        localStorage.setItem('userData', JSON.stringify({
          ...userData,
          balance: newBalance
        }));

        // Actualizar historial local con la nueva transferencia
        let historialActual = JSON.parse(localStorage.getItem('transactions')) || [];

        historialActual.unshift({
          id: Date.now().toString(), // id temporal
          amount: -res.transfer.amount,
          description: res.transfer.description,
          createdAt: res.transfer.timestamp,
          fromUsername: username,
          fromName: res.transfer.from.name,
          toUsername: res.transfer.to.username,
          toName: res.transfer.to.name,
          type: "sent"
        });

        localStorage.setItem('transactions', JSON.stringify(historialActual));

        // Redirigir al comprobante con los datos de la transferencia
        navigate('/comprobante', {
          state: {
            transfer: res.transfer
          }
        });
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
      <h1>Transferir a {receiver.name}</h1>

      <Input
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        style={{ marginBottom: 20 }}
      />

      <Input
        placeholder="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      <Button type="primary" onClick={handleTransfer} loading={loading}>
        Confirmar Transferencia
      </Button>

      <Button onClick={() => navigate('/account')} style={{ marginTop: 20 }}>
        Cancelar
      </Button>
    </div>
  );
};

export default Transfer;
