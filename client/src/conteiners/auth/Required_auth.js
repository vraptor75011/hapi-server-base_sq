import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';

const tokenName = "spectre-domain-token";
const refreshTokenName = 'spectre-domain-refreshToken';
const profileName = 'spectre-domain-profile';

export default function (ComposedComponent) {
    class Authentication extends Component {
        static contextTypes = {
            router: PropTypes.object
        };

        componentWillMount() {


console.log(tokenName, localStorage.getItem(tokenName))
            if (!localStorage.getItem(tokenName)) {

                this.props.dispatch(push("/login"));
            }
        }

        componentWillUpdate(nextProps) {
            if (!localStorage.getItem(tokenName)) {

                this.props.dispatch(push("/login"));
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