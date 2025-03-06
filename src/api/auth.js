import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Auth endpoints
export const signup = async (userData) => {
  return await axios.post(`${API_URL}/signup`, userData);
};

export const login = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData);
};

// Admin endpoints
const ADMIN_API_URL = "http://localhost:5000/api";

// Add a new product (admin feature)
export const addProduct = async (productData) => {
  // Get the token from local storage (or pass it as a parameter if preferred)
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Unauthorized: No token found");
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  return await axios.post(`${ADMIN_API_URL}/products`, productData, config);
};
