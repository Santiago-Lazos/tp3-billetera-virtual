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

export const getBalance = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth0/balance`, { email });
    return response.data;
  } catch (error) {
    console.error('Error al obtener balance:', error);
    throw error;
  }
};

export const getTransactions = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth0/transactions`, { email });
    return response.data;
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    throw error;
  }
};

// authService.js

export const editUserProfile = async ({ email, name, username }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth0/edit-profile`, {
      email,
      name,
      username
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Si la API responde con error
      return error.response.data;
    }
    throw error;
  }
};

export const changeUserEmail = async ({ username, totpToken, newEmail }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/change-email`, {
      username,
      totpToken,
      newEmail,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
};

