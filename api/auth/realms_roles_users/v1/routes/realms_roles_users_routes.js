const HeaderValidation = require('../../../../../utilities/validation/header_validation');
const RealmsRolesUsersValidation = require('../../url_validation/realms_roles_users_validation');
const RealmsRolesUsersHandler = require('../handlers/realms_roles_users_handlers');
const ErrorHelper = require('../../../../../utilities/error/error-helper');

module.exports = [
	{
		method: 'GET',
		path: '/v1/auth/realmsRolesUsers',
		config: {
			handler: RealmsRolesUsersHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'AuthRealmsRolesUsers'],
			description: 'GET AuthRealmsRolesUsers List',
			notes: ['Returns AuthRealmsRolesUsers list filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'AuthRealmsRolesUsers First Level Relations: ' + RealmsRolesUsersValidation.FLRelations + '<br>' +
			'AuthRealmsRolesUsers Second Level Relations: ' + RealmsRolesUsersValidation.SLRelations + '<br>' +
			'Attributes: ' + RealmsRolesUsersValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmsRolesUsersValidation.queryAll,
				// query: RealmsRolesUsersValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/realmsRolesUsers/{realmsRolesUsersId}',
		config: {
			handler: RealmsRolesUsersHandler.findOne,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'AuthRealmsRolesUsers'],
			description: 'GET One AuthRealmsRolesUsers',
			notes: ['Returns a AuthRealmsRolesUsers identified by the params {realmsRolesUsersId} <br>' +
			'Attributes: ' + RealmsRolesUsersValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmsRolesUsersValidation.queryOne,
				params: RealmsRolesUsersValidation.oneParams,
				// query: RealmsRolesUsersValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/realmsRolesUsers',
		config: {
			handler: RealmsRolesUsersHandler.create,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'AuthRealmsRolesUsers'],
			description: 'POST a New AuthRealmsRolesUsers',
			notes: ['Save a new AuthRealmsRolesUsers with params in payload with one or more Child object.<br>' +
			'AuthRealmsRolesUsers hasMany Child Model: AuthRealmsRolesUsers object can contain one or more Child object <br>' +
			'AuthRealmsRolesUsers BelongsToMany Child Model: AuthRealmsRolesUsers object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmsRolesUsersValidation.queryLang,
				payload: RealmsRolesUsersValidation.postPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'PUT',
		path: '/v1/auth/realmsRolesUsers/{realmsRolesUsersId}',
		config: {
			handler: RealmsRolesUsersHandler.update,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'AuthRealmsRolesUsers'],
			description: 'PUT an Updated AuthRealmsRolesUsers',
			notes: ['Save an updated AuthRealmsRolesUsers with params in payload <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmsRolesUsersValidation.queryLang,
				params: RealmsRolesUsersValidation.oneParams,
				payload: RealmsRolesUsersValidation.putPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/realmsRolesUsers/{realmsRolesUsersId}',
		config: {
			handler: RealmsRolesUsersHandler.delete,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'AuthRealmsRolesUsers'],
			description: 'DELETE an AuthRealmsRolesUsers',
			notes: ['Delete un AuthRealmsRolesUsers <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmsRolesUsersValidation.queryLang,
				params: RealmsRolesUsersValidation.oneParams,
				payload: RealmsRolesUsersValidation.deleteOnePayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	// EXTRA CRUD
	{
		method: 'DELETE',
		path: '/v1/auth/realmsRolesUsers/',
		config: {
			handler: RealmsRolesUsersHandler.deleteMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'AuthRealmsRolesUsers'],
			description: 'DELETE many AuthRealmsRolesUsers by Ids Array',
			notes: ['Delete many AuthRealmsRolesUsers <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmsRolesUsersValidation.queryLang,
				// params: RealmsRolesUsersValidation.paramOne,
				payload: RealmsRolesUsersValidation.deleteManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/realmsRolesUsers/{realmsRolesUsersId}/{childModel}/{childId}',
		config: {
			handler: RealmsRolesUsersHandler.addOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'AuthRealmsRolesUsers'],
			description: 'ADD one related Model to AuthRealmsRolesUsers',
			notes: ['Add one related model (to save) to a persisted AuthRealmsRolesUsers <br>' +
			'Add a persisted child Model to AuthRealmsRolesUsers.'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmsRolesUsersValidation.queryLang,
				params: RealmsRolesUsersValidation.addOneParams,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/realmsRolesUsers/{realmsRolesUsersId}/{childModel}/{childId}',
		config: {
			handler: RealmsRolesUsersHandler.removeOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'AuthRealmsRolesUsers'],
			description: 'Remove one related Model from AuthRealmsRolesUsers',
			notes: ['Remove one related model (delete) from a persisted AuthRealmsRolesUsers <br>' +
			'AuthRealmsRolesUsers hasMany Child Model: AuthRealmsRolesUsers object can contain one or more Child object <br>' +
			'AuthRealmsRolesUsers BelongsToMany Child Model: AuthRealmsRolesUsers object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmsRolesUsersValidation.queryLang,
				params: RealmsRolesUsersValidation.removeOneParams,
				payload: RealmsRolesUsersValidation.removeOnePayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/realmsRolesUsers/{realmsRolesUsersId}/{childModel}',
		config: {
			handler: RealmsRolesUsersHandler.addMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'AuthRealmsRolesUsers'],
			description: 'ADD one or more related Model to AuthRealmsRolesUsers',
			notes: ['Add one or more related model (to save) to an existed AuthRealmsRolesUsers <br>' +
			'AuthRealmsRolesUsers hasMany Child Model: AuthRealmsRolesUsers object can contain one or more Child object <br>' +
			'AuthRealmsRolesUsers BelongsToMany Child Model: AuthRealmsRolesUsers object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmsRolesUsersValidation.queryLang,
				params: RealmsRolesUsersValidation.addManyParams,
				payload: RealmsRolesUsersValidation.addManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/realmsRolesUsers/{realmsRolesUsersId}/{childModel}',
		config: {
			handler: RealmsRolesUsersHandler.removeMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'AuthRealmsRolesUsers'],
			description: 'Remove one or many related Model from AuthRealmsRolesUsers',
			notes: ['Remove one or many related model (delete) from a persisted AuthRealmsRolesUsers <br>' +
			'AuthRealmsRolesUsers hasMany Child Model: AuthRealmsRolesUsers object can contain one or more Child object <br>' +
			'AuthRealmsRolesUsers BelongsToMany Child Model: AuthRealmsRolesUsers object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmsRolesUsersValidation.queryLang,
				params: RealmsRolesUsersValidation.removeManyParams,
				payload: RealmsRolesUsersValidation.removeManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/realmsRolesUsers/{realmsRolesUsersId}/{childModel}',
		config: {
			handler: RealmsRolesUsersHandler.getAll,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'AuthRealmsRolesUsers'],
			description: 'Get All AuthRealmsRolesUsers related child model with query filters',
			notes: ['Get All records of AuthRealmsRolesUsers related Child Model <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmsRolesUsersValidation.queryGetAll,
				params: RealmsRolesUsersValidation.getAllParams,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/realmsRolesUsers/4Select',
		config: {
			handler: RealmsRolesUsersHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'GameApp-AuthUser', 'WebApp-AuthUser'],
				},
			tags: ['api', 'AuthRealmsRolesUsers'],
			description: 'GET AuthRealmsRolesUsers List for Input Select',
			notes: ['Returns AuthRealmsRolesUsers list for input select filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'AuthUser First Level Relations, only for query: ' + RealmsRolesUsersValidation.FLRelations + '<br>' +
			'AuthUser Second Level Relations only for query: ' + RealmsRolesUsersValidation.SLRelations + '<br>' +
			'Attributes: ' + RealmsRolesUsersValidation.Attributes4Select + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmsRolesUsersValidation.query4Select,
				// query: UserValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
];