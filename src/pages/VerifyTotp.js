import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyTotp = () => {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const receiver = location.state?.receiver;

  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const { username } = userData;

  if (!receiver) {
    message.error('No se seleccionó un destinatario');
    navigate('/search-users');
    return null;
  }

  const handleVerify = async () => {
    if (codigo.trim() === '') {
      message.warning('Ingresá un código TOTP');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://raulocoin.onrender.com/api/verify-totp', {
        username: username,
        totpToken: codigo
      });

      const res = response.data;

      if (res.success) {
        // Redirigir a /transfer con operationToken y receiver
        navigate('/transfer', {
          state: {
            receiver: receiver,
            operationToken: res.operationToken
          }
        });
      } else {
        message.error('Código incorrecto o expirado');
      }
    } catch (error) {
      console.error('Error al verificar TOTP', error);
      message.error('Error al verificar el código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Validar código TOTP</h1>
      <p>Para continuar con la transferencia a <strong>{receiver.name}</strong>, ingresá tu código TOTP.</p>

      <Input
        placeholder="Código TOTP"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      <Button type="primary" onClick={handleVerify} loading={loading}>
        Validar y continuar
      </Button>

      <Button onClick={() => navigate('/search-users')} style={{ marginTop: 20 }}>
        Volver
      </Button>
    </div>
  );
};

export default VerifyTotp;
