import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import Dish from "../pages/dish/Dish";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Cart from "../pages/cart/Cart";
import ListOrder from "../pages/order/ListOrder";
import Profile from "../pages/user/Profile";
import ChangePassword from "../pages/user/ChangePassword";
import UpdateUser from "../pages/user/UpdateUser";
import NotFoundPage from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dish" element={<Dish />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/order-user/:id" element={<ListOrder />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/change-password/:id" element={<ChangePassword />} />
      <Route path="/profile/update/:id" element={<UpdateUser />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
