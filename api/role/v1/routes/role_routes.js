const HeaderValidation = require('../../../../utilities/validation/header_validation');
const RoleHandlers = require('../handler/role_handlers');
const DB = require('../../../../config/sequelize');


module.exports.register = (server, options, next) => {

	server.route([
		{
			method: 'GET',
			path: '/v1/roles',
			config: {
				handler: RoleHandlers.roleFindAll,
				auth: {
					scope: ['SuperAdmin','Admin']
				},
				tags: ['api', 'Roles'],
				description: 'Roles List',
				notes: ['Returns Roles list filtered by query (url), paginated and sorted. Default pageSize: 10'],
				validate: {
					// query: schemaQuery.query,
					headers: HeaderValidation.header,
				}
			},
		}
	]);

	next()
};

module.exports.register.attributes = {
	name: 'api.roles',
	version: '0.0.1',
};
