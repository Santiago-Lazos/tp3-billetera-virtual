import React, { useState } from 'react';
import { Input, List, Card, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const { Option } = Select;

const Transfers = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

  const filteredTransactions = transactions.filter(item => {
    const aliasMatch =
      item.toUsername?.toLowerCase().includes(filter.toLowerCase()) ||
      item.fromUsername?.toLowerCase().includes(filter.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(filter.toLowerCase()));

    const typeMatch =
      typeFilter === 'all' || item.type === typeFilter;

    return aliasMatch && typeMatch;
  });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const downloadTransfer = (item) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Comprobante de Transferencia", 20, 20);
    doc.line(20, 25, 190, 25); // Línea separadora

    doc.setFontSize(12);
    doc.text(`Fecha: ${formatDate(item.createdAt)}`, 20, 40);
    doc.text(`Tipo: ${item.type}`, 20, 50);
    doc.text(`Monto: R$ ${item.amount}`, 20, 60);
    doc.text(`Para: ${item.toName || 'N/A'} (${item.toUsername})`, 20, 70);
    doc.text(`De: ${item.fromName || 'N/A'} (${item.fromUsername})`, 20, 80);
    if (item.description) {
      doc.text(`Descripción: ${item.description}`, 20, 90);
    }

    doc.save(`transferencia_${item.id}.pdf`);
  };

  return (
    <div className="login-container">
      <h2 className="auth-title">Mis Transferencias</h2>

      <Input
        className="auth-input"
        placeholder="Filtrar por alias o descripción"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <Select
        className="auth-input"
        value={typeFilter}
        onChange={(value) => setTypeFilter(value)}
        style={{ width: '100%', marginBottom: 20 }}
      >
        <Option value="all">Todos los tipos</Option>
        <Option value="sent">Solo enviados</Option>
        <Option value="received">Solo recibidos</Option>
      </Select>

      <List
        dataSource={filteredTransactions}
        locale={{ emptyText: 'No se encontraron transferencias.' }}
        renderItem={(item) => (
          <List.Item>
            <Card style={{ width: '100%' }}>
              <p><strong>Fecha:</strong> {formatDate(item.createdAt)}</p>
              <p><strong>Tipo:</strong> {item.type}</p>
              <p><strong>Monto:</strong> R$ {item.amount}</p>
              <p><strong>Para:</strong> {item.toName || 'N/A'} ({item.toUsername})</p>
              <p><strong>De:</strong> {item.fromName || 'N/A'} ({item.fromUsername})</p>
              {item.description && <p><strong>Descripción:</strong> {item.description}</p>}
              <Button type="link" onClick={() => downloadTransfer(item)}>
                Descargar comprobante
              </Button>
            </Card>
          </List.Item>
        )}
      />

      <Button
        onClick={() => navigate('/account')}
        style={{ marginTop: 20 }}
      >
        Volver
      </Button>
    </div>
  );
};

export default Transfers;
