import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';

export default function (ComposedComponent) {
    class Authentication extends Component {
        static contextTypes = {
            router: PropTypes.object
        }

        componentWillMount() {

            if (!localStorage.getItem('token')) {
                //this.props.routeActions.push('/foo'); push('/');
                console.log(!localStorage.getItem('token'), !this.props.authenticated)
                this.props.dispatch(push("/login"));
            }
        }

        componentWillUpdate(nextProps) {
            if (!localStorage.getItem('token')) {
                //push('/');
                console.log(!localStorage.getItem('token'), !nextProps.authenticated)
                this.props.dispatch(push("/login"));
            }
        }

        render() {
            console.log('AUTORIZED', localStorage.getItem('token'), sessionStorage.getItem('token'))
            return <ComposedComponent {...this.props} />
        }
    }

    function mapStateToProps(state) {
        return {authenticated: state.reducers.auth.authenticated};
    }

    return connect(mapStateToProps)(Authentication);
}