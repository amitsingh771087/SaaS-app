import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ username: "User" });
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axiosClient.post("token/", {
        username,
        password,
      });

      const { access } = res.data;

      localStorage.setItem("token", access);

      setUser({ username });

      return { success: true, message: "Login successful!" };
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("Login failed. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
