const Sequelize = require('sequelize');
const Token = require('./../../utilities/token/token');
const { apiLogger, sesLogger, chalk } = require('./../../utilities/logging/logging');
const Config = require('./../../config/config');
const Polyglot = require('./../hapi-polyglot/polyglot');
const Translate = require('../../utilities/translater/translate_helper');

const AuthJWT2 = require('hapi-auth-jwt2');

const DB = require('./../../config/sequelize');
const Op = Sequelize.Op;

let authStrategy = Config.get('/serverHapiConfig/authStrategy');

let validation = async (decodedToken, request, h) => {
	let expirationPeriod = Config.get('/expirationPeriod');
	try {
		let user = decodedToken.user;
		let scope = decodedToken.scope;
		let roles = decodedToken.roles;
		let realms = decodedToken.realms;

		if (decodedToken.user) {
			return {isValid: Boolean(user), credentials: { user, scope, roles, realms }};
		} else if (decodedToken.sessionUser.sessionId) {
			const Session = DB.Session;
			const Realm = DB.Realm;
			const Role = DB.Role;
			let roles = [];
			let realms = [];
			let scope = [];

			let session = await Session.findByCredentials(decodedToken.sessionUser.sessionId, decodedToken.sessionUser.sessionKey);
			if (!session) {
				return {isValid: false}
			}

			sesLogger.info(chalk.grey('User: ' + session.user.fullName + ' try to refresh Token'));
			if (session.user.password !== decodedToken.sessionUser.passwordHash) {
				return {isValid: false}
			}

			let realm = await Realm.findOne({where: {name: {[Op.like]: decodedToken.realms[0]}}});

			if (!realm) {
				return {isValid: false}
			} else {
				session = await Session.createOrRefreshInstance(request, session, session.user, realm);
				let user = await session.getUser({include: [{
						model: Role,
						through: {
							where: {realmId: realm.id}
						}
					},{
						model: Realm,
						through: {
							where: {realmId: realm.id}
						}
					}]});
				user.roles.forEach(function(role){
					roles.push(role.name);
				});
				realms.push(user.realms[0].name);
				scope = scope.concat('Logged');
				// Add Realm-Roles to Scope
				roles.forEach(function (roleName){
					if (roleName.indexOf('User') !== -1) {
						scope = scope.concat(realm.name+'-'+roleName+'-'+user.id)
					} else {
						scope = scope.concat(realm.name+'-'+roleName);
					}
				});
				delete user.dataValues.password;
				delete user.dataValues.isActive;
				delete user.dataValues.resetPasswordToken;
				delete user.dataValues.resetPasswordExpires;
				delete user.dataValues.resetPasswordNewPWD;
				delete user.dataValues.activateAccountToken;
				delete user.dataValues.activateAccountExpires;
				delete user.dataValues.createdAt;
				delete user.dataValues.updatedAt;
				delete user.dataValues.deletedAt;
				user.roles = roles;
				user.realms = realms;

				let authHeader = 'Bearer ' + Token(user, null, scope, roles, realms, expirationPeriod.short);
				let refreshToken = Token(null, session, scope, roles, realms, expirationPeriod.long);

				sesLogger.info(chalk.grey('User: ' + user.fullName + ' has refreshed Tokens'));
				return {isValid: Boolean(user), credentials: {user, scope, roles, realms, session, authHeader, refreshToken}};
			}
		} else {
			return {isValid: false}
		}
	} catch(error) {
		apiLogger.error(chalk.red(error));
		return {isValid: false}
	}

};

