const HeaderValidation = require('../../../../utilities/validation/header_validation');
const UserValidation = require('../../url_validation/user_validation');
const UserHandler = require('../handlers/user_handlers');
const DB = require('../../../../config/sequelize');

// let User = DB.User;
// let schemaQuery = User.schemaQuery();

module.exports.register = (server, options, next) => {

	server.route([
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
					query: UserValidation.queryAll,
					// query: UserValidations.query,
					headers: HeaderValidation.headerRequired,
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
					params: UserValidation.paramUserId,
					query: UserValidation.queryOne,
					// query: UserValidations.query,
					headers: HeaderValidation.headerRequired,
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
				notes: ['Save a new User with params in payload <br>'],
				validate: {
					payload: UserValidation.postPayload,
					headers: HeaderValidation.headerRequired,
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
					params: UserValidation.paramUserId,
					payload: UserValidation.putPayload,
					headers: HeaderValidation.headerRequired,
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
					params: UserValidation.paramUserId,
					payload: UserValidation.deleteOnePayload,
					headers: HeaderValidation.headerRequired,
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
					// params: UserValidation.paramOne,
					payload: UserValidation.deleteManyPayload,
					headers: HeaderValidation.headerRequired,
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
				notes: ['Add one or more related model (to save) to an existed User - Child Model belongsTo User <br>'],
				validate: {
					params: UserValidation.addManyParams,
					payload: UserValidation.addManyPayload,
					headers: HeaderValidation.headerRequired,
				},
			},
		},
	]);

	next()
};

module.exports.register.attributes = {
	name: 'api.v1.users',
	version: '1.0.1',
};
