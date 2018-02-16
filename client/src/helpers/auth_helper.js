import jwtDecode from 'jwt-decode';
import axios from 'axios/index';
import { tokenName, refreshTokenName, profileName } from '../config';

export default async function authHelper() {


  const token =
    localStorage.getItem(tokenName) !== 'undefined' || null
      ? localStorage.getItem(tokenName)
      : null;

  if (token) {
    const decodedToken = jwtDecode(token);

    if (isTokenExpired(decodedToken)) {
      const refreshToken =
        localStorage.getItem(refreshTokenName) !== 'undefined' || null
          ? localStorage.getItem(refreshTokenName)
          : null;


      if (refreshToken) {

        const decodedRefreshToken = jwtDecode(refreshToken);
        if (isTokenExpired(decodedRefreshToken)) {

          localStorage.removeItem(refreshTokenName);
          localStorage.removeItem(tokenName);
          localStorage.removeItem(profileName);
          return false;
        } else {

          if (refreshToken) {
            try {
              const response = await axios({
                method: 'post',
                url: '/api/v1/auth/auth/refresh',
                headers: {
                  Accept: 'application/json',
                  authorization: refreshToken,
                },
              });

              localStorage.setItem(tokenName, response.data.meta.authHeader);
              localStorage.setItem(refreshTokenName, response.data.meta.refreshToken);
              localStorage.setItem(profileName, JSON.stringify(response.data.doc.user));
              return true;
            } catch (error) {

                localStorage.removeItem(refreshTokenName);
                localStorage.removeItem(tokenName);
                localStorage.removeItem(profileName);

                return false;
            }
          }
        }
      }
    } else {
      return true;
    }
  }

  return false;
}

function isTokenExpired(token) {

  if (token) {
    return token.exp < Date.now() / 1000;
  }
  return true;
}


