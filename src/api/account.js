import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://your-render-url.onrender.com';

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const getBalance = async () => {
  const response = await axios.get(`${API_URL}/api/account/balance`, {
    headers: getHeaders()
  });
  return response.data;
};

export const nameEnquiry = async (accountNumber) => {
  const response = await axios.get(
    `${API_URL}/api/account/name-enquiry/${accountNumber}`,
    { headers: getHeaders() }
  );
  return response.data;
};

export const getTransactions = async () => {
  const response = await axios.get(`${API_URL}/api/account/transactions`, {
    headers: getHeaders()
  });
  return response.data;
};
