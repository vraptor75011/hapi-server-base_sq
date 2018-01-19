import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import jwtDecode from "jwt-decode";

function isTokenExpired(token) {
    const dateNow = new Date();
    if(token.exp < dateNow.getTime()/ 1000) {
        return true
    }
    return false
}

function isRefreshTokenExpired(token){

    const dateNow = new Date();

    if(token.exp < dateNow.getTime()/ 1000) {
        return true
    }
    return false
}

function getRefreshToken(){
    //call some api
}

let tokenName = "spectre-domain-token";
const refreshTokenName = 'spectre-domain-refreshToken';



export default function (ComposedComponent) {
    class Authentication extends Component {
        static contextTypes = {
            router: PropTypes.object
        }

        componentWillMount() {
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
                            this.props.dispatch(push("/login"));
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
                else{
                    return

                }

            }
            return this.props.dispatch(push("/login"));
        }


        componentWillUpdate(nextProps) {
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
                            this.props.dispatch(push("/login"));
                        }
                        else {
                            getRefreshToken()
                            console.log('get new tken')
                        }
                    }


                }

            }
            else{
                return

            }

        }

        render() {

            return <ComposedComponent {...this.props} />
        }
    }

    function mapStateToProps(state) {
        return {authenticated: state.reducers.auth.authenticated};
    }

    return connect(mapStateToProps)(Authentication);
}