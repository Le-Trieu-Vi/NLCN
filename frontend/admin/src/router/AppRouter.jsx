import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AuthService from "../services/AuthService";
import Login from "../pages/auth/Login";
import Table from "../pages/tables/Table";
import TableManager from "../pages/tables/TableManager";
import TableDetail from "../pages/tables/TableDetail";
import Payment from "../pages/payments/Payment";
import Categories from "../pages/caterories/Categories";
import Order from "../pages/orders/Order";
import OrderDetail from "../pages/orders/OrderDetail";
import CategoryUpdate from "../pages/caterories/CategoryUpdate";
import User from "../pages/users/User";
import UserUpdate from "../pages/users/UserUpdate";
import DishUpdate from "../pages/dishes/DishUpdate";
import OrderByUser from "../pages/orders/OrderByUser";
import Profile from "../pages/users/Profile";
import Statistic from "../pages/statistic/Statistic";
import ChangePassword from "../pages/users/ChangePassword";
import NotFound from "../pages/NotFound";
import { AdminRoute, StaffRoute } from "./RoleRoutes";

function AppRoutes() {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.pathname === "/") {
      if (AuthService.isAuthenticated()) {
        if(AuthService.isAdmin()) {
          navigate("/table-manager");
        } else {
          navigate("/table");
        }
      } else {
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/table" element={<StaffRoute element={<Table />} />} />
      <Route path="/table-manager" element={<AdminRoute element={<TableManager />} />} />
      <Route path="/table/:id" element={<StaffRoute element={<TableDetail />} />} />
      <Route path="/payment/:id" element={<StaffRoute element={<Payment />} />} />
      <Route path="/category" element={<AdminRoute element={<Categories />} />} />
      <Route path="/order" element={<AdminRoute element={<Order />} />} />
      <Route path="/order/:id" element={<AdminRoute element={<OrderDetail />} />} />
      <Route path="/order-user/:id" element={<StaffRoute element={<OrderByUser />} />} />
      <Route path="/category/:id" element={<AdminRoute element={<CategoryUpdate />} />} />
      <Route path="/dish/:id" element={<AdminRoute element={<DishUpdate />} />} />
      <Route path="/user" element={<AdminRoute element={<User />} />} />
      <Route path="/user/:id" element={<AdminRoute element={<UserUpdate />} />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/change-password/:id" element={<ChangePassword />} />
      <Route path="/statistic" element={<AdminRoute element={<Statistic />} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
