const HeaderValidation = require('../../../../utilities/validation/header_validation');
const UrlValidation = require('../../user_validation/url_validation');
const UserFindAll = require('../handler/user_handlers/user_find_all');
const DB = require('../../../../config/sequelize');

// let User = DB.User;
// let schemaQuery = User.schemaQuery();

module.exports.register = (server, options, next) => {

	server.route([
		{
			method: 'GET',
			path: '/v1/users',
			config: {
				handler: UserFindAll.findAll,
				auth:
					// false,
					{
						scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
					},
				tags: ['api', 'Users'],
				description: 'Users List',
				notes: ['Returns Users list filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
								'User First Level Relations: ' + UrlValidation.FLRelations + '<br>' +
								'User Second Level Relations: ' + UrlValidation.SLRelations + '<br>' +
								'Attributes: ' + UrlValidation.Attributes + '<br>'],
				validate: {
					query: UrlValidation.queryAll,
					// query: UserValidations.query,
					headers: HeaderValidation.header,
				},
			},
		},
		{
			method: 'GET',
			path: '/v1/users/{userId}',
			config: {
				handler: UserFindAll.findAll,
				auth:
				// false,
					{
						scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'WebApp-User-1'],
					},
				tags: ['api', 'Users'],
				description: 'One User',
				notes: ['Returns a User identified by the params {userId} <br>' +
				'Attributes: ' + UrlValidation.Attributes + '<br>'],
				validate: {
					params: UrlValidation.paramOne,
					query: UrlValidation.queryOne,
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
