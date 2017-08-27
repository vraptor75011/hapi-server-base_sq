const Boom = require('boom');
const Mapper = require('jsonapi-mapper');
const User = require('../../../models/user/user_model');

const Config = require('../../../config');
const AUTH_STRATEGIES = Config.get('/constants/AUTH_STRATEGIES');
const expirationPeriod = Config.get('/expirationPeriod');
const authStrategy = Config.get('/serverHapiConfig/authStrategy');

const Login =
	{
		login: function (request, reply) {
			let mapper = new Mapper.Bookshelf(request.server.info.uri);

			let authHeader = "";
			let refreshToken = "";
			let scope = "";
			let user = request.pre.user.attributes;
			let realm = request.pre.realm.attributes;

			switch (authStrategy) {
				case AUTH_STRATEGIES.PURE_TOKEN:
					authHeader = 'Bearer ' + request.pre.standardToken;
					refreshToken = request.pre.refreshToken;
					scope = request.pre.scope;

					break;
				case AUTH_STRATEGIES.SESSION_TOKEN:
					authHeader = 'Bearer ' + request.pre.standardToken;
					refreshToken = request.pre.refreshToken;
					scope = request.pre.scope;
					break;
				default:
					break;
			}

			User
				.findOne({ id: user.id },
					{withRelated: ['roles', {
						'roles': function (qb) {
							qb.where('roles.realm_id', '=', realm.id);
						}}, 'roles.realm']
					})
				.then(function (result) {
					user = result;
					const mapperOptions = {
						meta: {
							authHeader,
							refreshToken,
							scope,
						},
					};
					let collMap = mapper.map(user, 'user', mapperOptions);
					return reply(collMap);
				});
		}
	};

module.exports = Login;