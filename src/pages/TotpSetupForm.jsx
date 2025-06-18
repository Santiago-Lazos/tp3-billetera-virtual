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
      <Title level={3}>Ingresá tus datos para generar TOTP</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Usuario"
          name="username"
          rules={[{ required: true, message: "Por favor ingresa el usuario" }]}
        >
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ej: alejomartinez2420.alias"
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Por favor ingresa el email" },
            { type: "email", message: "Ingresa un email válido" },
          ]}
        >
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ej: alejomartinez2420@gmail.com"
          />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block>
          Generar código TOTP
        </Button>
      </Form>
    </div>
  );
};

export default TotpSetupForm;
