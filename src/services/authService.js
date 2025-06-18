import axios from 'axios';

const API_BASE_URL = 'https://raulocoin.onrender.com/api';

export const auth0Authenticate = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth0/authenticate`, data);
    return response.data;
  } catch (error) {
    console.error('Error autenticando con Auth0:', error);
    throw error;
  }
};
