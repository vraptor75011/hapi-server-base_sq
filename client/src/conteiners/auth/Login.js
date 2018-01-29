import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import LoginForm from '../../components/LoginForm';

import {authErrors, isAuthenticated} from '../../reducers';
import * as actions from "../../actions/auth";

import {compose} from "redux";
import {reduxForm} from "redux-form";


const Login = (props) => {

    console.log(props.isAuthenticated)
    if(props.isAuthenticated) {
        return  <Redirect to='/' />
    }

    return (
        <div>
            <LoginForm {...props}/>
        </div>
    )
};

const mapStateToProps = (state) => {
    console.log(state)
    return({ errors: authErrors(state),
        isAuthenticated: isAuthenticated(state)

})};

export default compose(connect(mapStateToProps, actions),
    reduxForm({
        form: 'LoginForm',
        login: ['email', 'password'],
    })
)(Login)