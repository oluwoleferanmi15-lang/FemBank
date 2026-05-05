import axios from 'axios';

const API_URL = 'https://femma-bank.vercel.app';

// Register customer
export const registerCustomer = async (data) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, data);
  return response.data;
};

// Login customer
export const loginCustomer = async (data) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, data);
  return response.data;
};