import axios from 'axios';

const API_URL = 'https://femma-bank.vercel.app';

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

// Transfer funds
export const transferFunds = async (data) => {
  const response = await axios.post(`${API_URL}/api/transfer`, data, {
    headers: getHeaders()
  });
  return response.data;
};

// Check transaction status
export const checkTransaction = async (reference) => {
  const response = await axios.get(`${API_URL}/api/transfer/${reference}`, {
    headers: getHeaders()
  });
  return response.data;
};