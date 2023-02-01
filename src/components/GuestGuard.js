import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Redirect, redirect } from "react-router-dom";

const GuestGuard = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  console.log(isAuthenticated);
  if (isAuthenticated) {
    return <Redirect to="/chat" />;
  }

  return <>{children}</>;
};

export default GuestGuard;
