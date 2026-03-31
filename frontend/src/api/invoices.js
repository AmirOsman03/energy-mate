import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export const getSummary = async (userId) => {
  if (!userId) return null;
  const res = await axios.get(`${BASE_URL}/summary?user_id=${userId}`, { withCredentials: true });
  return res.data;
};

export const getInvoices = async (userId) => {
  if (!userId) return [];
  const res = await axios.get(`${BASE_URL}/invoices?user_id=${userId}`, { withCredentials: true });
  return res.data;
};
