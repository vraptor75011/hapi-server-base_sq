import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import jwtDecode from "jwt-decode";
import * as actions from '../../actions';
import { bindActionCreators } from 'redux';

function isTokenExpired(token) {
    const dateNow = new Date();
    if(token.exp < dateNow.getTime()/ 1000) {
        return true
    }
    return false
}

function isRefreshTokenExpired(refreshToken){

    const dateNow = new Date();

    console.log('REFRESHTOKEN', refreshToken)
    if(refreshToken.exp < dateNow.getTime()/ 1000) {
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
                console.log('****** il token esiste', 'è scaduto?', isTokenExpired(decodedToken) )
                if (isTokenExpired(decodedToken)) {
                    ///se il token è scaduto....
                    const refreshToken = localStorage.getItem(refreshTokenName) !== 'undefined' || null ? localStorage.getItem(refreshTokenName) : null;

                    if (refreshToken) {
                        const decodedRefreshToken = jwtDecode(refreshToken);
                        console.log('il refresh token è valido:', isRefreshTokenExpired(decodedRefreshToken))
                        if (isRefreshTokenExpired(decodedRefreshToken)) {
                            //go to login
                            console.log('è scaduto il refresh token')
                            this.props.history.push("/login");
                        }
                        else {
                            //getRefreshToken()

                            this.props.refreshToken();

                        }
                    }
                    else {
                        //vai al login
                        this.props.history.push("/login");
                    }

                }

            }
            else if(!token){
                return this.props.history.push("/login");
            }

        }


        componentWillUpdate(nextProps) {
            const token = localStorage.getItem(tokenName) !== 'undefined' || null ? localStorage.getItem(tokenName) : null;

            if (token) {
                const decodedToken = jwtDecode(token);
                console.log('******',this.props)
                console.log(isTokenExpired(decodedToken))
                if (isTokenExpired(decodedToken)) {
                    ///se il token è scaduto....
                    const refreshToken = localStorage.getItem(refreshTokenName) !== 'undefined' || null ? localStorage.getItem(refreshTokenName) : null;

                    if (refreshToken) {
                        const decodedRefreshToken = jwtDecode(refreshToken);
                        if (isRefreshTokenExpired(decodedRefreshToken)) {
                            //go to login
                            console.log('è scaduto il refresh token')
                            this.props.history.push("/login");
                        }
                        else {
                            //getRefreshToken()

                            this.props.refreshToken();

                        }
                    }
                    else {
                        //vai al login
                        this.props.history.push("/login");
                    }

                }

            }
            else if(!token){
                return this.props.history.push("/login");
            }
        }

        render() {
console.log(this.props)
            return <ComposedComponent {...this.props} />
        }
    }

    function mapStateToProps(state) {
        return {authenticated: state.reducers.auth.authenticated};
    }

    function mapDispatchToProps(dispatch) {
        return {actions: bindActionCreators(actions, dispatch)};
    }

    return connect(mapStateToProps, actions)(Authentication);
}


