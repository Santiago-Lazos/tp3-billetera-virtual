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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      username: alias,
      totpToken: codigo,
    };

    try {
      const verifyResponse = await axios.post(
        "https://raulocoin.onrender.com/api/verify-totp-setup",
        data
      );
      const verifyRes = verifyResponse.data;

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
          className="auth-button1"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Verificar"}
        </Button>
        <Button type="primary" htmlType="button" className="auth-button">
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
