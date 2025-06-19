import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  if (isLoading) return <div>Cargando...</div>;
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  return children;
};

export default PrivateRoute;
