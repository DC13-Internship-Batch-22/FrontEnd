import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Order from "./pages/Order";
import OrderDetail from "./pages/OrderDetail";
import Home from "./pages/Home";
import Table from "./pages/Table";
import Menu from "./pages/Menu";
import MainLayout from "./pages/MainLayout";


import "./index.css";
import ProtectedRoute from "./pages/ProtectedRoute";
import MenuManagement from "./pages/MenuManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/table/:id" element={<Menu />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/menu" element={<MenuManagement />} />
            <Route path="/table" element={<Table />} />
            <Route path="/order" element={<Order />} />
            <Route path="/order/:id" element={<OrderDetail />} />
          </Route>
        </Route>

        {/* Route không tồn tại */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
