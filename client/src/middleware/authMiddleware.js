import jwtDecode from "jwt-decode";
import {push} from "react-router-redux";
import {AUTH_USER} from "../actions/types";
import {authError} from "../actions/auth";
import axios from "axios/index";
import { tokenName, refreshTokenName, profileName } from '../config';



export default function authMiddleware({ dispatch, getState }) {
console.log('*****CALLLL MIDDLEWERE*********************')
    return (next) => (action) => {
            let state = getState();

if(action) {
    const token = localStorage.getItem(tokenName) !== 'undefined' || null ? localStorage.getItem(tokenName) : null;

    if (token) {
        const decodedToken = jwtDecode(token);
console.log('il token esiste')
        if (isTokenExpired(decodedToken)) {
            ///se il token è scaduto....
            const refreshToken = localStorage.getItem(refreshTokenName) !== 'undefined' || null ? localStorage.getItem(refreshTokenName) : null;
            console.log('il token è scaduto')

            if (refreshToken) {
                console.log('il refresh token esiste')
                const decodedRefreshToken = jwtDecode(refreshToken);
                if (isTokenExpired(decodedRefreshToken)) {
                    //go to login
                    console.log('è scaduto il refresh token')
                    localStorage.removeItem(refreshTokenName);
                    localStorage.removeItem(tokenName);
                    localStorage.removeItem(profileName);
                    console.log('removed.....')

                }
                else{
                    console.log('API CALL REFRESH....')

                    if(refreshTokenName){

                    axios({
                        method: 'post',
                        url: '/api/v1/auth/refresh',
                        headers: {"Accept": "application/json","authorization": refreshTokenName}
                    }).then(response => {
                        // If request is good...
                        ///save the jwt token
                        localStorage.setItem(tokenName, response.data.meta.authHeader);
                        localStorage.setItem(refreshTokenName, response.data.meta.refreshToken);
                        localStorage.setItem(profileName, JSON.stringify(response.data.doc.user));
                        return next(action);
                    }).catch((error) => {

                            localStorage.removeItem(refreshTokenName);
                            localStorage.removeItem(tokenName);
                            localStorage.removeItem(profileName);
                            dispatch(push("/login"));
                            return next(action);


                    });
                }
                }

            }


        }


    }

}

        return next(action);
    }
}


function isTokenExpired(token) {

    if(token) {
        return token.exp < Date.now() / 1000
    }
    return true
}

