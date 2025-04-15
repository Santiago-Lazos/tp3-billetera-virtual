import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'antd';

const Account = () => {
  const location = useLocation();
  const { name, username, balance } = location.state || {};

  return (
    <div className="login-container">
        <div className='user-container'>
            <p className='saludo'>Hola, {name}</p>
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
