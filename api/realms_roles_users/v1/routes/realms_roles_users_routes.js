const HeaderValidation = require('../../../../utilities/validation/header_validation');
const RealmsRolesUsersValidation = require('../../url_validation/realms_roles_users_validation');
const RealmsRolesUsersHandler = require('../handlers/realms_roles_users_handlers');

module.exports = [
	{
		method: 'GET',
		path: '/v1/realmsRolesUsers',
		config: {
			handler: RealmsRolesUsersHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'RealmsRolesUsers'],
			description: 'GET RealmsRolesUsers List',
			notes: ['Returns RealmsRolesUsers list filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'RealmsRolesUsers First Level Relations: ' + RealmsRolesUsersValidation.FLRelations + '<br>' +
			'RealmsRolesUsers Second Level Relations: ' + RealmsRolesUsersValidation.SLRelations + '<br>' +
			'Attributes: ' + RealmsRolesUsersValidation.Attributes + '<br>'],
			validate: {
				query: RealmsRolesUsersValidation.queryAll,
				// query: RealmsRolesUsersValidations.query,
				headers: HeaderValidation.headerRequired,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/realmsRolesUsers/{realmsRolesUsersId}',
		config: {
			handler: RealmsRolesUsersHandler.findOne,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'RealmsRolesUsers'],
			description: 'GET One RealmsRolesUsers',
			notes: ['Returns a RealmsRolesUsers identified by the params {realmsRolesUsersId} <br>' +
			'Attributes: ' + RealmsRolesUsersValidation.Attributes + '<br>'],
			validate: {
				params: RealmsRolesUsersValidation.oneParams,
				query: RealmsRolesUsersValidation.queryOne,
				// query: RealmsRolesUsersValidations.query,
				headers: HeaderValidation.headerRequired,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/realmsRolesUsers',
		config: {
			handler: RealmsRolesUsersHandler.create,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'RealmsRolesUsers'],
			description: 'POST a New RealmsRolesUsers',
			notes: ['Save a new RealmsRolesUsers with params in payload with one or more Child object.<br>' +
			'RealmsRolesUsers hasMany Child Model: RealmsRolesUsers object can contain one or more Child object <br>' +
			'RealmsRolesUsers BelongsToMany Child Model: RealmsRolesUsers object can contain one or more Child object can contain one Through object'],
			validate: {
				payload: RealmsRolesUsersValidation.postPayload,
				headers: HeaderValidation.headerRequired,
			},
		},
	},
	{
		method: 'PUT',
		path: '/v1/realmsRolesUsers/{realmsRolesUsersId}',
		config: {
			handler: RealmsRolesUsersHandler.update,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'RealmsRolesUsers'],
			description: 'PUT an Updated RealmsRolesUsers',
			notes: ['Save an updated RealmsRolesUsers with params in payload <br>'],
			validate: {
				params: RealmsRolesUsersValidation.oneParams,
				payload: RealmsRolesUsersValidation.putPayload,
				headers: HeaderValidation.headerRequired,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/realmsRolesUsers/{realmsRolesUsersId}',
		config: {
			handler: RealmsRolesUsersHandler.delete,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'RealmsRolesUsers'],
			description: 'DELETE an RealmsRolesUsers',
			notes: ['Delete un RealmsRolesUsers <br>'],
			validate: {
				params: RealmsRolesUsersValidation.oneParams,
				payload: RealmsRolesUsersValidation.deleteOnePayload,
				headers: HeaderValidation.headerRequired,
			},
		},
	},
	// EXTRA CRUD
	{
		method: 'DELETE',
		path: '/v1/realmsRolesUsers/',
		config: {
			handler: RealmsRolesUsersHandler.deleteMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'RealmsRolesUsers'],
			description: 'DELETE many RealmsRolesUsers by Ids Array',
			notes: ['Delete many RealmsRolesUsers <br>'],
			validate: {
				// params: RealmsRolesUsersValidation.paramOne,
				payload: RealmsRolesUsersValidation.deleteManyPayload,
				headers: HeaderValidation.headerRequired,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/realmsRolesUsers/{realmsRolesUsersId}/{childModel}/{childId}',
		config: {
			handler: RealmsRolesUsersHandler.addOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'RealmsRolesUsers'],
			description: 'ADD one related Model to RealmsRolesUsers',
			notes: ['Add one related model (to save) to a persisted RealmsRolesUsers <br>' +
			'Add a persisted child Model to RealmsRolesUsers.'],
			validate: {
				params: RealmsRolesUsersValidation.addOneParams,
				headers: HeaderValidation.headerRequired,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/realmsRolesUsers/{realmsRolesUsersId}/{childModel}/{childId}',
		config: {
			handler: RealmsRolesUsersHandler.removeOne,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'RealmsRolesUsers'],
			description: 'Remove one related Model from RealmsRolesUsers',
			notes: ['Remove one related model (delete) from a persisted RealmsRolesUsers <br>' +
			'RealmsRolesUsers hasMany Child Model: RealmsRolesUsers object can contain one or more Child object <br>' +
			'RealmsRolesUsers BelongsToMany Child Model: RealmsRolesUsers object can contain one or more Child object can contain one Through object'],
			validate: {
				params: RealmsRolesUsersValidation.removeOneParams,
				payload: RealmsRolesUsersValidation.removeOnePayload,
				headers: HeaderValidation.headerRequired,
			},
		},
	},
	{
		method: 'POST',
		path: '/v1/realmsRolesUsers/{realmsRolesUsersId}/{childModel}',
		config: {
			handler: RealmsRolesUsersHandler.addMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'RealmsRolesUsers'],
			description: 'ADD one or more related Model to RealmsRolesUsers',
			notes: ['Add one or more related model (to save) to an existed RealmsRolesUsers <br>' +
			'RealmsRolesUsers hasMany Child Model: RealmsRolesUsers object can contain one or more Child object <br>' +
			'RealmsRolesUsers BelongsToMany Child Model: RealmsRolesUsers object can contain one or more Child object can contain one Through object'],
			validate: {
				params: RealmsRolesUsersValidation.addManyParams,
				payload: RealmsRolesUsersValidation.addManyPayload,
				headers: HeaderValidation.headerRequired,
			},
		},
	},
	{
		method: 'DELETE',
		path: '/v1/realmsRolesUsers/{realmsRolesUsersId}/{childModel}',
		config: {
			handler: RealmsRolesUsersHandler.removeMany,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'RealmsRolesUsers'],
			description: 'Remove one or many related Model from RealmsRolesUsers',
			notes: ['Remove one or many related model (delete) from a persisted RealmsRolesUsers <br>' +
			'RealmsRolesUsers hasMany Child Model: RealmsRolesUsers object can contain one or more Child object <br>' +
			'RealmsRolesUsers BelongsToMany Child Model: RealmsRolesUsers object can contain one or more Child object can contain one Through object'],
			validate: {
				params: RealmsRolesUsersValidation.removeManyParams,
				payload: RealmsRolesUsersValidation.removeManyPayload,
				headers: HeaderValidation.headerRequired,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/realmsRolesUsers/{realmsRolesUsersId}/{childModel}',
		config: {
			handler: RealmsRolesUsersHandler.getAll,
			auth:
				{
					scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
				},
			tags: ['api', 'RealmsRolesUsers'],
			description: 'Get All RealmsRolesUsers related child model with query filters',
			notes: ['Get All records of RealmsRolesUsers related Child Model <br>'],
			validate: {
				params: RealmsRolesUsersValidation.getAllParams,
				query: RealmsRolesUsersValidation.queryGetAll,
				headers: HeaderValidation.headerRequired,
			},
		},
	},
	{
		method: 'GET',
		path: '/v1/realmsRolesUsers/4Select',
		config: {
			handler: RealmsRolesUsersHandler.findAll,
			auth:
			// false,
				{
					scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'GameApp-User', 'WebApp-User'],
				},
			tags: ['api', 'RealmsRolesUsers'],
			description: 'GET RealmsRolesUsers List for Input Select',
			notes: ['Returns RealmsRolesUsers list for input select filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
			'User First Level Relations, only for query: ' + RealmsRolesUsersValidation.FLRelations + '<br>' +
			'User Second Level Relations only for query: ' + RealmsRolesUsersValidation.SLRelations + '<br>' +
			'Attributes: ' + RealmsRolesUsersValidation.Attributes4Select + '<br>'],
			validate: {
				query: RealmsRolesUsersValidation.query4Select,
				// query: UserValidations.query,
				headers: HeaderValidation.headerRequired,
			},
		},
	},
];