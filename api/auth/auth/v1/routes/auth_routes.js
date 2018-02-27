const HeaderValidation = require('../../../../../utilities/validation/header_validation');
const AuthLogin = require('../handler/auth_handlers');
const AuthValidations = require('../../url_validation/auth_validations');
const ErrorHelper = require('../../../../../utilities/error/error-helper');

const LoginPre = require('../handler/auth_pre/login_pre');
const ActivationPre = require('../handler/auth_pre/activation_pre');
const ActiveNewPWDPre = require('../handler/auth_pre/active_new_pwd_pre');


module.exports= [
	{
		method: 'POST',
		path: '/v1/auth/auth/login',
		config: {
			handler: AuthLogin.login,
			auth: false,
			tags: ['api', 'Auth', 'Login'],
			description: 'AuthUser login.',
			notes: ['Returns TOKENS after AuthUser authentication'],
			validate: {
				options: {
					abortEarly: false
				},
				query: AuthValidations.queryLang,
				payload: AuthValidations.loginPayload,
				failAction: ErrorHelper.failAction,
			},
			pre: LoginPre,
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/auth/logout',
		config: {
			handler: AuthLogin.logout,
			auth: {
				scope: ['Logged'],
			},
			tags: ['api', 'Auth', 'Logout'],
			description: 'AuthUser logout. Destroy his session.',
			notes: ['Returns true if destroy completed'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: AuthValidations.queryLang,
				payload: AuthValidations.logoutPayload,
				failAction: ErrorHelper.failAction,
			},

		},
	},
	{
		method: 'POST',
		path: '/v1/auth/auth/refresh',
		config: {
			handler: AuthLogin.refresh,
			auth: {
				scope: ['Refresh'],
			},
			tags: ['api', 'Auth', 'Refresh', 'Token'],
			description: 'AuthUser refresh his store. Return two refreshed tokens.',
			notes: ['Returns two refreshed tokens if refresh store is OK'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: AuthValidations.queryLang,
				payload: AuthValidations.logoutPayload,
				failAction: ErrorHelper.failAction,
			},

		},
	},
	{
		method: 'POST',
		path: '/v1/auth/auth/registration',
		config: {
			handler: AuthLogin.accountRegistration,
			auth: false,
			tags: ['api', 'Auth', 'Registration'],
			description: 'Register new AuthUser (no active).',
			notes: ['Returns the new AuthUser object no active'],
			validate: {
				options: {
					abortEarly: false
				},
				query: AuthValidations.queryLang,
				payload: AuthValidations.registrationPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/auth/invitation',
		config: {
			handler: AuthLogin.accountInvitation,
			auth: {
				scope: ['WebApp-Admin']
			},
			tags: ['api', 'Auth', 'Invitation'],
			description: 'Admin invites a new AuthUser (no active).',
			notes: ['Returns the new AuthUser object no active'],
			validate: {
				options: {
					abortEarly: false
				},
				query: AuthValidations.queryLang,
				payload: AuthValidations.invitationPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/auth/activation',
		config: {
			handler: AuthLogin.accountActivation,
			auth: false,
			description: 'AuthUser account activation.',
			tags: ['api', 'Auth', 'Activation'],
			validate: {
				options: {
					abortEarly: false
				},
				query: AuthValidations.activationQuery,
				failAction: ErrorHelper.failAction,
			},
			pre: ActivationPre,
		}
	},
	{
		method: 'POST',
		path: '/v1/auth/auth/resetPWD',
		config: {
			handler: AuthLogin.resetPWDRequest,
			auth: false,
			tags: ['api', 'Auth', 'Reset', 'Password'],
			description: 'Everybody can send request to reset his pwd.',
			notes: ['Returns the updated AuthUser object with new pwd not active'],
			validate: {
				options: {
					abortEarly: false
				},
				query: AuthValidations.queryLang,
				payload: AuthValidations.resetPWDPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/auth/activeNewPWD',
		config: {
			handler: AuthLogin.activeNewPWD,
			auth: false,
			description: 'AuthUser reset PWD confirm.',
			tags: ['api', 'Auth', 'Reset', 'Password'],
			validate: {
				options: {
					abortEarly: false
				},
				query: AuthValidations.activationQuery,
				failAction: ErrorHelper.failAction,
			},
			pre: ActiveNewPWDPre,
		}
	},
];
