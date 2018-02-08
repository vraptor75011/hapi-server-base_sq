const HeaderValidation = require('../../../../utilities/validation/header_validation');
const UserValidation = require('../../url_validation/user_validation');
const UserHandler = require('../handlers/user_handlers');
const ErrorHelper = require('../../../../utilities/error/error-helper');

module.exports = [
	{
		method: 'GET',
		path: '/v1/users',
		config: {
			handler: UserHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Users'],
			description: 'GET Users List',
			notes: ['Returns Users list filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'User First Level Relations: ' + UserValidation.FLRelations + '<br>' +
			'User Second Level Relations: ' + UserValidation.SLRelations + '<br>' +
			'Attributes: ' + UserValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				query: UserValidation.queryAll,
				// query: UserValidations.query,
				headers: HeaderValidation.headerRequired,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/users/{userId}',
		config: {
			handler: UserHandler.findOne,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'WebApp-User-{userId}'],
				},
			tags: ['api', 'Users'],
			description: 'GET One User',
			notes: ['Returns a User identified by the params {userId} <br>' +
			'Attributes: ' + UserValidation.Attributes + '<br>'],
			validate: {
				options: {
					abortEarly: false
				},
				params: UserValidation.oneParams,
				query: UserValidation.queryOne,
				// query: UserValidations.query,
				headers: HeaderValidation.headerRequired,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/users',
		config: {
			handler: UserHandler.create,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Users'],
			description: 'POST a New User',
			notes: ['Save a new User with params in payload with one or more Child object.<br>' +
			'User hasMany Child Model: User object can contain one or more Child object <br>' +
			'User BelongsToMany Child Model: User object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				payload: UserValidation.postPayload,
				headers: HeaderValidation.headerRequired,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'PUT',
		path: '/v1/users/{userId}',
		config: {
			handler: UserHandler.update,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin', 'WebApp-User-{userId}'],
				},
			tags: ['api', 'Users'],
			description: 'PUT an Updated User',
			notes: ['Save an updated User with params in payload <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				params: UserValidation.oneParams,
				payload: UserValidation.putPayload,
				headers: HeaderValidation.headerRequired,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/users/{userId}',
		config: {
			handler: UserHandler.delete,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Users'],
			description: 'DELETE an User',
			notes: ['Delete un User <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				params: UserValidation.oneParams,
				payload: UserValidation.deleteOnePayload,
				headers: HeaderValidation.headerRequired,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	// EXTRA CRUD
	{
		method: 'DELETE',
		path: '/v1/users/',
		config: {
			handler: UserHandler.deleteMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Users'],
			description: 'DELETE many Users by Ids Array',
			notes: ['Delete many Users <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				// params: UserValidation.paramOne,
				payload: UserValidation.deleteManyPayload,
				headers: HeaderValidation.headerRequired,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/users/{userId}/{childModel}/{childId}',
		config: {
			handler: UserHandler.addOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Users'],
			description: 'ADD one related Model to User',
			notes: ['Add one related model (to save) to a persisted User <br>' +
			'Add a persisted child Model to User.'],
			validate: {
				options: {
					abortEarly: false
				},
				params: UserValidation.addOneParams,
				headers: HeaderValidation.headerRequired,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/users/{userId}/{childModel}/{childId}',
		config: {
			handler: UserHandler.removeOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Users'],
			description: 'Remove one related Model from User',
			notes: ['Remove one related model (delete) from a persisted User <br>' +
			'User hasMany Child Model: User object can contain one or more Child object <br>' +
			'User BelongsToMany Child Model: User object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				params: UserValidation.removeOneParams,
				payload: UserValidation.removeOnePayload,
				headers: HeaderValidation.headerRequired,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/users/{userId}/{childModel}',
		config: {
			handler: UserHandler.addMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Users'],
			description: 'ADD one or more related Model to User',
			notes: ['Add one or more related model (to save) to an existed User <br>' +
			'User hasMany Child Model: User object can contain one or more Child object <br>' +
			'User BelongsToMany Child Model: User object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				params: UserValidation.addManyParams,
				payload: UserValidation.addManyPayload,
				headers: HeaderValidation.headerRequired,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/users/{userId}/{childModel}',
		config: {
			handler: UserHandler.removeMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Users'],
			description: 'Remove one or many related Model from User',
			notes: ['Remove one or many related model (delete) from a persisted User <br>' +
			'User hasMany Child Model: User object can contain one or more Child object <br>' +
			'User BelongsToMany Child Model: User object can contain one or more Child object can contain one Through object'],
			validate: {
				options: {
					abortEarly: false
				},
				params: UserValidation.removeManyParams,
				payload: UserValidation.removeManyPayload,
				headers: HeaderValidation.headerRequired,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/users/{userId}/{childModel}',
		config: {
			handler: UserHandler.getAll,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'Users', 'GetAll'],
			description: 'Get All User related child model with query filters',
			notes: ['Get All records of User related Child Model <br>'],
			validate: {
				options: {
					abortEarly: false
				},
				params: UserValidation.getAllParams,
				query: UserValidation.queryGetAll,
				headers: HeaderValidation.headerRequired,
				failAction: ErrorHelper.failAction,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/users/4Select',
		config: {
			handler: UserHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'GameApp-User', 'WebApp-User'],
				},
			tags: ['api', 'Users'],
			description: 'GET Users List for Input Select',
			notes: ['Returns Users list for input select filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'User First Level Relations, only for query: ' + UserValidation.FLRelations + '<br>' +
			'User Second Level Relations only for query: ' + UserValidation.SLRelations + '<br>' +
			'Attributes: ' + UserValidation.Attributes4Select + '<br>'],
			validate: {
				query: UserValidation.query4Select,
				// query: UserValidations.query,
				headers: HeaderValidation.headerRequired,
				failAction: ErrorHelper.failAction,
			},
		},
	},

	//Extra CRUD
	{
		method: 'POST',
		path: '/v1/users/checkEmail',
		config: {
			handler: UserHandler.checkEmail,
			auth: false,
			description: 'User check email.',
			tags: ['api', 'Users', 'Check Email'],
			validate: {
				options: {
					abortEarly: false
				},
				payload: {
					email: UserValidation.checkMailParams,
				},
				failAction: ErrorHelper.failAction,
			},
		}
	},
];