const AuthJWT2 = require('hapi-auth-jwt2');
const Token = require('./utilities/token/token');
const Config = require('./config/config');

const DB = require('./config/sequelize');


module.exports.register = (server, options, next) => {
	let authStrategy = Config.get('/serverHapiConfig/authStrategy');
	let expirationPeriod = Config.get('/expirationPeriod');

	server.ext('onPreResponse', function (request, reply) {

		const Creds = request.auth.credentials;

		// EXPL: if the auth credentials contain session info (i.e. a refresh token), respond with a fresh set of tokens in the header.
		// Otherwise, clear the header tokens.
		if (Creds && Creds.session && request.response.header) {
			request.response.header('X-Auth-Header', "Bearer " + Token(Creds.user, null, Creds.scope, Creds.roles, Creds.realms, expirationPeriod.short));
			request.response.header('X-Refresh-Token', Token(null, Creds.session, Creds.scope, Creds.roles, Creds.realms, expirationPeriod.long));
		}

		return reply.continue();
	});

	let validate = function (decodedToken, request, callback) {
		let user = decodedToken.user;
		let scope = decodedToken.scope;
		let roles = decodedToken.roles;
		let realms = decodedToken.realms;

		if (decodedToken.user) {
			callback(null, Boolean(user), { user, scope, roles, realms });
		} else if (decodedToken.sessionUser.sessionId) {
			const Session = DB.Session;

			Session.findByCredentials(decodedToken.sessionUser.sessionId, decodedToken.sessionUser.sessionKey)
				.then(function (result) {
					let session = result;

					if (!session) {
						return callback(null, false);
					}

					if (session.user.password !== decodedToken.sessionUser.passwordHash) {
						return callback(null, false);
					}

					Session.createInstance(session.user)
						.then(function (session) {
							session.getUser()
								.then(function(user){
									let scope = decodedToken.scope;
									let roles = decodedToken.roles;
									let realms = decodedToken.realms;

									callback(null, Boolean(user), { user, scope, roles, realms, session });
								});
						})
						.catch(function () {
							return callback(null, false);
						});
				})
				.catch(function (error) {
					Log.error(error);
				});
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