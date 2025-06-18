import React, { useState } from 'react';
import { Input, List, Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (value) => {
    setSearchTerm(value);

    // Si hay menos de 3 caracteres, no busca
    if (value.trim().length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`https://raulocoin.onrender.com/api/search-users?q=${value}`);

      if (response.data.success) {
        setResults(response.data.users);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Error al buscar usuarios', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = (user) => {
    navigate('/verify-totp', { state: { receiver: user } });
  };

  return (
    <div className="login-container">
      <h1>Buscar usuario para transferir</h1>

      <Input
        placeholder="Escribí un alias o nombre (mínimo 3 letras)"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      <List
        loading={loading}
        dataSource={results}
        renderItem={(item) => (
          <List.Item>
            <Card style={{ width: '100%' }}>
              <p><strong>Nombre:</strong> {item.name}</p>
              <p><strong>Alias:</strong> {item.username}</p>
              <Button type="primary" onClick={() => handleTransfer(item)}>
                Transferir
              </Button>
            </Card>
          </List.Item>
        )}
      />

      <Button onClick={() => navigate('/account')} style={{ marginTop: 20 }}>
        Volver
      </Button>
    </div>
  );
};

export default SearchUsers;
