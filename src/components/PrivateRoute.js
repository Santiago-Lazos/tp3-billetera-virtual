import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { auth0Authenticate } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const {
    isAuthenticated,
    loginWithRedirect,
    isLoading,
    user,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0();

  const [authDone, setAuthDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authenticateUser = async () => {
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
              email: user.email || 'santiago.daniel.lazos@gmail.com',
              name: user.name,
              picture: user.picture,
              nickname: user.nickname || ""
            },
            auth0_tokens: {
              access_token: accessToken,
              id_token: idTokenClaims.__raw,
            },
          };

          console.log('Datos a enviar a la API:', data);
          const response = await auth0Authenticate(data);
          console.log('Respuesta del backend:', response);

          localStorage.setItem('userData', JSON.stringify(response.user));


          setAuthDone(true);
console.log(response.user);
                  if (response.user.isVerified === true) {
            console.log("Entro");
            navigate("/Account");
        } else {
            navigate("/VerifyAccount");
     }
        } catch (error) {
          console.error('Error autenticando con Auth0:', error);
        }
      }
    };

    if (!isLoading && isAuthenticated) {
      authenticateUser();
    } else if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        authorizationParams: {
          prompt: 'login',
        },
      });
    }
  }, [
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    user,
    getAccessTokenSilently,
    getIdTokenClaims,
    navigate,
    authDone
  ]);

  if (isLoading || !isAuthenticated) {
    return <div>Cargando...</div>;
  }

  return children;
};

export default PrivateRoute;
