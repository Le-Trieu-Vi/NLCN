import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../config/AuthContext";

const ProtectedRoute = ({ element }) => {
    const { user } = useAuth();

    return user ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;