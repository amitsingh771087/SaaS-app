import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
// import Customers from "./pages/customers/Customers";
// import Items from "./pages/items/Items";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<h1>Login</h1>} />
          <Route path="/register" element={<h1>Register </h1>} />
          <Route path="/customers" element={<h1>Customer</h1>} />
          <Route path="/items" element={<h1>Items</h1>} />
          <Route path="/" element={<Navigate to="/customers" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
