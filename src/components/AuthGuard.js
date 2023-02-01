import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Redirect, redirect } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  console.log(isAuthenticated);
  if (!isAuthenticated) {
    console.log(isAuthenticated);

    return <Redirect to="/login" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
