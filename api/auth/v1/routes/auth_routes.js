const HeaderValidation = require('../../../../utilities/validation/header_validation');
const AuthLogin = require('../handler/auth_handlers');
const AuthValidations = require('../../url_validation/auth_validations');
const ErrorHelper = require('../../../../utilities/error/error-helper');

const LoginPre = require('../handler/auth_pre/login_pre');
const ActivationPre = require('../handler/auth_pre/activation_pre');
const ActiveNewPWDPre = require('../handler/auth_pre/active_new_pwd_pre');


module.exports= [
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
		path: '/v1/auth/logout',
		config: {
			handler: AuthLogin.logout,
			auth: {
				scope: ['Logged'],
			},
			tags: ['Logout', 'api', 'v1'],
			description: 'User logout. Destroy his session.',
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
		path: '/v1/auth/refresh',
		config: {
			handler: AuthLogin.refresh,
			auth: {
				scope: ['Refresh'],
			},
			tags: ['Refresh', 'Token', 'api', 'v1'],
			description: 'User refresh his store. Return two refreshed tokens.',
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
		path: '/v1/auth/registration',
		config: {
			handler: AuthLogin.accountRegistration,
			auth: false,
			tags: ['Registration', 'api', 'v1'],
			description: 'Register new User (no active).',
			notes: ['Returns the new User object no active'],
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
		path: '/v1/auth/invitation',
		config: {
			handler: AuthLogin.accountInvitation,
			auth: {
				scope: ['WebApp-Admin']
			},
			tags: ['Invitation', 'api', 'v1'],
			description: 'Admin invites a new User (no active).',
			notes: ['Returns the new User object no active'],
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
		path: '/v1/auth/activation',
		config: {
			handler: AuthLogin.accountActivation,
			auth: false,
			description: 'User account activation.',
			tags: ['Activation', 'api', 'v1'],
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
		path: '/v1/auth/resetPWD',
		config: {
			handler: AuthLogin.resetPWDRequest,
			auth: false,
			tags: ['Reset Password', 'api', 'v1'],
			description: 'Everybody can send request to reset his pwd.',
			notes: ['Returns the updated User object with new pwd not active'],
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
		path: '/v1/auth/activeNewPWD',
		config: {
			handler: AuthLogin.activeNewPWD,
			auth: false,
			description: 'User reset PWD confirm.',
			tags: ['Reset Password', 'api', 'v1'],
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
