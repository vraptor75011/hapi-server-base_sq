const HeaderValidation = require('../../../../utilities/validation/header_validation');
const AuthLogin = require('../handler/auth_handlers');
const AuthValidations = require('../../url_validation/auth_validations');

const LoginPre = require('../handler/auth_pre/login_pre');


module.exports.register = (server, options, next) => {

	server.route([
		{
			method: 'POST',
			path: '/v1/auth/login',
			config: {
				handler: AuthLogin.login,
				auth: false,
				tags: ['Login', 'api', 'v1'],
				description: 'User login.',
				notes: ['Returns TOKENS after User authentication'],
				validate: {
					payload: AuthValidations.loginPayload
				},
				pre: LoginPre,
			},
		},
		{
			method: 'POST',
			path: '/v1/auth/logout',
			config: {
				handler: AuthLogin.logout,
				auth: 					{
					scope: ['Logged'],
				},
				tags: ['Logout', 'api', 'v1'],
				description: 'User logout. Destroy his session.',
				notes: ['Returns true if destroy completed'],
				validate: {
					headers: HeaderValidation.headerRequired,
					payload: AuthValidations.logoutPayload,
				},
			},
		},
		{
			method: 'POST',
			path: '/v1/auth/refresh',
			config: {
				handler: AuthLogin.refresh,
				auth: 					{
					scope: ['Refresh'],
				},
				tags: ['Refresh', 'Token', 'api', 'v1'],
				description: 'User refresh his token. Return two refreshed tokens.',
				notes: ['Returns two refreshed tokens if refresh token is OK'],
				validate: {
					headers: HeaderValidation.headerRequired,
					// payload: AuthValidations.logoutPayload,
				},
			},
		},
		{
			method: 'POST',
			path: '/v1/auth/registration',
			config: {
				handler: AuthLogin.registration,
				auth: false,
				tags: ['Registration', 'api', 'v1'],
				description: 'Register new User (no active).',
				notes: ['Returns the new User object'],
				validate: {
					payload: AuthValidations.registrationPayload
				},
			},
		},
	]);

	next()
};

module.exports.register.attributes = {
	name: 'api.auth',
	version: '0.0.1',
};
