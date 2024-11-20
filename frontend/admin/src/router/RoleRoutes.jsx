import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import alertService from "../services/AlertService";

const AdminRoute = ({ element }) => {
  if (!AuthService.isAdmin()) {
    alertService.error("Bạn không có quyền truy cập trang này!");
    return <Navigate to="/table" />;
  }
  return element;
};

const StaffRoute = ({ element }) => {
  if (AuthService.isAdmin()) {
    alertService.error("Bạn không có quyền truy cập trang này!");
    return <Navigate to="/table-manager" />;
  }
  return element;
};

export { AdminRoute, StaffRoute };
