import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, message } from 'antd';

const VerifyAccount = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData')) || {};

  const [alias] = useState(userData.username || '');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      username: alias,
      totpToken: codigo,
    };

    try {
      const response = await axios.post(
        'https://raulocoin.onrender.com/api/verify-totp-setup',
        data
      );
      const res = response.data;

      if (res.success) {
        // Guardar datos actualizados en localStorage
        localStorage.setItem('userData', JSON.stringify(res.user));

        message.success(res.message || 'Cuenta verificada correctamente.');

        // Redirigir a /account con los datos
        navigate('/account', {
          state: {
            name: res.user.name,
            username: res.user.username,
            balance: res.user.balance,
          },
        });
      } else {
        message.error(res.message || 'Código TOTP incorrecto.');
      }
    } catch (error) {
      message.error('Error al verificar el código TOTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src="/assets/raulCoin.png" alt="raulCoin" className="logo-img" />
      <h1 className="auth-title">Verifica tu cuenta</h1>
      <p className="auth-subtitle">¡Es necesario verificar para continuar!</p>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Alias"
          disabled
          value={alias}
          className="auth-input"
        />
        <Input
          type="text"
          placeholder="Código TOTP"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
          className="auth-input"
        />
        <Button
          type="primary"
          htmlType="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Verificar'}
        </Button>
        <p className="auth-p-end">
          <Link className="auth-link" to="/">Volver</Link>
        </p>
      </form>
    </div>
  );
};

export default VerifyAccount;
