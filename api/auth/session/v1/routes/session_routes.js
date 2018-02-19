const HeaderValidation = require('../../../../../utilities/validation/header_validation');
const SessionValidation = require('../../url_validation/session_validation');
const SessionHandler = require('../handlers/session_handlers');
const ErrorHelper = require('../../../../../utilities/error/error-helper');

module.exports = [
	{
		method: 'GET',
		path: '/v1/auth/sessions',
		config: {
			handler: SessionHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'GET Sessions List',
			notes: ['Returns Sessions list filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'AuthSession First Level Relations: ' + SessionValidation.FLRelations + '<br>' +
			'AuthSession Second Level Relations: ' + SessionValidation.SLRelations + '<br>' +
			'Attributes: ' + SessionValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: SessionValidation.queryAll,
				// query: SessionValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/sessions/{sessionId}',
		config: {
			handler: SessionHandler.findOne,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'GET One AuthSession',
			notes: ['Returns a AuthSession identified by the params {sessionId} <br>' +
			'Attributes: ' + SessionValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: SessionValidation.queryOne,
				params: SessionValidation.oneParams,
				// query: SessionValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/sessions',
		config: {
			handler: SessionHandler.create,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'POST a New AuthSession',
			notes: ['Save a new AuthSession with params in payload with one or more Child object.<br>' +
			'AuthSession hasMany Child Model: AuthSession object can contain one or more Child object <br>' +
			'AuthSession BelongsToMany Child Model: AuthSession object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: SessionValidation.queryLang,
				payload: SessionValidation.postPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'PUT',
		path: '/v1/auth/sessions/{sessionId}',
		config: {
			handler: SessionHandler.update,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'PUT an Updated AuthSession',
			notes: ['Save an updated AuthSession with params in payload <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: SessionValidation.queryLang,
				params: SessionValidation.oneParams,
				payload: SessionValidation.putPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/sessions/{sessionId}',
		config: {
			handler: SessionHandler.delete,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'DELETE an AuthSession',
			notes: ['Delete un AuthSession <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: SessionValidation.queryLang,
				params: SessionValidation.oneParams,
				payload: SessionValidation.deleteOnePayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	// EXTRA CRUD
	{
		method: 'DELETE',
		path: '/v1/auth/sessions/',
		config: {
			handler: SessionHandler.deleteMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'DELETE many Sessions by Ids Array',
			notes: ['Delete many Sessions <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: SessionValidation.queryLang,
				// params: SessionValidation.paramOne,
				payload: SessionValidation.deleteManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/sessions/{sessionId}/{childModel}/{childId}',
		config: {
			handler: SessionHandler.addOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'ADD one related Model to AuthSession',
			notes: ['Add one related model (to save) to a persisted AuthSession <br>' +
			'Add a persisted child Model to AuthSession.'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: SessionValidation.queryLang,
				params: SessionValidation.addOneParams,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/sessions/{sessionId}/{childModel}/{childId}',
		config: {
			handler: SessionHandler.removeOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'Remove one related Model from AuthSession',
			notes: ['Remove one related model (delete) from a persisted AuthSession <br>' +
			'AuthSession hasMany Child Model: AuthSession object can contain one or more Child object <br>' +
			'AuthSession BelongsToMany Child Model: AuthSession object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: SessionValidation.queryLang,
				params: SessionValidation.removeOneParams,
				payload: SessionValidation.removeOnePayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/sessions/{sessionId}/{childModel}',
		config: {
			handler: SessionHandler.addMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'ADD one or more related Model to AuthSession',
			notes: ['Add one or more related model (to save) to an existed AuthSession <br>' +
			'AuthSession hasMany Child Model: AuthSession object can contain one or more Child object <br>' +
			'AuthSession BelongsToMany Child Model: AuthSession object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: SessionValidation.queryLang,
				params: SessionValidation.addManyParams,
				payload: SessionValidation.addManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/sessions/{sessionId}/{childModel}',
		config: {
			handler: SessionHandler.removeMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'Remove one or many related Model from AuthSession',
			notes: ['Remove one or many related model (delete) from a persisted AuthSession <br>' +
			'AuthSession hasMany Child Model: AuthSession object can contain one or more Child object <br>' +
			'AuthSession BelongsToMany Child Model: AuthSession object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: SessionValidation.queryLang,
				params: SessionValidation.removeManyParams,
				payload: SessionValidation.removeManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/sessions/{sessionId}/{childModel}',
		config: {
			handler: SessionHandler.getAll,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'Get All AuthSession related child model with query filters',
			notes: ['Get All records of AuthSession related Child Model <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: SessionValidation.queryGetAll,
				params: SessionValidation.getAllParams,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/sessions/4Select',
		config: {
			handler: SessionHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'Logged'],
				},
			tags: ['api', 'Sessions'],
			description: 'GET Sessions List for Input Select',
			notes: ['Returns Sessions list for input select filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'AuthUser First Level Relations, only for query: ' + SessionValidation.FLRelations + '<br>' +
			'AuthUser Second Level Relations only for query: ' + SessionValidation.SLRelations + '<br>' +
			'Attributes: ' + SessionValidation.Attributes4Select + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: SessionValidation.query4Select,
				// query: UserValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
];