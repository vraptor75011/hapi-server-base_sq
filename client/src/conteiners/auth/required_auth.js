import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';

import { getToken, setToken } from '../../helpers/store/store_manager';


const standardToken = "standardToken";
const refreshToken = 'refreshToken';
const profile = 'profile';

export default function (ComposedComponent) {
	class Authentication extends Component {
		static contextTypes = {
			router: PropTypes.object
		};

		componentWillMount() {
			let token = getToken();
			console.log('Token: ', token);
			console.log('History: ', this.props.history);

			if (!token) {
				this.props.dispatch(push("/login"));
			}
		}

		componentWillUpdate(nextProps) {
			let token = getToken();
			console.log('Token: ', token);
			console.log('History: ', this.props.history);
			if (!token) {
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