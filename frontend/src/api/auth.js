import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export const login = () => {
  window.location.href = `${BASE_URL}/auth/login`;
};

export const getCurrentUser = async () => {
  const res = await axios.get(`${BASE_URL}/auth/me`, { withCredentials: true });
  return res.data.user;
};

export const logout = async () => {
  await axios.get(`${BASE_URL}/auth/logout`, { withCredentials: true });
  window.location.href = "/";
};
