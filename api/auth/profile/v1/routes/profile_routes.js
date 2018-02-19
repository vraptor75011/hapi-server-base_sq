const { headerRequired } = require('../../../../../utilities/validation/header_validation');
const ProfileValidation = require('../../url_validation/profile_validation');
const ProfileHandler = require('../handlers/profile_handlers');
const { failAction } = require('../../../../../utilities/error/error-helper');

module.exports = [
	{
		method: 'GET',
		path: '/v1/auth/profiles',
		config: {
			handler: ProfileHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'WebApp-User'],
				},
			tags: ['api', 'Profiles'],
			description: 'GET Profiles List',
			notes: ['Returns Profiles list filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'AuthProfile First Level Relations: ' + ProfileValidation.FLRelations + '<br>' +
			'AuthProfile Second Level Relations: ' + ProfileValidation.SLRelations + '<br>' +
			'Attributes: ' + ProfileValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: ProfileValidation.queryAll,
				// query: ProfileValidations.query,
				failAction: failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/profiles/{profileId}',
		config: {
			handler: ProfileHandler.findOne,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'WebApp-User'],
				},
			tags: ['api', 'Profiles'],
			description: 'GET One AuthProfile',
			notes: ['Returns a AuthProfile identified by the params {profileId} <br>' +
			'AuthProfile First Level Relations: ' + ProfileValidation.FLRelations + '<br>' +
			'AuthProfile Second Level Relations: ' + ProfileValidation.SLRelations + '<br>' +
			'Attributes: ' + ProfileValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: ProfileValidation.queryOne,
				params: ProfileValidation.oneParams,
				// query: ProfileValidations.query,
				failAction: failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/profiles',
		config: {
			handler: ProfileHandler.create,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Profiles'],
			description: 'POST a New AuthProfile',
			notes: ['Save a new AuthProfile with params in payload with one or more Child object.<br>' +
			'AuthProfile hasMany Child Model: AuthProfile object can contain one or more Child object <br>' +
			'AuthProfile BelongsToMany Child Model: AuthProfile object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: ProfileValidation.queryLang,
				payload: ProfileValidation.postPayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'PUT',
		path: '/v1/auth/profiles/{profileId}',
		config: {
			handler: ProfileHandler.update,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin', 'WebApp-Profile-{profileId}'],
				},
			tags: ['api', 'Profiles'],
			description: 'PUT an Updated AuthProfile',
			notes: ['Save an updated AuthProfile with params in payload <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: ProfileValidation.queryLang,
				params: ProfileValidation.oneParams,
				payload: ProfileValidation.putPayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/profiles/{profileId}',
		config: {
			handler: ProfileHandler.delete,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Profiles'],
			description: 'DELETE an AuthProfile',
			notes: ['Delete un AuthProfile <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: ProfileValidation.queryLang,
				params: ProfileValidation.oneParams,
				payload: ProfileValidation.deleteOnePayload,
				failAction: failAction,
			},
		},
	},
	// EXTRA CRUD
	{
		method: 'DELETE',
		path: '/v1/auth/profiles/',
		config: {
			handler: ProfileHandler.deleteMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Profiles'],
			description: 'DELETE many Profiles by Ids Array',
			notes: ['Delete many Profiles <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: ProfileValidation.queryLang,
				payload: ProfileValidation.deleteManyPayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/profiles/{profileId}/{childModel}/{childId}',
		config: {
			handler: ProfileHandler.addOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Profiles'],
			description: 'ADD one related Model to AuthProfile',
			notes: ['Add one related model (to save) to a persisted AuthProfile <br>' +
			'Add a persisted child Model to AuthProfile.'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: ProfileValidation.queryLang,
				params: ProfileValidation.addOneParams,
				failAction: failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/profiles/{profileId}/{childModel}/{childId}',
		config: {
			handler: ProfileHandler.removeOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Profiles'],
			description: 'Remove one related Model from AuthProfile',
			notes: ['Remove one related model (delete) from a persisted AuthProfile <br>' +
			'AuthProfile hasMany Child Model: AuthProfile object can contain one or more Child object <br>' +
			'AuthProfile BelongsToMany Child Model: AuthProfile object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: ProfileValidation.queryLang,
				params: ProfileValidation.removeOneParams,
				payload: ProfileValidation.removeOnePayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/profiles/{profileId}/{childModel}',
		config: {
			handler: ProfileHandler.addMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Profiles'],
			description: 'ADD one or more related Model to AuthProfile',
			notes: ['Add one or more related model (to save) to an existed AuthProfile <br>' +
			'AuthProfile hasMany Child Model: AuthProfile object can contain one or more Child object <br>' +
			'AuthProfile BelongsToMany Child Model: AuthProfile object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: ProfileValidation.queryLang,
				params: ProfileValidation.addManyParams,
				payload: ProfileValidation.addManyPayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/profiles/{profileId}/{childModel}',
		config: {
			handler: ProfileHandler.removeMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Profiles'],
			description: 'Remove one or many related Model from AuthProfile',
			notes: ['Remove one or many related model (delete) from a persisted AuthProfile <br>' +
			'AuthProfile hasMany Child Model: AuthProfile object can contain one or more Child object <br>' +
			'AuthProfile BelongsToMany Child Model: AuthProfile object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: ProfileValidation.queryLang,
				params: ProfileValidation.removeManyParams,
				payload: ProfileValidation.removeManyPayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/profiles/{profileId}/{childModel}',
		config: {
			handler: ProfileHandler.getAll,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin', 'WebApp-Profile-{profileId}'],
				},
			tags: ['api', 'Profiles', 'GetAll'],
			description: 'Get All AuthProfile related child model with query filters',
			notes: ['Get All records of AuthProfile related Child Model <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: ProfileValidation.queryGetAll,
				params: ProfileValidation.getAllParams,
				failAction: failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/profiles/4Select',
		config: {
			handler: ProfileHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'GameApp-Profile', 'WebApp-Profile'],
				},
			tags: ['api', 'Profiles'],
			description: 'GET Profiles List for Input Select',
			notes: ['Returns Profiles list for input select filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'AuthProfile First Level Relations, only for query: ' + ProfileValidation.FLRelations + '<br>' +
			'AuthProfile Second Level Relations only for query: ' + ProfileValidation.SLRelations + '<br>' +
			'Attributes: ' + ProfileValidation.Attributes4Select + '<br>'],
			validate: {
				headers: headerRequired,
				query: ProfileValidation.query4Select,
				// query: ProfileValidations.query,
				failAction: failAction,
			},
		},
	},
];