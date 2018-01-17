const AuthJWT2 = require('hapi-auth-jwt2');
const Chalk = require('chalk');
const Token = require('./utilities/token/token');
const Log = require('./utilities/logging/logging');
const Config = require('./config/config');

const DB = require('./config/sequelize');


module.exports.register = (server, options, next) => {
	let authStrategy = Config.get('/serverHapiConfig/authStrategy');
	let expirationPeriod = Config.get('/expirationPeriod');

	// server.ext('onPreResponse', function (request, reply) {
	//
	// 	const Creds = request.auth.credentials;
	//
	// 	// EXPL: if the auth credentials contain session info (i.e. a refresh token), respond with a fresh set of tokens in the header.
	// 	// Otherwise, clear the header tokens.
	// 	if (Creds && Creds.session && request.response.header) {
	// 		request.response.header('X-Auth-Header', "Bearer " + Token(Creds.user, null, Creds.scope, Creds.roles, Creds.realms, expirationPeriod.short));
	// 		request.response.header('X-Refresh-Token', Token(null, Creds.session, Creds.scope, Creds.roles, Creds.realms, expirationPeriod.long));
	// 	}
	//
	// 	return reply.continue();
	// });

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

				let session = await Session.findByCredentials(decodedToken.sessionUser.sessionId, decodedToken.sessionUser.sessionKey);
				if (!session) {
					return callback(null, false);
				}

				if (session.user.password !== decodedToken.sessionUser.passwordHash) {
					return callback(null, false);
				}

				// session = Session.createInstance(session.user);
				let scope = decodedToken.scope;

				callback(null, Boolean(session.user), {scope, session});
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