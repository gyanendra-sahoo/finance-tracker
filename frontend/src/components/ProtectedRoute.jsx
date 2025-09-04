import React from "react";
import { useSelector } from "react-redux";
import { Navigate, replace, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  console.log(location);

  // Show loading while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated && location.pathname === "/") {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, redirect to login
  if (
    !isAuthenticated &&
    location.pathname !== "/" &&
    location.pathname !== "/login" &&
    location.pathname !== "/signup"
  ) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children
  return children;
};

export default ProtectedRoute;
