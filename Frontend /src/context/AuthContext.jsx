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

  const register = async (username, email, password) => {
    try {
      const res = await axiosClient.post("signup/", {
        username,
        email,
        password,
      });

      if (res.status === 201) {
        localStorage.setItem("user", JSON.stringify({ username, email }));
        setUser({ username, email });
        return { success: true, message: "Registration successful!" };
      }
    } catch (error) {
      if (error.response?.data?.error === "User already exists") {
        throw new Error("User already exists");
      }
      throw new Error("Registration failed. Please try again.");
    }
  };

  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      await axiosClient.post("token/verify/", { token });
      return true;
    } catch (err) {
      logout();
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    (async () => {
      await verifyToken();
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuth: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
