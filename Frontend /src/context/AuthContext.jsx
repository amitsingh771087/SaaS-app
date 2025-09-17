import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post("http://localhost:8000/api/token/", {
      email,
      password,
    });
    setToken(res.data.access);
    localStorage.setItem("token", res.data.access);
  };

  const register = async (email, password) => {
    await axios.post("http://localhost:8000/api/register/", {
      email,
      password,
    });
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
