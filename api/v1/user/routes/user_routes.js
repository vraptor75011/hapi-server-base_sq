const HeaderValidation = require('../../../header_validation');
const UserValidations = require('../model/user_validations');
const UserHandlers = require('../handler/user_handlers');
const UserPre = require('../handler/user_pre/user_pre');


module.exports.register = (server, options, next) => {

	server.route([
		{
			method: 'GET',
			path: '/v1/users',
			config: {
				handler: UserHandlers.userFindAll,
				auth: false,
				// {
				// 	scope: ['WA_SuperAdmin','WA_Admin']
				// },
				tags: ['api', 'Users'],
				description: 'Users List',
				notes: ['Returns Users list filtered by query (url), paginated and sorted. Default pageSize: 10'],
				validate: {
					query: UserValidations.query,
					// headers: HeaderValidation.header,
				},
				pre: UserPre,
			},
		}
	]);

	next()
};

module.exports.register.attributes = {
	name: 'api.v1.users',
	version: '1.0.1',
};
