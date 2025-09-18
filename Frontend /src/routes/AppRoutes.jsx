import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

// Customer
import CustomersList from "../pages/customers/CustomersList";
import ItemsList from "../pages/items/ItemsList";

// Items
import Dashboard from "../pages/dashboard/Dashboard";

export default function AppRoutes() {
  const { isAuth } = useAuth();
  if (!isAuth) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<CustomersList />} />
        <Route path="/items" element={<ItemsList />} />
        {/* other modules later */}
      </Routes>
    </Layout>
  );
}
