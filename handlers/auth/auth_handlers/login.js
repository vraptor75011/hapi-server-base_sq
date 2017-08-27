const Boom = require('boom');
const User = require('../../../models/user/user_model');
const Role = require('../../../models/role/role_model');
const Realm = require('../../../models/realm/realm_model');


const Config = require('../../../config');
const AUTH_STRATEGIES = Config.get('/constants/AUTH_STRATEGIES');
const expirationPeriod = Config.get('/expirationPeriod');
const authStrategy = Config.get('/serverHapiConfig/authStrategy');

const Login =
	{
		login: function (request, reply) {

			let authHeader = "";
			let refreshToken = "";
			let scope = "";
			let user = request.pre.user;
			let realm = request.pre.realm;

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
				.findOne({
					where: {id: user.id},
					include: [{
						model: Role,
						through: {
							where: {realmId: realm.id}
						}
					},{
						model: Realm,
						through: {
							where: {realmId: realm.id}
						}
					}],
				})
				.then(function (result) {
					user = result;
					delete user.dataValues.password;
					const mapperOptions = {
						meta: {
							authHeader,
							refreshToken,
							scope,
						},
						data: {
							user
						},
					};
					return reply(mapperOptions);
				});
		}
	};

module.exports = Login;