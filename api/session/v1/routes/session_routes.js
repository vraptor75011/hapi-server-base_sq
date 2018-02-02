const HeaderValidation = require('../../../../utilities/validation/header_validation');
const SessionValidation = require('../../url_validation/session_validation');
const SessionHandler = require('../handlers/session_handlers');

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
				query: SessionValidation.queryAll,
				// query: SessionValidations.query,
				headers: HeaderValidation.headerRequired,
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
				params: SessionValidation.oneParams,
				query: SessionValidation.queryOne,
				// query: SessionValidations.query,
				headers: HeaderValidation.headerRequired,
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
				payload: SessionValidation.postPayload,
				headers: HeaderValidation.headerRequired,
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
				params: SessionValidation.oneParams,
				payload: SessionValidation.putPayload,
				headers: HeaderValidation.headerRequired,
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
				params: SessionValidation.oneParams,
				payload: SessionValidation.deleteOnePayload,
				headers: HeaderValidation.headerRequired,
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
				// params: SessionValidation.paramOne,
				payload: SessionValidation.deleteManyPayload,
				headers: HeaderValidation.headerRequired,
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
				params: SessionValidation.addOneParams,
				headers: HeaderValidation.headerRequired,
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
				params: SessionValidation.removeOneParams,
				payload: SessionValidation.removeOnePayload,
				headers: HeaderValidation.headerRequired,
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
				params: SessionValidation.addManyParams,
				payload: SessionValidation.addManyPayload,
				headers: HeaderValidation.headerRequired,
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
				params: SessionValidation.removeManyParams,
				payload: SessionValidation.removeManyPayload,
				headers: HeaderValidation.headerRequired,
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
				params: SessionValidation.getAllParams,
				query: SessionValidation.queryGetAll,
				headers: HeaderValidation.headerRequired,
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
				query: SessionValidation.query4Select,
				// query: UserValidations.query,
				headers: HeaderValidation.headerRequired,
			},
		},
	},
];