const HeaderValidation = require('../../../../../utilities/validation/header_validation');
const AuthAttempt = require('../../url_validation/attempt_validation');
const AttemptHandler = require('../handlers/attempt_handlers');
const { failAction } = require('../../../../../utilities/error/error-helper');

module.exports = [
	{
		method: 'GET',
		path: '/v1/auth/attempts',
		config: {
			handler: AttemptHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Auth', 'Attempts'],
			description: 'GET Auth Attempts List',
			notes: ['Returns Auth Attempts list filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'AuthAttempt First Level Relations: ' + AuthAttempt.FLRelations + '<br>' +
			'AuthAttempt Second Level Relations: ' + AuthAttempt.SLRelations + '<br>' +
			'Attributes: ' + AuthAttempt.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: AuthAttempt.queryAll,
				// query: Attempts.query,
				failAction: failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/attempts/{authAttemptId}',
		config: {
			handler: AttemptHandler.findOne,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Auth', 'Attempts'],
			description: 'GET One Auth Attempt',
			notes: ['Returns a Auth Attempt identified by the params {authAttemptId} <br>' +
			'Attributes: ' + AuthAttempt.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: AuthAttempt.queryOne,
				params: AuthAttempt.oneParams,
				// query: Attempts.query,
				failAction: failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/attempts',
		config: {
			handler: AttemptHandler.create,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Auth', 'Attempts'],
			description: 'POST a New Auth Attempt',
			notes: ['Save a new Auth Attempt with params in payload with one or more Child object.<br>' +
			'Auth Attempt hasMany Child Model: Auth Attempt object can contain one or more Child object <br>' +
			'Auth Attempt BelongsToMany Child Model: Auth Attempt object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: AuthAttempt.queryLang,
				payload: AuthAttempt.postPayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'PUT',
		path: '/v1/auth/attempts/{authAttemptId}',
		config: {
			handler: AttemptHandler.update,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Auth', 'Attempts'],
			description: 'PUT an Updated Auth Attempt',
			notes: ['Save an updated Auth Attempt with params in payload <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: AuthAttempt.queryLang,
				params: AuthAttempt.oneParams,
				payload: AuthAttempt.putPayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/attempts/{authAttemptId}',
		config: {
			handler: AttemptHandler.delete,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Auth', 'Attempts'],
			description: 'DELETE an Auth Attempt',
			notes: ['Delete un AuthAttempt <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: AuthAttempt.queryLang,
				params: AuthAttempt.oneParams,
				payload: AuthAttempt.deleteOnePayload,
				failAction: failAction,
			},
		},
	},
	// EXTRA CRUD
	{
		method: 'DELETE',
		path: '/v1/auth/attempts/',
		config: {
			handler: AttemptHandler.deleteMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Auth', 'Attempts'],
			description: 'DELETE many Auth Attempts by Ids Array',
			notes: ['Delete many Auth Attempts <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: AuthAttempt.queryLang,
				// params: AuthAttempt.paramOne,
				payload: AuthAttempt.deleteManyPayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/attempts/{authAttemptId}/{childModel}/{childId}',
		config: {
			handler: AttemptHandler.addOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Auth', 'Attempts'],
			description: 'ADD one related Model to Auth Attempt',
			notes: ['Add one related model (to save) to a persisted Auth Attempt <br>' +
			'Add a persisted child Model to Auth Attempt.'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: AuthAttempt.queryLang,
				params: AuthAttempt.addOneParams,
				failAction: failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/attempts/{authAttemptId}/{childModel}/{childId}',
		config: {
			handler: AttemptHandler.removeOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Auth', 'Attempts'],
			description: 'Remove one related Model from Auth Attempt',
			notes: ['Remove one related model (delete) from a persisted Auth Attempt <br>' +
			'Auth Attempt hasMany Child Model: Auth Attempt object can contain one or more Child object <br>' +
			'Auth Attempt BelongsToMany Child Model: Auth Attempt object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: AuthAttempt.queryLang,
				params: AuthAttempt.removeOneParams,
				payload: AuthAttempt.removeOnePayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/attempts/{authAttemptId}/{childModel}',
		config: {
			handler: AttemptHandler.addMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Auth', 'Attempts'],
			description: 'ADD one or more related Model to Auth Attempt',
			notes: ['Add one or more related model (to save) to an existed AuthAttempt <br>' +
			'Auth Attempt hasMany Child Model: Auth Attempt object can contain one or more Child object <br>' +
			'Auth Attempt BelongsToMany Child Model: Auth Attempt object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: AuthAttempt.queryLang,
				params: AuthAttempt.addManyParams,
				payload: AuthAttempt.addManyPayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/attempts/{authAttemptId}/{childModel}',
		config: {
			handler: AttemptHandler.removeMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Auth', 'Attempts'],
			description: 'Remove one or many related Model from Auth Attempt',
			notes: ['Remove one or many related model (delete) from a persisted AuthAttempt <br>' +
			'Auth Attempt hasMany Child Model: Auth Attempt object can contain one or more Child object <br>' +
			'Auth Attempt BelongsToMany Child Model: Auth Attempt object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: AuthAttempt.queryLang,
				params: AuthAttempt.removeManyParams,
				payload: AuthAttempt.removeManyPayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/attempts/{authAttemptId}/{childModel}',
		config: {
			handler: AttemptHandler.getAll,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Auth', 'Attempts', 'GetAll'],
			description: 'Get All AuthAttempt related child model with query filters',
			notes: ['Get All records of Auth Attempt related Child Model <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: AuthAttempt.queryGetAll,
				params: AuthAttempt.getAllParams,
				failAction: failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/attempts/4Select',
		config: {
			handler: AttemptHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'GameApp-AuthUser', 'WebApp-AuthUser'],
				},
			tags: ['api', 'Auth', 'Attempts'],
			description: 'GET Auth Attempts List for Input Select',
			notes: ['Returns Attempts list for input select filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'Auth Attempt First Level Relations, only for query: ' + AuthAttempt.FLRelations + '<br>' +
			'Auth Attempt Second Level Relations only for query: ' + AuthAttempt.SLRelations + '<br>' +
			'Attributes: ' + AuthAttempt.Attributes4Select + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: AuthAttempt.query4Select,
				// query: Attempts.query,
				failAction: failAction,
			},
		},
	},

];