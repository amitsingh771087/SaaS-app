import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
// users
import UsersList from "../pages/Users/UsersList";
import UserView from "../pages/Users/UserView";
import UserForm from "../pages/Users/UserForm";

// customer
import CustomersList from "../pages/customers/CustomersList";
import CustomerForm from "../pages/customers/CustomerForm";
import CustomerTimeline from "../pages/customers/CustomerTimeline";
import CustomerView from "../pages/customers/CustomerView";
// Dashboard + Modules
import Dashboard from "../pages/dashboard/Dashboard";

import ItemsList from "../pages/items/ItemsList";
// tensnts
import TenantsList from "../pages/tenants/TenantsList";
import TenantView from "../pages/tenants/TenantView";
import TenantForm from "../pages/tenants/TenantForm";

export default function AppRoutes() {
  const { isAuth } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={isAuth ? <Navigate to="/" /> : <Login />} />
      <Route
        path="/register"
        element={isAuth ? <Navigate to="/" /> : <Register />}
      />
      <Route
        path="/forgot-password"
        element={isAuth ? <Navigate to="/" /> : <ForgotPassword />}
      />

      {/* Private Routes (only inside Layout) */}
      {isAuth ? (
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          {/* users */}
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/create" element={<UserForm />} />
          <Route path="/users/:id" element={<UserView />} />
          <Route path="/users/:id/edit" element={<UserForm />} />

          {/* customer */}
          <Route path="customers" element={<CustomersList />} />
          <Route path="/customers/create" element={<CustomerForm />} />
          <Route path="/customers/:id/edit" element={<CustomerForm />} />
          <Route path="/customers/:id" element={<CustomerView />} />
          {/* Tenants */}
          <Route path="/tenants" element={<TenantsList />} />
          <Route path="/tenants/create" element={<TenantForm />} />
          <Route path="/tenants/:id" element={<TenantView />} />
          <Route path="/tenants/:id/edit" element={<TenantForm />} />

          <Route
            path="/customers/:id/timeline"
            element={<CustomerTimeline />}
          />
          <Route path="items" element={<ItemsList />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}
