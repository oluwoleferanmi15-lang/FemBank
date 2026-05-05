import axios from 'axios';

const API_URL = 'https://femma-bank.vercel.app';

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

// Get balance
export const getBalance = async () => {
  const response = await axios.get(`${API_URL}/api/account/balance`, {
    headers: getHeaders()
  });
  return response.data;
};

// Name enquiry
export const nameEnquiry = async (accountNumber) => {
  const response = await axios.get(
    `${API_URL}/api/account/name-enquiry/${accountNumber}`,
    { headers: getHeaders() }
  );
  return response.data;
};

// Get transactions
export const getTransactions = async () => {
  const response = await axios.get(`${API_URL}/api/account/transactions`, {
    headers: getHeaders()
  });
  return response.data;
};