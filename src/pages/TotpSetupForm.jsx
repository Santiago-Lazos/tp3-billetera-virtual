import React, { useState } from "react";
import { Button, Input, Typography, Form } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const TotpSetupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onFinish = () => {
    setLoading(true);
    // Pasamos datos por navigate state para usar en el resultado
    navigate("/totp-result", { state: { username, email } });
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "auto",
        padding: 20,
        textAlign: "center",
      }}
    >
      <div className="login-container">
        <img src="/assets/raulCoin.png" alt="raulCoin" className="logo-img" />
        <h1 className="auth-title">Ingresá tus datos para generar TOTP</h1>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Usuario"
            className="auth-title"
            name="username"
            rules={[
              { required: true, message: "Por favor ingresa el usuario" },
            ]}
          >
            <Input
              value={username}
              className="auth-input1"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Alias"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            className="auth-title"
            name="email"
            rules={[
              { required: true, message: "Por favor ingresa el email" },
              { type: "email", message: "Ingresa un email válido" },
            ]}
          >
            <Input
              value={email}
              className="auth-input1"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="auth-button"
            loading={loading}
            block
          >
            Generar código TOTP
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default TotpSetupForm;
