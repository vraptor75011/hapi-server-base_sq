import axios from 'axios';
import  jwtDecode from  'jwt-decode';
import {push} from 'react-router-redux';
import {AUTH_ERROR, AUTH_USER, UNAUTH_USER, LOADING_TOKEN} from './types'

//require('axios-debug')(axios);
//const ROOT_URL = 'http://localhost:8000';
const tokenName = "spectre-domain-token";
const refreshTokenName = 'spectre-domain-refreshToken';
const profileName = 'spectre-domain-profile';


export function authError(error) {

    return {
        type: AUTH_ERROR,
        payload: error
    }

}

export function signInUser(fields) {

    return function (dispatch) {

        const {email, password, rememberMe} = fields;

        let data = {
            "email": email,
            "password": password
        };


        axios.post(`/api/v1/auth/login`, data)
            .then(response => {
                // If request is good...
                // - Update state to indicate user is authenticated
                console.log(response)
                dispatch({
                    type: AUTH_USER
                });
                ///save the jwt token
                localStorage.setItem(tokenName, response.data.meta.authHeader);
                localStorage.setItem(refreshTokenName, response.data.meta.refreshToken);
                localStorage.setItem(profileName, JSON.stringify(response.data.doc.user));
                console.log(response.data.doc.user)

                console.log('REDIRECT')
                //redirect to retstricted area by dispatch push
                dispatch(push("/"));


            }).catch((error) => {
            dispatch(authError('Bed login'))
            console.log(error)
            if (error.response.status === 400) {
                console.log(error.response.data)
            }
            ;
        });


    }

}

export function signoutUser() {

    return function (dispatch) {

        const token = localStorage.getItem(tokenName) !== 'undefined' || null ? localStorage.getItem(tokenName) : null;
        if (token) {

            localStorage.removeItem(tokenName);
            localStorage.removeItem(refreshTokenName);
            localStorage.removeItem(profileName);
            dispatch(push("/Login"));
           /* const decoded = jwtDecode(token);
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

            axios.delete(`/api/v1/session/${decoded.sessionId}`, {
                "hardDelete": true
            }).then(response => {
                localStorage.removeItem(tokenName);
                localStorage.removeItem(refreshTokenName);
                localStorage.removeItem(profileName);
                dispatch({
                    type: UNAUTH_USER
                });
                dispatch(push("/"));

            }).catch((error) => {


                if (error.response && error.response.status === 401) {
                    //if request is unauthorized redirect to login page
                    dispatch(push("/login"));
                }
            });*/


        }

    }



}


export function refreshToken(fields) {

    return function (dispatch) {

        const authorization = localStorage.getItem(refreshTokenName);



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



            //redirect to retstricted area by dispatch push
            //dispatch(push("/"));

        }).catch((error) => {
            dispatch(authError('Bed login'));
            console.log(error)
            if (error.response.status === 400) {
                console.log(error.response.data);
                dispatch(push("/login"));
            }
        });


    }

}





