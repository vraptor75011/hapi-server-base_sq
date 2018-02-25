const { headerRequired } = require('../../../../../utilities/validation/header_validation');
const AvatarValidation = require('../../url_validation/avatar_validation');
const AvatarHandler = require('../handlers/avatar_handlers');
const { failAction } = require('../../../../../utilities/error/error-helper');

module.exports = [
	{
		method: 'GET',
		path: '/v1/auth/avatars',
		config: {
			handler: AvatarHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Avatars'],
			description: 'GET Avatars List',
			notes: ['Returns Avatars list filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'<b>AuthAvatar First Level Relations:</b> ' + AvatarValidation.FLRelations + '<br>' +
			'<b>AuthAvatar Second Level Relations:</b> ' + AvatarValidation.SLRelations + '<br>' +
			'<b>Attributes:</b> ' + AvatarValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: AvatarValidation.queryAll,
				// query: AvatarValidations.query,
				failAction: failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/avatars/{avatarId}',
		config: {
			handler: AvatarHandler.findOne,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'WebApp-User}'],
				},
			tags: ['api', 'Avatars'],
			description: 'GET One AuthAvatar',
			notes: ['Returns a AuthAvatar identified by the params {avatarId} <br>' +
			'Attributes: ' + AvatarValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: AvatarValidation.queryOne,
				params: AvatarValidation.oneParams,
				// query: AvatarValidations.query,
				failAction: failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/avatars',
		config: {
			handler: AvatarHandler.create,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Avatars'],
			description: 'POST a New AuthAvatar',
			notes: ['Save a new AuthAvatar with params in payload with one or more Child object.<br>' +
			'<b>AuthAvatar hasMany Child Model:</b> AuthAvatar object can contain one or more Child object <br>' +
			'AuthAvatar BelongsToMany Child Model:</b> AuthAvatar object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: AvatarValidation.queryLang,
				payload: AvatarValidation.postPayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'PUT',
		path: '/v1/auth/avatars/{avatarId}',
		config: {
			handler: AvatarHandler.update,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin', 'WebApp-User}'],
				},
			tags: ['api', 'Avatars'],
			description: 'PUT an Updated AuthAvatar',
			notes: ['Save an updated AuthAvatar with params in payload <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: AvatarValidation.queryLang,
				params: AvatarValidation.oneParams,
				payload: AvatarValidation.putPayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/avatars/{avatarId}',
		config: {
			handler: AvatarHandler.delete,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Avatars'],
			description: 'DELETE an AuthAvatar',
			notes: ['Delete un AuthAvatar <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: AvatarValidation.queryLang,
				params: AvatarValidation.oneParams,
				payload: AvatarValidation.deleteOnePayload,
				failAction: failAction,
			},
		},
	},
	// EXTRA CRUD
	{
		method: 'DELETE',
		path: '/v1/auth/avatars/',
		config: {
			handler: AvatarHandler.deleteMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Avatars'],
			description: 'DELETE many Avatars by Ids Array',
			notes: ['Delete many Avatars <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: AvatarValidation.queryLang,
				payload: AvatarValidation.deleteManyPayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/avatars/{avatarId}/{childModel}/{childId}',
		config: {
			handler: AvatarHandler.addOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Avatars'],
			description: 'ADD one related Model to AuthAvatar',
			notes: ['Add one related model (to save) to a persisted AuthAvatar <br>' +
			'Add a persisted child Model to AuthAvatar.'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: AvatarValidation.queryLang,
				params: AvatarValidation.addOneParams,
				failAction: failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/avatars/{avatarId}/{childModel}/{childId}',
		config: {
			handler: AvatarHandler.removeOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Avatars'],
			description: 'Remove one related Model from AuthAvatar',
			notes: ['Remove one related model (delete) from a persisted AuthAvatar <br>' +
			'AuthAvatar hasMany Child Model: AuthAvatar object can contain one or more Child object <br>' +
			'AuthAvatar BelongsToMany Child Model: AuthAvatar object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: AvatarValidation.queryLang,
				params: AvatarValidation.removeOneParams,
				payload: AvatarValidation.removeOnePayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/auth/avatars/{avatarId}/{childModel}',
		config: {
			handler: AvatarHandler.addMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Avatars'],
			description: 'ADD one or more related Model to AuthAvatar',
			notes: ['Add one or more related model (to save) to an existed AuthAvatar <br>' +
			'AuthAvatar hasMany Child Model: AuthAvatar object can contain one or more Child object <br>' +
			'AuthAvatar BelongsToMany Child Model: AuthAvatar object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: AvatarValidation.queryLang,
				params: AvatarValidation.addManyParams,
				payload: AvatarValidation.addManyPayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/auth/avatars/{avatarId}/{childModel}',
		config: {
			handler: AvatarHandler.removeMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Avatars'],
			description: 'Remove one or many related Model from AuthAvatar',
			notes: ['Remove one or many related model (delete) from a persisted AuthAvatar <br>' +
			'AuthAvatar hasMany Child Model: AuthAvatar object can contain one or more Child object <br>' +
			'AuthAvatar BelongsToMany Child Model: AuthAvatar object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: AvatarValidation.queryLang,
				params: AvatarValidation.removeManyParams,
				payload: AvatarValidation.removeManyPayload,
				failAction: failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/avatars/{avatarId}/{childModel}',
		config: {
			handler: AvatarHandler.getAll,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin', 'WebApp-User}'],
				},
			tags: ['api', 'Avatars', 'GetAll'],
			description: 'Get All AuthAvatar related child model with query filters',
			notes: ['Get All records of AuthAvatar related Child Model <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				headers: headerRequired,
				query: AvatarValidation.queryGetAll,
				params: AvatarValidation.getAllParams,
				failAction: failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/auth/avatars/4Select',
		config: {
			handler: AvatarHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'GameApp-User', 'Logged'],
				},
			tags: ['api', 'Avatars'],
			description: 'GET Avatars List for Input Select',
			notes: ['Returns Avatars list for input select filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'AuthAvatar First Level Relations, only for query: ' + AvatarValidation.FLRelations + '<br>' +
			'AuthAvatar Second Level Relations only for query: ' + AvatarValidation.SLRelations + '<br>' +
			'Attributes: ' + AvatarValidation.Attributes4Select + '<br>'],
			validate: {
				headers: headerRequired,
				query: AvatarValidation.query4Select,
				// query: AvatarValidations.query,
				failAction: failAction,
			},
		},
	},

];