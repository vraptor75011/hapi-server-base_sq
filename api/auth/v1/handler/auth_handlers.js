const Boom = require('boom');
const Log = require('../../../../utilities/logging/logging');
const Chalk = require('chalk');
const DB = require('../../../../config/sequelize');

const Config = require('../../../../config/config');
const AUTH_STRATEGIES = Config.get('/constants/AUTH_STRATEGIES');
const authStrategy = Config.get('/serverHapiConfig/authStrategy');
const expirationPeriod = Config.get('/expirationPeriod');
const ErrorHelper = require('../../../../utilities/error/error-helper');
const HandlerHelper = require('../../../../utilities/handler/handler-helper');
const Token = require('../../../../utilities/token/token');

const User = DB.User;
const Realm = DB.Realm;
const Role = DB.Role;
const Session = DB.Session;


module.exports =
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
					scope = request.pre.scope.standardScope;

					break;
				case AUTH_STRATEGIES.SESSION_TOKEN:
					authHeader = 'Bearer ' + request.pre.standardToken;
					refreshToken = request.pre.refreshToken;
					scope = request.pre.scope.standardScope;
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
					doc: {
						user
					},
				};
				return reply(mapperOptions);
			} catch(error) {
				Log.apiLogger.error(Chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return reply(Boom.gatewayTimeout(errorMsg));
			}

		},

		logout: async function (request, reply) {
			let user = request.auth.credentials.user;
			let sessionKey = request.payload.sessionKey;

			try {
				let query = {where: {key: sessionKey, userId: user.id}};
				let session = await Session.findOne(query);
				if (session) {
					Log.apiLogger.info(Chalk.cyan('User: ' + user.username + ' has logged out'));
					session.destroy();
					return true;
				} else {
					Log.apiLogger.info(Chalk.cyan('User: ' + user.username + ' failed to log out'));
					let error = Session.name + ' key: ' + sessionKey + ' not present';
					return reply(Boom.notFound(error));
				}
			} catch(error) {
				Log.apiLogger.error(Chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return reply(Boom.gatewayTimeout(errorMsg));
			}
		},

		refresh: async function (request, reply) {
			let session = request.auth.credentials.session;
			let user = session.user;
			let realm = session.realm;
			let realms = [];
			realms.push(realm.name);
			let roles = [];
			let standardScope = [];
			let refreshScope = [];

			try {
				// Check user active?
				if (!user.isActive) {
					return reply(Boom.unauthorized('Account is inactive.'));
				}

				// Create new Session
				let newSession = await Session.createInstance(user, realm);
				Log.session.info(Chalk.grey('User: ' + user.username + ' refresh session: ' + newSession.key));

				// Search user roles in Session realm
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
				user.roles.forEach(function(role){
					roles.push(role.name);
				});

				// Create new Scope from Session User Roles
				// Add 'Logged' to scope
				standardScope = standardScope.concat('Logged');
				refreshScope = refreshScope.concat('Refresh');
				// Add Realm-Roles to Scope
				roles.forEach(function (roleName){
					if (roleName.indexOf('User') !== -1) {
						standardScope = standardScope.concat(realm.name+'-'+roleName+'-'+user.id)
					} else {
						standardScope = standardScope.concat(realm.name+'-'+roleName);
					}
				});

				// Create new two tokens
				let authHeader = 'Bearer ' + await Token(user, null, standardScope, roles, realms, expirationPeriod.short);
				let refreshToken = await Token(null, newSession, refreshScope, roles, realms, expirationPeriod.long);

				// Response
				delete user.dataValues.password;
				const response = {
					meta: {
						authHeader,
						refreshToken,
						standardScope,
					},
					doc: {
						user
					},
				};
				return reply(response);

			} catch(error) {
				Log.apiLogger.error(Chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return reply(Boom.gatewayTimeout(errorMsg));
			}
		},

		registration: async function (request, reply) {
			try {
				let user = request.payload.user;
				let result;

				let keyHash = await Session.generateKeys();

				user.isActive = false;
				user.password = User.hashPassword(user.password);
				user.activateAccountToken = keyHash.hash;
				user.activateAccountExpires = Date.now() + (4*1000*60*60);

				result = await HandlerHelper.create(User, user);
				if (result) {
					user = result.doc;

				}

				return true;
			} catch(error) {
				Log.apiLogger.error(Chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return reply(Boom.gatewayTimeout(errorMsg));
			}
		},
	};