import jwtDecode from "jwt-decode";
import {push} from "react-router-redux";



let tokenName = "spectre-domain-token";
const refreshTokenName = 'spectre-domain-refreshToken';

export default function authMiddleware({ dispatch, getState }) {



    return (next) => (action) => {
            let state = getState();

        console.log(action && action.payload && action.payload.pathname !== "/login" && action.payload.pathname !== "undefined")
        console.log(action )
        console.log(action.payload)
        console.log(action.payload.pathname !== "/login")
        console.log(action.payload.pathname !== "undefined")
if(action && action.payload && action.payload.pathname !== "/login" && action.payload.pathname !== "undefined") {
    const token = localStorage.getItem(tokenName) !== 'undefined' || null ? localStorage.getItem(tokenName) : null;

    if (token) {
        const decodedToken = jwtDecode(token);
        console.log(isTokenExpired(decodedToken))
        if (isTokenExpired(decodedToken)) {
            ///se il token è scaduto....
            const refreshToken = localStorage.getItem(refreshTokenName) !== 'undefined' || null ? localStorage.getItem(refreshTokenName) : null;

            if (refreshToken) {

                if (isRefreshTokenExpired(decodedToken)) {
                    //go to login
                    console.log('è scaduto il refresh token')
                    dispatch(push("/login"));
                }
                else {
                    getRefreshToken()
                    console.log('get new tken')
                }
            }
            else {
                //vai al login
                //dispatch(push("/"));
            }

        }

    }
}

        return next(action);
    }
}


function isTokenExpired(token) {
    const dateNow = new Date();
    if(token.exp < dateNow.getTime()) {
        return true
    }
    return false
}

function isRefreshTokenExpired(token){

    const dateNow = new Date();

    if(token.exp < dateNow.getTime()) {
        return true
    }
    return false
}

function getRefreshToken(){
        //call some api
}