const Boom = require('boom');
const Bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

const Config = require('../../../../../../config/config');
const AUTH_STRATEGIES = Config.get('/constants/AUTH_STRATEGIES');
const expirationPeriod = Config.get('/expirationPeriod');
const authStrategy = Config.get('/serverHapiConfig/authStrategy');
const { apiLogger, sesLogger, chalk } = require('../../../../../../utilities/logging/logging');
const Token = require('../../../../../../utilities/token/token');
const DB = require('../../../../../../config/sequelize');

const Op = Sequelize.Op;

const User = DB.User;
const Realm = DB.Realm;
const Role = DB.Role;
const Session = DB.Session;
const AuthAttempt = DB.AuthAttempt;

const LoginPre = [
	{
		assign: 'authAttempt',
		method: async (request, h) => {

			const ip = request.info.remoteAddress;
			const email = request.payload.email;
			const username = request.payload.username;
			let attempt = {};
			let initialized = false;
			let ipSum;

			let lockOutPeriod = Config.get('/lockOutPeriod');
			let authAttemptsConfig = Config.get('/authAttempts');
			let expirationDate = lockOutPeriod ? Date.now() - lockOutPeriod * 60000 : Date.now();
			let blockDate;

			try {
				if (email) {
					[attempt, initialized] = await AuthAttempt.findOrBuild({
						where:
							{
								ip: ip,
								email: email,
							}
					});
				} else if (username) {
					[attempt, initialized] = await AuthAttempt.findOrBuild({
						where:
							{
								ip: ip,
								username: username,
							}
					});
				}
				let attr = 'count';
				let option = {
					where: {
						ip: {[Op.eq]: ip},
					}
				};

				ipSum = await AuthAttempt.sum(attr, option);

				if (ipSum) {
					ipSum += 1;
					if (ipSum > authAttemptsConfig.forIp) {
						let error = 'Exceeded the IP maximum attempts';
						apiLogger.error(chalk.red(error));
						return Boom.unauthorized(error);
					}

				}

				if (attempt) {
					if (attempt.updatedAt) {
						blockDate = attempt.updatedAt.getTime();
					} else {
						blockDate = false;
					}

					attempt.count += 1;
					if (attempt.count > authAttemptsConfig.forIpAndUser && blockDate && blockDate > expirationDate) {
						let error = 'Exceeded the User maximum attempts';
						apiLogger.error(chalk.red(error));
						return Boom.unauthorized(error);
					} else if (attempt.count > authAttemptsConfig.forIpAndUser && blockDate && blockDate <= expirationDate) {
						attempt.count = 1;
					}

					await attempt.save();
					return h.response(attempt);
				} else {
					let error = 'Un error occurred';
					apiLogger.error(chalk.red(error));
					return Boom.badRequest(error);
				}
			}	catch(error) {
				apiLogger.error(chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return Boom.badImplementation(errorMsg);
			}
		}
	},
	{
		assign: 'user',
		method: async (request, h) => {
			const email = request.payload.email || request.payload.username;
			const username = request.payload.username;
			const password = request.payload.password;
			let userLogging = email || username;
			sesLogger.info(chalk.grey('User: ' + userLogging + ' try to logging in'));

			try {
				let user = await User.findOne(
					{where:
							{
								[Op.or]: [
									{	username: {[Op.eq]: username} },
									{	email: {[Op.eq]: email}	}
								]
							}
					});
				if (!user) {
					return Boom.unauthorized('Invalid username or password');
				}
				let match = Bcrypt.compareSync(password, user.password);
				if (match) {
					return h.response(user);
				}
				return Boom.unauthorized('Invalid username or password');
			}	catch(error) {
				apiLogger.error(chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return Boom.badImplementation(errorMsg);
			}
		}
	},
	{
		assign: 'realm',
		method: async function (request, h) {
			let realmName = request.payload.realm || 'WebApp';
			let realm = {};

			try {
				realm = await Realm.findOne({
					where:
						{name: realmName}
				});
				if (!realm) {
					return Boom.unauthorized('Invalid realm');
				} else {
					return h.response(realm);
				}
			} catch(error) {
				apiLogger.error(chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return Boom.badImplementation(errorMsg);
			}
		}
	},
	{
		assign: 'isActive',
		method: async function (request, h) {
			let user = await request.pre.user;

			if (user.isActive) {
				return h.continue
			}
			else {
				return Boom.unauthorized('Account is inactive.');
			}
		}
	},
	{
		assign: 'session',
		method: async function (request, h) {
			let user = request.pre.user;
			let realm = request.pre.realm;
			let session = {};
			try {
				if (authStrategy === AUTH_STRATEGIES.TOKEN) {
					return h.response(null);
				} else {
					session = await Session.createOrRefreshInstance(request, null, user, realm);
					if (session) {
						sesLogger.info(chalk.grey('User: ' + request.pre.user.username + ' open new session: ' + session.key));
						return h.response(session);
					} else {
						let error = 'Un error occurred';
						apiLogger.error(chalk.red(error));
						return Boom.badRequest(error);
					}
				}
			} catch(error) {
				apiLogger.error(chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return Boom.badImplementation(errorMsg);
			}
		}
	},
	{
		assign: 'roles',
		method: async function (request, h) {
			let user = request.pre.user;
			let realm = request.pre.realm;
			let result;
			let roles = [];

			try {
				result = await User.findOne({
					where: {id: user.id},
					include: [{
						model: Role,
						through: {
							where: {realmId: realm.id}
						}
					}]
				});
				roles = result.roles;
				if(roles && roles.length){
					return h.response(roles);
				} else {
					return Boom.unauthorized('User with no roles');
				}
			} catch(error) {
				apiLogger.error(chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return Boom.badImplementation(errorMsg);
			}
		}
	},
	{
		assign: 'scope',
		method: async function (request, h) {
			let realm = request.pre.realm;
			let roles = request.pre.roles;
			let scope = [];

			// Add 'Logged' to scope
			scope = scope.concat('Logged');
			// Add Realm-Roles to Scope
			roles.forEach(function (role){
				if (role.name.indexOf('User') !== -1) {
					scope = scope.concat(realm.name+'-'+role.name+'-'+request.pre.user.id)
				} else {
					scope = scope.concat(realm.name+'-'+role.name);
				}
			});

			return h.response(scope);

		}
	},
	{
		assign: 'standardToken',
		method: function (request, h) {

			let user = request.pre.user;
			let roles = [];
			let scope = request.pre.scope;
			let realms = [];
			realms.push(request.pre.realm.name);
			request.pre.roles.forEach(function(role){
				roles.push(role.name);
			});

			switch (authStrategy) {
				case AUTH_STRATEGIES.REFRESH_TOKEN:
					return h.response(Token(user, null, scope, roles, realms, expirationPeriod.long));
				case AUTH_STRATEGIES.SESSION_TOKEN:
					return h.response(Token(user, null, scope, roles, realms, expirationPeriod.long));
				default:
					break;
			}
		}
	},
	// {
	// 	assign: 'sessionToken',
	// 	method: function (request, reply) {
	// 		switch (authStrategy) {
	// 			case AUTH_STRATEGIES.TOKEN:
	// 				reply(null);
	// 				break;
	// 			case AUTH_STRATEGIES.SESSION:
	// 				reply(Token(null, request.pre.session, request.pre.scope, expirationPeriod.long, Log));
	// 				break;
	// 			case AUTH_STRATEGIES.REFRESH:
	// 				reply(null);
	// 				break;
	// 			default:
	// 				break;
	// 		}
	// 	}
	// },
	{
		assign: 'refreshToken',
		method: function (request, h) {

			let roles = [];
			let scope = request.pre.scope;
			let session = request.pre.session;
			let realms = [];
			realms.push(request.pre.realm.name);
			request.pre.roles.forEach(function(role){
				roles.push(role.name);
			});

			switch (authStrategy) {
				case AUTH_STRATEGIES.REFRESH_TOKEN:
					return h.response(Token(null, session, scope, roles, realms, expirationPeriod.long));
				case AUTH_STRATEGIES.SESSION_TOKEN:
					return h.response(Token(null, session, scope, roles, realms, expirationPeriod.long));
				default:
					break;
			}
		}
	}
];

module.exports = LoginPre;