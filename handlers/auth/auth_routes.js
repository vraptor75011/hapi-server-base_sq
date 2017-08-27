const AuthHandlers = require('./auth_handlers');
const AuthValidations = require('./auth_validations');

const LoginPre = require('./auth_pre/login_pre');


module.exports.register = (server, options, next) => {

	server.route([
		{
			method: 'POST',
			path: '/login',
			config: {
				handler: AuthHandlers.login,
				auth: false,
				tags: ['api', 'Login'],
				description: 'User login.',
				notes: ['Returns TOKENS after User authentication'],
				validate: {
					payload: AuthValidations.payload
				},
				pre: LoginPre,
			},
		}
	]);

	next()
};

module.exports.register.attributes = {
	name: 'api.auth',
	version: '0.0.1',
};
