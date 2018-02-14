const HeaderValidation = require('../../../../utilities/validation/header_validation');
const SessionValidation = require('../../url_validation/session_validation');
const SessionHandler = require('../handlers/session_handlers');
const ErrorHelper = require('../../../../utilities/error/error-helper');

module.exports = [
	{
		method: 'GET',
		path: '/v1/sessions',
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
			'Session First Level Relations: ' + SessionValidation.FLRelations + '<br>' +
			'Session Second Level Relations: ' + SessionValidation.SLRelations + '<br>' +
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
		path: '/v1/sessions/{sessionId}',
		config: {
			handler: SessionHandler.findOne,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'GET One Session',
			notes: ['Returns a Session identified by the params {sessionId} <br>' +
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
		path: '/v1/sessions',
		config: {
			handler: SessionHandler.create,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'POST a New Session',
			notes: ['Save a new Session with params in payload with one or more Child object.<br>' +
			'Session hasMany Child Model: Session object can contain one or more Child object <br>' +
			'Session BelongsToMany Child Model: Session object can contain one or more Child object can contain one Through object'],
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
		path: '/v1/sessions/{sessionId}',
		config: {
			handler: SessionHandler.update,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'PUT an Updated Session',
			notes: ['Save an updated Session with params in payload <br>'],
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
		path: '/v1/sessions/{sessionId}',
		config: {
			handler: SessionHandler.delete,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'DELETE an Session',
			notes: ['Delete un Session <br>'],
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
		path: '/v1/sessions/',
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
		path: '/v1/sessions/{sessionId}/{childModel}/{childId}',
		config: {
			handler: SessionHandler.addOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'ADD one related Model to Session',
			notes: ['Add one related model (to save) to a persisted Session <br>' +
			'Add a persisted child Model to Session.'],
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
		path: '/v1/sessions/{sessionId}/{childModel}/{childId}',
		config: {
			handler: SessionHandler.removeOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'Remove one related Model from Session',
			notes: ['Remove one related model (delete) from a persisted Session <br>' +
			'Session hasMany Child Model: Session object can contain one or more Child object <br>' +
			'Session BelongsToMany Child Model: Session object can contain one or more Child object can contain one Through object'],
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
		path: '/v1/sessions/{sessionId}/{childModel}',
		config: {
			handler: SessionHandler.addMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'ADD one or more related Model to Session',
			notes: ['Add one or more related model (to save) to an existed Session <br>' +
			'Session hasMany Child Model: Session object can contain one or more Child object <br>' +
			'Session BelongsToMany Child Model: Session object can contain one or more Child object can contain one Through object'],
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
		path: '/v1/sessions/{sessionId}/{childModel}',
		config: {
			handler: SessionHandler.removeMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'Remove one or many related Model from Session',
			notes: ['Remove one or many related model (delete) from a persisted Session <br>' +
			'Session hasMany Child Model: Session object can contain one or more Child object <br>' +
			'Session BelongsToMany Child Model: Session object can contain one or more Child object can contain one Through object'],
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
		path: '/v1/sessions/{sessionId}/{childModel}',
		config: {
			handler: SessionHandler.getAll,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Sessions'],
			description: 'Get All Session related child model with query filters',
			notes: ['Get All records of Session related Child Model <br>'],
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
		path: '/v1/sessions/4Select',
		config: {
			handler: SessionHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'GameApp-User', 'WebApp-User'],
				},
			tags: ['api', 'Sessions'],
			description: 'GET Sessions List for Input Select',
			notes: ['Returns Sessions list for input select filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'User First Level Relations, only for query: ' + SessionValidation.FLRelations + '<br>' +
			'User Second Level Relations only for query: ' + SessionValidation.SLRelations + '<br>' +
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