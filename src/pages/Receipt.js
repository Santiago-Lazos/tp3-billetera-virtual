import React from 'react';
import { Button, Card } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const transfer = location.state?.transfer;

  if (!transfer) {
    navigate('/account');
    return null;
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="login-container">
      <h1>Comprobante de Transferencia</h1>

      <Card style={{ width: '100%', marginBottom: 20 }}>
        <p><strong>De:</strong> {transfer.from.name}</p>
        <p><strong>Para:</strong> {transfer.to.name}</p>
        <p><strong>Monto:</strong> R$ {transfer.amount}</p>
        <p><strong>Descripción:</strong> {transfer.description || 'Sin descripción'}</p>
        <p><strong>Fecha:</strong> {formatDate(transfer.timestamp)}</p>
      </Card>

      <Button type="primary" onClick={() => navigate('/search-users')}>
        Hacer otra transferencia
      </Button>

      <Button onClick={() => navigate('/account')} style={{ marginTop: 20 }}>
        Volver al inicio
      </Button>
    </div>
  );
};

export default Receipt;
