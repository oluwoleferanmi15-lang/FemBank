import axios from 'axios';

const API_URL = 'https://femma-bank.vercel.app';

export const registerCustomer = async (data) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, data);
  return response.data;
};

export const loginCustomer = async (data) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, data);
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await axios.post(`${API_URL}/api/auth/forgot-password`, data);
  return response.data;
};