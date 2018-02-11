const Chalk = require('chalk');
const Sequelize = require('sequelize');
const Token = require('./utilities/token/token');
const Log = require('./utilities/logging/logging');
const Config = require('./config/config');
const _ = require('lodash');
const Boom = require('boom');
const Polyglot = require('./plugins/hapi-polyglot/polyglot');

const DB = require('./config/sequelize');
const Op = Sequelize.Op;


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

				Log.session.info(Chalk.grey('User: ' + session.user.fullName + ' try to refresh Token'));
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

					Log.session.info(Chalk.grey('User: ' + user.fullName + ' has refreshed Tokens'));
					return {isValid: Boolean(user), credentials: {user, scope, roles, realms, session, authHeader, refreshToken}};
				}
			} else {
				return {isValid: false}
			}
		} catch(error) {
			Log.apiLogger.error(Chalk.red(error));
			return {isValid: false}
		}

	},

	errorHandler: (error) => {
		Log.apiLogger.error(Chalk.blue('Auth Error: ', error.message));
		let polyglot = Polyglot.polyglot;
		error.message = polyglot.t(error.message);

		return error;
	},

};
