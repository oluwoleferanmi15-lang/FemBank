import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://your-render-backend-url.onrender.com';

export const sendOTP = async (data) => {
  const response = await axios.post(`${API_URL}/api/auth/send-otp`, data);
  return response.data;
};

export const verifyOTP = async (data) => {
  const response = await axios.post(`${API_URL}/api/auth/verify-otp`, data);
  return response.data;
};

export const registerCustomer = async (data) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, data);
  return response.data;
};

export const loginCustomer = async (data) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, data);
  return response.data;
};

export const sendResetOTP = async (data) => {
  const response = await axios.post(`${API_URL}/api/auth/send-reset-otp`, data);
  return response.data;
};

export const verifyResetOTP = async (data) => {
  const response = await axios.post(`${API_URL}/api/auth/verify-reset-otp`, data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await axios.post(`${API_URL}/api/auth/reset-password`, data);
  return response.data;
};