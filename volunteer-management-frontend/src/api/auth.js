import axiosInstance from './axios';

export const loginUser = async (username, password) => {
  const response = await axiosInstance.post('/token/', { username, password });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/register/', userData);
  return response.data;
};
