<<<<<<< HEAD:src/pages/verify-account.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Input, Button } from "antd";

const VerifyAccount = () => {
  const navigate = useNavigate();

  // Leemos userData de localStorage
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  // Alias tomado de userData.username
  const [alias, setAlias] = useState(userData.username || "");
  const [codigo, setCodigo] = useState("");
=======
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, message } from 'antd';

const VerifyAccount = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData')) || {};

  const [alias] = useState(userData.username || '');
  const [codigo, setCodigo] = useState('');
>>>>>>> 9d79eb663dc8ce2c1c7011f3d8a97f0f919d0d86:src/pages/VerifyAccount.js
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      username: alias,
      totpToken: codigo,
    };

    try {
<<<<<<< HEAD:src/pages/verify-account.js
      const verifyResponse = await axios.post(
        "https://raulocoin.onrender.com/api/verify-totp-setup",
=======
      const response = await axios.post(
        'https://raulocoin.onrender.com/api/verify-totp-setup',
>>>>>>> 9d79eb663dc8ce2c1c7011f3d8a97f0f919d0d86:src/pages/VerifyAccount.js
        data
      );
      const res = response.data;

<<<<<<< HEAD:src/pages/verify-account.js
      if (verifyRes.success) {
        console.log("Datos enviados:", data);

        const userResponse = await axios.post(
          "https://raulocoin.onrender.com/api/user-details",
          data
        );
        const userRes = userResponse.data;

        if (userRes.success && userRes.user) {
          navigate("/account", {
            state: {
              name: userRes.user.name,
              username: userRes.user.username,
              balance: userRes.user.balance,
            },
          });
        } else {
          alert("No se pudieron obtener los datos del usuario.");
        }
      } else {
        alert("Código TOTP incorrecto.");
      }
    } catch (error) {
      alert("Error al verificar el código TOTP.");
=======
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
>>>>>>> 9d79eb663dc8ce2c1c7011f3d8a97f0f919d0d86:src/pages/VerifyAccount.js
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
          {loading ? "Cargando..." : "Verificar"}
        </Button>
        <Button type="primary">
          <Link
            to="/totp-setup"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Activar TOTP
          </Link>
        </Button>
      </form>
    </div>
  );
};

export default VerifyAccount;
