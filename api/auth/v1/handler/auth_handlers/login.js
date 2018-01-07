const Boom = require('boom');
const Log = require('../../../../../utilities/logging/logging');
const Chalk = require('chalk');
const DB = require('../../../../../config/sequelize');

const Config = require('../../../../../config/config');
const AUTH_STRATEGIES = Config.get('/constants/AUTH_STRATEGIES');
const expirationPeriod = Config.get('/expirationPeriod');
const authStrategy = Config.get('/serverHapiConfig/authStrategy');

const User = DB.User;
const Realm = DB.Realm;
const Role = DB.Role;


const Login =
	{
		login: function (request, reply) {

			let authHeader = "";
			let refreshToken = "";
			let scope = "";
			let user = request.pre.user;
			let realm = request.pre.realm;

			switch (authStrategy) {
				case AUTH_STRATEGIES.REFRESH_TOKEN:
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
					Log.apiLogger.info(Chalk.cyan('User: ' + user.username + ' has logged in'));
					const mapperOptions = {
						meta: {
							authHeader,
							refreshToken,
							scope,
						},
						item: {
							user
						},
					};
					return reply(mapperOptions);
				})
				.catch(function (error) {
					let errorMsg = error.message || 'Unauthorized User';
					return reply(Boom.unauthorized('No roles'));
				});
		}
	};

module.exports = Login;