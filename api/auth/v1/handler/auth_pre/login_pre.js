const Boom = require('boom');
const Bcrypt = require('bcrypt');
const Chalk = require('chalk');
const Sequelize = require('sequelize');

const Config = require('../../../../../config/config');
const AUTH_STRATEGIES = Config.get('/constants/AUTH_STRATEGIES');
const expirationPeriod = Config.get('/expirationPeriod');
const authStrategy = Config.get('/serverHapiConfig/authStrategy');
const Log = require('../../../../../utilities/logging/logging');
const Token = require('../../../../../utilities/token/token');
const DB = require('../../../../../config/sequelize');

const Op = Sequelize.Op;

const User = DB.User;
const Realm = DB.Realm;
const Role = DB.Role;
const Session = DB.Session;
const AuthAttempt = DB.AuthAttempt;

const LoginPre = [
	// {
	// 	assign: 'abuseDetected',
	// 	method: async (request, reply) => {
	//
	// 		const ip = request.info.remoteAddress;
	// 		const email = request.payload.email;
	// 		const username = request.payload.username;
	//
	// 		try {
	// 			let authAttempt = await AuthAttempt.findOne(
	// 				{where:
	// 						{
	// 							ip: {[Op.eq]: ip},
	// 							[Op.or]: [
	// 								{	username: {[Op.eq]: username} },
	// 								{	email: {[Op.eq]: email}	}
	// 							],
	// 						}
	// 				});
	//
	// 			if (!user) {
	// 				return Boom.unauthorized('Invalid username or password');
	// 			}
	// 			let match = Bcrypt.compareSync(password, user.password);
	// 			if (match) {
	// 				return h.response(user);
	// 			}
	// 			return h.response(Boom.unauthorized('Invalid username or password'));
	// 		}	catch(error) {
	// 			Log.apiLogger.error(Chalk.red(error));
	// 			let errorMsg = error.message || 'An error occurred';
	// 			return h.response(Boom.gatewayTimeout(errorMsg));
	// 		}
	//
	// 		let detected = await AuthAttempt.abuseDetected(ip, email, username)
	// 			.then(function (detected) {
	// 				if (detected) {
	// 					return reply(Boom.badRequest('Maximum number of auth attempts reached. Please try again later.'));
	// 				}
	// 				return reply();
	// 			})
	// 			.catch(function (error) {
	// 				Log.error(error);
	// 				return reply(Boom.gatewayTimeout('An error occurred.'));
	// 			});
	// 	}
	// },
	{
		assign: 'user',
		method: async (request, h) => {
			const email = request.payload.email || request.payload.username;
			const username = request.payload.username;
			const password = request.payload.password;
			let userLogging = email || username;
			Log.session.info(Chalk.grey('User: ' + userLogging + ' try to logging in'));

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
				return h.response(Boom.unauthorized('Invalid username or password'));
			}	catch(error) {
				Log.apiLogger.error(Chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return h.response(Boom.gatewayTimeout(errorMsg));
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
					return h.response(Boom.unauthorized('Invalid realm'));
				} else {
					return h.response(realm);
				}
			} catch(error) {
				Log.apiLogger.error(Chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return h.response(Boom.gatewayTimeout(errorMsg));
			}
		}
	},
// {
// 	// assign: 'logAttempt',
// 	// method: function (request, reply) {
// 	//
// 	// 	if (request.pre.user) {
// 	// 		return reply();
// 	// 	}
// 	//
// 	// 	const ip = request.info.remoteAddress;
// 	// 	const email = request.payload.email;
// 	//
// 	// 	AuthAttempt.createInstance(ip, email, Log)
// 	// 		.then(function (authAttempt) {
// 	// 			return reply(Boom.badRequest('Invalid Email or Password.'));
// 	// 		})
// 	// 		.catch(function (error) {
// 	// 			Log.error(error);
// 	// 			return reply(Boom.gatewayTimeout('An error occurred.'));
// 	// 		});
// 	// }
// },
	{
		assign: 'isActive',
		method: async function (request, h) {
			let user = await request.pre.user;

			if (user.isActive) {
				return h.continue
			}
			else {
				return h.response(Boom.unauthorized('Account is inactive.'));
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
					Log.session.info(Chalk.grey('User: ' + request.pre.user.username + ' open new session: ' + session.key));
					return h.response(session);
				}
			} catch(error) {
				Log.apiLogger.error(Chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return h.response(Boom.gatewayTimeout(errorMsg));
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
					return h.response(Boom.unauthorized('No roles'));
				}
			} catch(error) {
				Log.apiLogger.error(Chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return h.response(Boom.gatewayTimeout(errorMsg));
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