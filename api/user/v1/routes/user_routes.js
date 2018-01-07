const HeaderValidation = require('../../../../utilities/validation/header_validation');
const UserValidation = require('../../url_validation/user_validation');
const UserHandler = require('../handler/user_handlers/handler');
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
				description: 'Users List',
				notes: ['Returns Users list filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
								'User First Level Relations: ' + UserValidation.FLRelations + '<br>' +
								'User Second Level Relations: ' + UserValidation.SLRelations + '<br>' +
								'Attributes: ' + UserValidation.Attributes + '<br>'],
				validate: {
					query: UserValidation.queryAll,
					// query: UserValidations.query,
					headers: HeaderValidation.header,
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
						scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'WebApp-User-1'],
					},
				tags: ['api', 'Users'],
				description: 'One User',
				notes: ['Returns a User identified by the params {userId} <br>' +
				'Attributes: ' + UserValidation.Attributes + '<br>'],
				validate: {
					params: UserValidation.paramOne,
					query: UserValidation.queryOne,
					// query: UserValidations.query,
					headers: HeaderValidation.header,
				},
			},
		}
	]);

	next()
};

module.exports.register.attributes = {
	name: 'api.v1.users',
	version: '1.0.1',
};
