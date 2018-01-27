import jwtDecode from "jwt-decode";
import {push} from "react-router-redux";
import {AUTH_USER} from "../actions/types";
import {authError} from "../actions";
import axios from "axios/index";



const tokenName = "spectre-domain-token";
const refreshTokenName = 'spectre-domain-refreshToken';
const profileName = 'spectre-domain-profile';

export default function authMiddleware({ dispatch, getState }) {

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
                if (isRefreshTokenExpired(decodedRefreshToken)) {
                    //go to login
                    console.log('è scaduto il refresh token')
                    localStorage.removeItem(refreshTokenName);
                    localStorage.removeItem(tokenName);
                    localStorage.removeItem(profileName);
                    console.log('removed.....')

                }
                else{
                    console.log('API CALL REFRESH....')

                    const authorization = localStorage.getItem(refreshTokenName);
                    console.log(state)
                    if(true){
                    //dispatch({ type: 'LOADING_TOKEN', fetching: true });
                    console.log(action, action.type === 'LOADING_TOKEN', action.fetching)
                    axios({
                        method: 'post',
                        url: '/api/v1/auth/refresh',
                        headers: {"Accept": "application/json","authorization": authorization}
                    }).then(response => {
                        // If request is good...
                        // - Update state to indicate user is authenticated
                        console.log(response)
                        //dispatch({ type: 'LOADING_TOKEN', fetching: false });
                        ///save the jwt token
                        localStorage.setItem(tokenName, response.data.meta.authHeader);
                        localStorage.setItem(refreshTokenName, response.data.meta.refreshToken);
                        localStorage.setItem(profileName, JSON.stringify(response.data.doc.user));

                        return next(action);

                        //redirect to retstricted area by dispatch push
                        //dispatch(push("/"));

                    }).catch((error) => {

                        if (error.response.status === 400) {
                            console.log(error.response.data);
                            //dispatch(push("/login"));
                            localStorage.removeItem(refreshTokenName);
                            localStorage.removeItem(tokenName);
                            localStorage.removeItem(profileName);
                            dispatch(push("/login"));
                            return next(action);
                        }
                        else if (error.response.status === 401) {
                            console.log(error.response.data, 'token non valido / scaduto');
                            //dispatch(push("/login"));
                            localStorage.removeItem(refreshTokenName);
                            localStorage.removeItem(tokenName);
                            localStorage.removeItem(profileName);
                            dispatch(push("/login"));
                            return next(action);

                        }
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
    const dateNow = new Date();
    if(token) {
        return token.exp < Date.now() / 1000
    }
    return true
}

function isRefreshTokenExpired(token){

    console.log(token.exp < Date.now() / 1000)
    if(token) {
        return token.exp < Date.now() / 1000;
    }
    return true
}



function getRefreshToken(){
        //call some api
}