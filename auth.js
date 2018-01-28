const AuthJWT2 = require('hapi-auth-jwt2');
const Chalk = require('chalk');
const Sequelize = require('sequelize');
const Token = require('./utilities/token/token');
const Log = require('./utilities/logging/logging');
const Config = require('./config/config');

const DB = require('./config/sequelize');
const Op = Sequelize.Op;


module.exports.register = (server, options, next) => {
	let authStrategy = Config.get('/serverHapiConfig/authStrategy');
	let expirationPeriod = Config.get('/expirationPeriod');

	server.ext('onPreResponse', function (request, reply) {

		const Creds = request.auth.credentials;

		// EXPL: if the auth credentials contain session info (i.e. a refresh store), respond with a fresh set of tokens in the header.
		// Otherwise, clear the header tokens.
		if (Creds && Creds.session && request.response.header) {
			request.response.header('X-Auth-Header', "Bearer " + Token(Creds.user, null, Creds.scope, Creds.roles, Creds.realms, expirationPeriod.short));
			request.response.header('X-Refresh-Token', Token(null, Creds.session, Creds.scope, Creds.roles, Creds.realms, expirationPeriod.long));
		}

		return reply.continue();
	});

	let validate = async (decodedToken, request, callback) => {
		try {
			let user = decodedToken.user;
			let scope = decodedToken.scope;
			let roles = decodedToken.roles;
			let realms = decodedToken.realms;

			if (decodedToken.user) {
				callback(null, Boolean(user), { user, scope, roles, realms });
			} else if (decodedToken.sessionUser.sessionId) {
				const Session = DB.Session;
				const Realm = DB.Realm;
				let roles = [];
				let realms = [];
				let scope = [];

				let session = await Session.findByCredentials(decodedToken.sessionUser.sessionId, decodedToken.sessionUser.sessionKey);
				if (!session) {
					return callback(null, false);
				}

				Log.session.info(Chalk.grey('User: ' + session.user.fullName + ' try to refresh Token'));
				if (session.user.password !== decodedToken.sessionUser.passwordHash) {
					return callback(null, false);
				}

				let realm = await Realm.findOne({where: {name: {[Op.like]: decodedToken.realms[0]}}});

				if (!realm) {
					return callback(null, false);
				} else {
					session = await Session.createInstance(session.user, realm);
					let user = await session.getUser();
					let userRoles = await user.getRoles({through: {
							where: {realmId: realm.id}
						}});
					userRoles.forEach(function(role){
						roles.push(role.name);
					});
					realms.push(realm.name);
					scope = scope.concat('Logged');
					// Add Realm-Roles to Scope
					roles.forEach(function (roleName){
						if (roleName.indexOf('User') !== -1) {
							scope = scope.concat(realm.name+'-'+roleName+'-'+user.id)
						} else {
							scope = scope.concat(realm.name+'-'+roleName);
						}
					});

					Log.session.info(Chalk.grey('User: ' + user.fullName + ' has refreshed Tokens'));
					callback(null, Boolean(user), {user, scope, roles, realms, session});
				}
			}
		} catch(error) {
			Log.apiLogger.error(Chalk.red(error));
			return callback(null, false);
		}

	};


	server.register(AuthJWT2, (err) => {
		if (err) {
			server.log('error', 'Failed to load auth:' + err);
		}

		server.auth.strategy(authStrategy, 'jwt',
			{
				key: Config.get('/jwtSecret'),          // Never Share your secret key
				validateFunc: validate,                 // validate function defined above
				verifyOptions: {algorithms: ['HS256']}  // pick a strong algorithm
			});

		server.auth.default(authStrategy);

	});

	next();

};

module.exports.register.attributes = {
	name: 'auth',
	version: '0.0.1',
};