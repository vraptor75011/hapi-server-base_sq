const Boom = require('boom');
const Log = require('../../../../../utilities/logging/logging');
const Chalk = require('chalk');
const DB = require('../../../../../config/sequelize');

const Config = require('../../../../../config/config');
const AUTH_STRATEGIES = Config.get('/constants/AUTH_STRATEGIES');
const authStrategy = Config.get('/serverHapiConfig/authStrategy');

const User = DB.User;
const Realm = DB.Realm;
const Role = DB.Role;


const Login =
	{
		login: async function (request, reply) {

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

			try {
				user = await User.findOne({
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
				});
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
			} catch(error) {
				Log.apiLogger.error(Chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return reply(Boom.gatewayTimeout(errorMsg));
			}

		}
	};

module.exports = Login;