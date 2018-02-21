const HeaderValidation = require('../../../../../utilities/validation/header_validation');
const RoleValidation = require('../../url_validation/role_validation');
const RoleHandler = require('../handler/role_handlers');
const ErrorHelper = require('../../../../../utilities/error/error-helper');

module.exports = [
	{
		method: 'GET',
		path: '/v1/auth/roles',
		config: {
			handler: RoleHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Roles'],
			description: 'GET Roles List',
			notes: ['Returns Roles list filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'AuthRole First Level Relations: ' + RoleValidation.FLRelations + '<br>' +
			'AuthRole Second Level Relations: ' + RoleValidation.SLRelations + '<br>' +
			'Attributes: ' + RoleValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RoleValidation.queryAll,
				// query: RoleValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/roles/{roleId}',
		config: {
			handler: RoleHandler.findOne,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Roles'],
			description: 'GET One AuthRole',
			notes: ['Returns a AuthRole identified by the params {roleId} <br>' +
			'Attributes: ' + RoleValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RoleValidation.queryOne,
				params: RoleValidation.oneParams,
				// query: RoleValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/roles',
		config: {
			handler: RoleHandler.create,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Roles'],
			description: 'POST a New AuthRole',
			notes: ['Save a new AuthRole with params in payload with one or more Child object.<br>' +
			'AuthRole hasMany Child Model: AuthRole object can contain one or more Child object <br>' +
			'AuthRole BelongsToMany Child Model: AuthRole object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RoleValidation.queryLang,
				payload: RoleValidation.postPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'PUT',
		path: '/v1/auth/roles/{roleId}',
		config: {
			handler: RoleHandler.update,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Roles'],
			description: 'PUT an Updated AuthRole',
			notes: ['Save an updated AuthRole with params in payload <br>'],
			validate: {
				headers: HeaderValidation.headerRequired,
				query: RoleValidation.queryLang,
				params: RoleValidation.oneParams,
				payload: RoleValidation.putPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/roles/{roleId}',
		config: {
			handler: RoleHandler.delete,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Roles'],
			description: 'DELETE an AuthRole',
			notes: ['Delete un AuthRole <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RoleValidation.queryLang,
				params: RoleValidation.oneParams,
				payload: RoleValidation.deleteOnePayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	// EXTRA CRUD
	{
		method: 'DELETE',
		path: '/v1/auth/roles/',
		config: {
			handler: RoleHandler.deleteMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Roles'],
			description: 'DELETE many Roles by Ids Array',
			notes: ['Delete many Roles <br>'],
			validate: {
				headers: HeaderValidation.headerRequired,
				query: RoleValidation.queryLang,
				// params: RoleValidation.paramOne,
				payload: RoleValidation.deleteManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/roles/{roleId}/{childModel}/{childId}',
		config: {
			handler: RoleHandler.addOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Roles'],
			description: 'ADD one related Model to AuthRole',
			notes: ['Add one related model (to save) to a persisted AuthRole <br>' +
			'Add a persisted child Model to AuthRole.'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RoleValidation.queryLang,
				params: RoleValidation.addOneParams,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/roles/{roleId}/{childModel}/{childId}',
		config: {
			handler: RoleHandler.removeOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Roles'],
			description: 'Remove one related Model from AuthRole',
			notes: ['Remove one related model (delete) from a persisted AuthRole <br>' +
			'AuthRole hasMany Child Model: AuthRole object can contain one or more Child object <br>' +
			'AuthRole BelongsToMany Child Model: AuthRole object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RoleValidation.queryLang,
				params: RoleValidation.removeOneParams,
				payload: RoleValidation.removeOnePayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/roles/{roleId}/{childModel}',
		config: {
			handler: RoleHandler.addMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Roles'],
			description: 'ADD one or more related Model to AuthRole',
			notes: ['Add one or more related model (to save) to an existed AuthRole <br>' +
			'AuthRole hasMany Child Model: AuthRole object can contain one or more Child object <br>' +
			'AuthRole BelongsToMany Child Model: AuthRole object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RoleValidation.queryLang,
				params: RoleValidation.addManyParams,
				payload: RoleValidation.addManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/roles/{roleId}/{childModel}',
		config: {
			handler: RoleHandler.removeMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Roles'],
			description: 'Remove one or many related Model from AuthRole',
			notes: ['Remove one or many related model (delete) from a persisted AuthRole <br>' +
			'AuthRole hasMany Child Model: AuthRole object can contain one or more Child object <br>' +
			'AuthRole BelongsToMany Child Model: AuthRole object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RoleValidation.queryLang,
				params: RoleValidation.removeManyParams,
				payload: RoleValidation.removeManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/roles/{roleId}/{childModel}',
		config: {
			handler: RoleHandler.getAll,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Roles'],
			description: 'Get All AuthRole related child model with query filters',
			notes: ['Get All records of AuthRole related Child Model <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RoleValidation.queryGetAll,
				params: RoleValidation.getAllParams,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/roles/4Select',
		config: {
			handler: RoleHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'Logged'],
				},
			tags: ['api', 'Roles'],
			description: 'GET Roles List for Input Select',
			notes: ['Returns Roles list for input select filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'AuthUser First Level Relations, only for query: ' + RoleValidation.FLRelations + '<br>' +
			'AuthUser Second Level Relations only for query: ' + RoleValidation.SLRelations + '<br>' +
			'Attributes: ' + RoleValidation.Attributes4Select + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RoleValidation.query4Select,
				// query: UserValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
];