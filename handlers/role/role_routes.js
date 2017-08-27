const HeaderValidation = require('../../models/headerValidation');
const RoleValidations = require('../../models/role/role_validations');
const RoleHandlers = require('./role_handlers');


module.exports.register = (server, options, next) => {

	server.route([
		{
			method: 'GET',
			path: '/roles',
			config: {
				handler: RoleHandlers.roleFindAll,
				auth: {
					scope: ['WA_SuperAdmin','WA_Admin']
				},
				tags: ['api', 'Roles'],
				description: 'Roles List',
				notes: ['Returns Roles list filtered by query (url), paginated and sorted. Default pageSize: 10'],
				validate: {
					query: RoleValidations.query,
					headers: HeaderValidation.header,
				},
			},
		}
	]);

	next()
};

module.exports.register.attributes = {
	name: 'api.roles',
	version: '0.0.1',
};
