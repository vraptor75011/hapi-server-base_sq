import React from 'react';
import {compose} from 'redux';
import LoginForm from '../../components/LoginForm';
import {reduxForm} from 'redux-form';
import { signInUser } from '../../actions/auth';
import {connect} from 'react-redux';



const Login = (props) => {


    return (
        <div>
            <LoginForm {...props}/>
        </div>
    )
};

function mapStateToProps(state) {


    return {errorMessage: state.reducers.auth};
}

export default compose(connect(mapStateToProps, {signInUser}),
    reduxForm({
        form: 'signin',
        fields: ['email', 'password', 'rememberMe'],
    }))(Login)