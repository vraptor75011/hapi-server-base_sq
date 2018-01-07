const HeaderValidation = require('../../../../utilities/validation/header_validation');
const UserHandlers = require('../handler/user_handlers');
const DB = require('../../../../config/sequelize');

let User = DB.User;
let schemaQuery = User.schemaQuery();

module.exports.register = (server, options, next) => {

	server.route([
		{
			method: 'GET',
			path: '/v1/users',
			config: {
				handler: UserHandlers.userFindAll,
				auth:
					// false,
					{
						scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
					},
				tags: ['api', 'Users'],
				description: 'Users List',
				notes: ['Returns Users list filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
								'User First Level Relations: ' + UserValidations.FLRelations + '<br>' +
								'User Second Level Relations: ' + UserValidations.SLRelations + '<br>' +
								'Attributes: ' + schemaQuery.Attributes + '<br>'],
				validate: {
					query: schemaQuery.query,
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
