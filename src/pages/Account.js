import React, { useState, useEffect } from 'react';
import { Button, List, Card, message, Spin } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { getBalance, getTransactions } from '../services/authService';
import jsPDF from 'jspdf';


const Account = () => {
  const navigate = useNavigate();
  const { logout } = useAuth0();

  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const { email } = userData;

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('transactions');
    logout({ returnTo: window.location.origin });
  };

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

  useEffect(() => {
    if (!email) {
      message.error('No se encontró el email del usuario.');
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const balanceResponse = await getBalance(email);
        if (!balanceResponse.success) {
          message.error(balanceResponse.message || 'Error al obtener balance');
          handleLogout();
          return;
        }

        const transactionsResponse = await getTransactions(email);
        if (!transactionsResponse.success) {
          message.warning('No se pudieron obtener transacciones, pero puedes seguir operando.');
        }

        setUser(balanceResponse.user);
        setTransactions(transactionsResponse.transactions || []);

        // Guardar datos actualizados en localStorage
        localStorage.setItem('userData', JSON.stringify(balanceResponse.user));
        localStorage.setItem('transactions', JSON.stringify(transactionsResponse.transactions || []));

      } catch (error) {
        console.error('Error al cargar datos de usuario:', error);
        message.error('Error al cargar datos de usuario');
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [email, navigate]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '30px' }}><Spin size="large" /></div>;
  }

  if (!user) return null;

  return (
    <div className="login-container">
      <div className='icon-container'>
        <p className='saludo'>Hola, {user.name}</p>
        <LogoutOutlined className="logout-icon" onClick={handleLogout} />
      </div>

      <div className='user-container'>
        <p className='saludo'>Saldo actual</p>
        <h1 className='saldo'>
          R$ {user.balance.toLocaleString()}
        </h1>
        <p className='saludo'>{user.username}</p>
      </div>

      <Button type="primary" onClick={() => navigate('/edit-profile')} style={{ marginTop: 20 }}>
  Editar Perfil
</Button>



      <Button type="primary" className='auth-button' onClick={() => navigate('/search-users')}>
        Transferir
      </Button>

      <h2 style={{ marginTop: 30 }}>Mis Transferencias</h2>

      <Button type="link" onClick={() => navigate('/transfers')} style={{ marginBottom: 20 }}>
        Ver todas las transferencias y buscar
      </Button>

      <List
  dataSource={transactions.filter(item => item.type !== 'profile_update').slice(0, 3)}
  renderItem={item => (
    <List.Item key={item.id}>
      <Card style={{ width: '100%' }}>
        <p><strong>Fecha:</strong> {formatDate(item.createdAt)}</p>
        <p><strong>Tipo:</strong> {item.type}</p>
        <p><strong>Monto:</strong> R$ {item.amount}</p>
        <p><strong>Para:</strong> {item.toName || 'N/A'}</p>
        <p><strong>De:</strong> {item.fromName || 'N/A'}</p>
        {item.description && <p><strong>Descripción:</strong> {item.description}</p>}
        <Button type="link" onClick={() => downloadTransfer(item)}>Descargar</Button>
      </Card>
    </List.Item>
  )}
/>

    </div>
  );
};

export default Account;
