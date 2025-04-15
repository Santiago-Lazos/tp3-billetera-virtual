import React, { useState } from 'react';
import { Button, Input } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [alias, setAlias] = useState('');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const data = {
      username: alias,
      totpToken: codigo,
    };
  
    try {
      await axios.post('https://raulocoin.onrender.com/api/verify-totp-setup', data);
    } catch (error) {
      console.warn("La verificación TOTP falló, pero se continuará con el login.");
    }
  
    try {
      const response = await axios.post('https://raulocoin.onrender.com/api/balance', data);
      const res = response.data;
      if (res.success && res.user) {
        navigate('/account', {
          state: {
            name: res.user.name,
            username: res.user.username,
            balance: res.user.balance,
          },
        });
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      console.error(error);
      alert('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img
        src={"/assets/raulCoin.png"}
        alt={"raulCoin"}
        className='logo-img'
      />
      <h1 className='auth-title'>Iniciar sesión</h1>
      <p className='auth-subtitle'>¡Bienvenido de nuevo, te hemos echado de menos!</p>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='auth-input'
        />
        <Input
          type="text"
          placeholder="Alias"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          required
          className='auth-input'
        />
        <Input
          type="text"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
          className='auth-input'
        />
        <Button type="primary" htmlType="submit" className='auth-button' disabled={loading}>
          {loading ? 'Cargando...' : 'Ingresar'}
        </Button>

        <p className='auth-p-end'>
          <Link className='auth-link' to="/register">Crear nueva cuenta</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
