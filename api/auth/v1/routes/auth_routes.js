const HeaderValidation = require('../../../../utilities/validation/header_validation');
const AuthLogin = require('../handler/auth_handlers/auth_handlers');
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
	]);

	next()
};

module.exports.register.attributes = {
	name: 'api.auth',
	version: '0.0.1',
};
