import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const location = useLocation();
  const { name, username, balance } = location.state || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
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
                R$ {balance.toLocaleString()}
            </h1>
            <p className='saludo'>{username}</p>
        </div>
        <Button type="primary" className='auth-button'> 
            Transferir
        </Button>
    </div>
  );
};

export default Account;