module.exports = {
	validation: async (decodedToken, request, h) => {
		let expirationPeriod = Config.get('/expirationPeriod');
		try {
			let user = decodedToken.user;
			let scope = decodedToken.scope;
			let roles = decodedToken.roles;
			let realms = decodedToken.realms;

			if (decodedToken.user) {
				return {isValid: Boolean(user), credentials: { user, scope, roles, realms }};
			} else if (decodedToken.sessionUser.sessionId) {
				const Session = DB.Session;
				const Realm = DB.Realm;
				const Role = DB.Role;
				let roles = [];
				let realms = [];
				let scope = [];

				let session = await Session.findByCredentials(decodedToken.sessionUser.sessionId, decodedToken.sessionUser.sessionKey);
				if (!session) {
					return {isValid: false}
				}

				sesLogger.info(chalk.grey('User: ' + session.user.fullName + ' try to refresh Token'));
				if (session.user.password !== decodedToken.sessionUser.passwordHash) {
					return {isValid: false}
				}

				let realm = await Realm.findOne({where: {name: {[Op.like]: decodedToken.realms[0]}}});

				if (!realm) {
					return {isValid: false}
				} else {
					session = await Session.createOrRefreshInstance(request, session, session.user, realm);
					let user = await session.getUser({include: [{
							model: Role,
							through: {
								where: {realmId: realm.id}
							}
						},{
							model: Realm,
							through: {
								where: {realmId: realm.id}
							}
						}]});
					user.roles.forEach(function(role){
						roles.push(role.name);
					});
					realms.push(user.realms[0].name);
					scope = scope.concat('Logged');
					// Add Realm-Roles to Scope
					roles.forEach(function (roleName){
						if (roleName.indexOf('User') !== -1) {
							scope = scope.concat(realm.name+'-'+roleName+'-'+user.id)
						} else {
							scope = scope.concat(realm.name+'-'+roleName);
						}
					});
					delete user.dataValues.password;
					delete user.dataValues.isActive;
					delete user.dataValues.resetPasswordToken;
					delete user.dataValues.resetPasswordExpires;
					delete user.dataValues.resetPasswordNewPWD;
					delete user.dataValues.activateAccountToken;
					delete user.dataValues.activateAccountExpires;
					delete user.dataValues.createdAt;
					delete user.dataValues.updatedAt;
					delete user.dataValues.deletedAt;
					user.roles = roles;
					user.realms = realms;

					let authHeader = 'Bearer ' + Token(user, null, scope, roles, realms, expirationPeriod.short);
					let refreshToken = Token(null, session, scope, roles, realms, expirationPeriod.long);

					sesLogger.info(chalk.grey('User: ' + user.fullName + ' has refreshed Tokens'));
					return {isValid: Boolean(user), credentials: {user, scope, roles, realms, session, authHeader, refreshToken}};
				}
			} else {
				return {isValid: false}
			}
		} catch(error) {
			apiLogger.error(chalk.red(error));
			return {isValid: false}
		}

	},

	errorHandler: (error) => {
		apiLogger.error(chalk.blue('Auth Error: ', error.message));
		let polyglot = Polyglot.getPolyglot();
		error.message = polyglot.t(error.message);

		return error;
	},

	register: (server, options) => {
		// Load Auth Plugin
		server.register(AuthJWT2);

		// Config the Auth strategy
		server.auth.strategy(authStrategy, 'jwt',
			{
				key: Config.get('/jwtSecret'),            // Never Share your secret key
				validate: validation,      // validate function defined above
				verifyOptions: {algorithms: ['HS256']},   // pick a strong algorithm
				errorFunc: this.errorHandler,
			});

		server.auth.default(authStrategy);

		// Add to server Response Refreshed Tokens (if they exist!)
		server.ext('onPreResponse', (request, h) => {
			const Creds = request.auth.credentials;

			if (request.response.isBoom) {
				request.response = Translate(request);
			}

			// EXPL: if the auth credentials contain session info (refresh tokens), respond with a fresh set of tokens in the header.
			if (Creds && Creds.session && request.response.header && Creds.authHeader) {

				let user = {
					id: Creds.user.id,
					username: Creds.user.username,
					email: Creds.user.email,
					fullName: Creds.user.fullName,
					firstName: Creds.user.firstName,
					lastName: Creds.user.lastName,
					roles: Creds.roles,
					realms: Creds.realms,
				};

				let source = request.response.source;
				if (!source) {
					source = {};
				}
				source['meta'] = {
					authHeader: Creds.authHeader,
					refreshToken: Creds.refreshToken,
					user,
				};

				return h.response(source)
					.header('auth-header', Creds.authHeader)
					.header('refresh-token', Creds.refreshToken)
					.header('user', JSON.stringify(user));
			}

			return h.continue
		});

	},

};
