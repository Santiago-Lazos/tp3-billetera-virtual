import React from 'react';
import { Button, List, Card } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Account = () => {
  const navigate = useNavigate();
  const { logout } = useAuth0();

  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

  const { name, username, balance } = userData;

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('transactions');
    logout({ returnTo: window.location.origin }); // 👈 cierra sesión en Auth0 también
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="login-container">
      <div className='icon-container'>
        <p className='saludo'>Hola, {name}</p>
        <LogoutOutlined className="logout-icon" onClick={handleLogout} />
      </div>

      <div className='user-container'>
        <p className='saludo'>Saldo actual</p>
        <h1 className='saldo'>
          R$ {balance ? balance.toLocaleString() : '0'}
        </h1>
        <p className='saludo'>{username}</p>
      </div>

      <Button type="primary" className='auth-button' onClick={() => navigate('/search-users')}>
        Transferir
      </Button>

      <h2 style={{ marginTop: 30 }}>Mis Transferencias</h2>

      <List
        dataSource={transactions}
        renderItem={item => (
          <List.Item>
            <Card style={{ width: '100%' }}>
              <p><strong>Fecha:</strong> {formatDate(item.createdAt)}</p>
              <p><strong>Tipo:</strong> {item.type}</p>
              <p><strong>Monto:</strong> R$ {item.amount}</p>
              <p><strong>Para:</strong> {item.toName || 'N/A'}</p>
              <p><strong>De:</strong> {item.fromName || 'N/A'}</p>
              {item.description && <p><strong>Descripción:</strong> {item.description}</p>}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Account;
