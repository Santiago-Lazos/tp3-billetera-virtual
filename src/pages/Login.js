import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import { auth0Authenticate } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {
    loginWithRedirect,
    isAuthenticated,
    user,
    getAccessTokenSilently,
    getIdTokenClaims,
    isLoading,
  } = useAuth0();

  const [authDone, setAuthDone] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    loginWithRedirect({
      authorizationParams: {
        prompt: "login",
      },
    });
  };
    const Recover = () => {
      navigate("/totp-setup");
  };

  useEffect(() => {
    const fetchTokens = async () => {
      if (isAuthenticated && user && !authDone) {
        try {
          const accessToken = await getAccessTokenSilently();
          const idTokenClaims = await getIdTokenClaims();

          const data = {
            auth0_payload: {
              iss: idTokenClaims.iss,
              sub: idTokenClaims.sub,
              aud: idTokenClaims.aud,
              iat: idTokenClaims.iat,
              exp: idTokenClaims.exp,
              email: user.email || "santiago.daniel.lazos@gmail.com",
              name: user.name,
              picture: user.picture,
              nickname: user.nickname || "",
            },
            auth0_tokens: {
              access_token: accessToken,
              id_token: idTokenClaims.__raw,
            },
          };

          console.log("Datos a enviar a la API:", data);
          const response = await auth0Authenticate(data);
          console.log("Respuesta del backend:", response);

          localStorage.setItem("userData", JSON.stringify(response.user));

          if (response.user.isVerified) {
            navigate("/account");
          } else {
            navigate("/verify-account");
          }

          setAuthDone(true);
        } catch (error) {
          console.error("Error en autenticación:", error);
        }
      }
    };

    if (!isLoading && isAuthenticated) {
      fetchTokens();
    }
  }, [
    isLoading,
    isAuthenticated,
    user,
    getAccessTokenSilently,
    getIdTokenClaims,
    navigate,
    authDone,
  ]);

  return (
    <div className="login-container">
      <img src={"/assets/raulCoin.png"} alt={"raulCoin"} className="logo-img" />
      <h1 className="auth-title">Iniciar sesión</h1>
      <p className="auth-subtitle">
        ¡Bienvenido de nuevo, te hemos echado de menos!
      </p>

      <Button type="primary" className="auth-button" onClick={handleLoginClick} style={{marginBottom: 15}}>
        Ingresar
      </Button>
      <Button type="primary" className="auth-button" onClick={Recover}>
        Recuperar TOTP
      </Button>
      <p className="auth-p-end">
        <a className="auth-link" href="/totp-setup">
        </a>
      </p>
    </div>
  );
};

export default Login;
