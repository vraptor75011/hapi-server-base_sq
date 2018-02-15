const HeaderValidation = require('../../../../utilities/validation/header_validation');
const RealmValidation = require('../../url_validation/realm_validation');
const RealmHandler = require('../handler/realm_handlers');
const ErrorHelper = require('../../../../utilities/error/error-helper');

module.exports = [
	{
		method: 'GET',
		path: '/v1/realms',
		config: {
			handler: RealmHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Realms'],
			description: 'GET Realms List',
			notes: ['Returns Realms list filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'Realm First Level Relations: ' + RealmValidation.FLRelations + '<br>' +
			'Realm Second Level Relations: ' + RealmValidation.SLRelations + '<br>' +
			'Attributes: ' + RealmValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmValidation.queryAll,
				// query: RealmValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/realms/{realmId}',
		config: {
			handler: RealmHandler.findOne,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Realms'],
			description: 'GET One Realm',
			notes: ['Returns a Realm identified by the params {realmId} <br>' +
			'Attributes: ' + RealmValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmValidation.queryOne,
				params: RealmValidation.oneParams,
				// query: RealmValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/realms',
		config: {
			handler: RealmHandler.create,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Realms'],
			description: 'POST a New Realm',
			notes: ['Save a new Realm with params in payload with one or more Child object.<br>' +
			'Realm hasMany Child Model: Realm object can contain one or more Child object <br>' +
			'Realm BelongsToMany Child Model: Realm object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmValidation.queryLang,
				payload: RealmValidation.postPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'PUT',
		path: '/v1/realms/{realmId}',
		config: {
			handler: RealmHandler.update,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Realms'],
			description: 'PUT an Updated Realm',
			notes: ['Save an updated Realm with params in payload <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmValidation.queryLang,
				params: RealmValidation.oneParams,
				payload: RealmValidation.putPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/realms/{realmId}',
		config: {
			handler: RealmHandler.delete,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Realms'],
			description: 'DELETE an Realm',
			notes: ['Delete un Realm <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmValidation.queryLang,
				params: RealmValidation.oneParams,
				payload: RealmValidation.deleteOnePayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	// EXTRA CRUD
	{
		method: 'DELETE',
		path: '/v1/realms/',
		config: {
			handler: RealmHandler.deleteMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Realms'],
			description: 'DELETE many Realms by Ids Array',
			notes: ['Delete many Realms <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmValidation.queryLang,
				// params: RealmValidation.paramOne,
				payload: RealmValidation.deleteManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/realms/{realmId}/{childModel}/{childId}',
		config: {
			handler: RealmHandler.addOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Realms'],
			description: 'ADD one related Model to Realm',
			notes: ['Add one related model (to save) to a persisted Realm <br>' +
			'Add a persisted child Model to Realm.'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmValidation.queryLang,
				params: RealmValidation.addOneParams,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/realms/{realmId}/{childModel}/{childId}',
		config: {
			handler: RealmHandler.removeOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Realms'],
			description: 'Remove one related Model from Realm',
			notes: ['Remove one related model (delete) from a persisted Realm <br>' +
			'Realm hasMany Child Model: Realm object can contain one or more Child object <br>' +
			'Realm BelongsToMany Child Model: Realm object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmValidation.queryLang,
				params: RealmValidation.removeOneParams,
				payload: RealmValidation.removeOnePayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/realms/{realmId}/{childModel}',
		config: {
			handler: RealmHandler.addMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Realms'],
			description: 'ADD one or more related Model to Realm',
			notes: ['Add one or more related model (to save) to an existed Realm <br>' +
			'Realm hasMany Child Model: Realm object can contain one or more Child object <br>' +
			'Realm BelongsToMany Child Model: Realm object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmValidation.queryLang,
				params: RealmValidation.addManyParams,
				payload: RealmValidation.addManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/realms/{realmId}/{childModel}',
		config: {
			handler: RealmHandler.removeMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Realms'],
			description: 'Remove one or many related Model from Realm',
			notes: ['Remove one or many related model (delete) from a persisted Realm <br>' +
			'Realm hasMany Child Model: Realm object can contain one or more Child object <br>' +
			'Realm BelongsToMany Child Model: Realm object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmValidation.queryLang,
				params: RealmValidation.removeManyParams,
				payload: RealmValidation.removeManyPayload,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/realms/{realmId}/{childModel}',
		config: {
			handler: RealmHandler.getAll,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Realms'],
			description: 'Get All Realm related child model with query filters',
			notes: ['Get All records of Realm related Child Model <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmValidation.queryGetAll,
				params: RealmValidation.getAllParams,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/realms/4Select',
		config: {
			handler: RealmHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'GameApp-User', 'WebApp-User'],
				},
			tags: ['api', 'Realms'],
			description: 'GET Realms List for Input Select',
			notes: ['Returns Realms list for input select filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'User First Level Relations, only for query: ' + RealmValidation.FLRelations + '<br>' +
			'User Second Level Relations only for query: ' + RealmValidation.SLRelations + '<br>' +
			'Attributes: ' + RealmValidation.Attributes4Select + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: HeaderValidation.headerRequired,
				query: RealmValidation.query4Select,
				// query: UserValidations.query,
				failAction: ErrorHelper.failAction,
			},
		},
	},
];