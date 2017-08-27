const Boom = require('boom');
const User = require('../../../models/user/user_model');
const Realm = require('../../../models/realm/realm_model');
const Bcrypt = require('bcrypt');
const Token = require('../../../utilities/token');

const Config = require('../../../config');
const AUTH_STRATEGIES = Config.get('/constants/AUTH_STRATEGIES');
const expirationPeriod = Config.get('/expirationPeriod');
const authStrategy = Config.get('/serverHapiConfig/authStrategy');


const LoginPre = [
	// {
	// 	assign: 'abuseDetected',
	// 	method: function (request, reply) {
	//
	// 		const ip = request.info.remoteAddress;
	// 		const email = request.payload.email;
	//
	// 		AuthAttempt.abuseDetected(ip, email, Log)
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
		method: function (request, reply) {

			const email = request.payload.email;
			const username = request.payload.username;
			const password = request.payload.password;

			let user = {};

			if (username) {
				User.findOne({ username: username }, {require: false})
					.then(function (result) {
						if (!result) {
							return reply(Boom.unauthorized('Invalid username or password'));
						}
						user = result;
						return Bcrypt.compare(password, user.attributes.password)
					})
					.then(function (match) {
						if (match) {
							return reply(user);
						}
						return reply(Boom.unauthorized('Invalid username or password'));
					})
					.catch(function (error) {
						let errorMsg = error.message || 'An error occurred';
						return reply(Boom.gatewayTimeout(errorMsg));
					});
			} else if (email) {
				User.findOne({email: email}, {require: false})
					.fetch()
					.then(function (result) {
						if (!result) {
							return reply(Boom.unauthorized('Invalid email or password'));
						}
						user = result;
						return Bcrypt.compare(password, user.password)
					})
					.then(function (match) {
						if (match) {
							return reply(user);
						}
						return reply(Boom.unauthorized('Invalid email or password'));
					})
					.catch(function (error) {
						let errorMsg = error.message || 'An error occurred';
						return reply(Boom.gatewayTimeout(errorMsg));
					});
			}

		}
	},
	{
		assign: 'realm',
		method: function (request, reply) {

			let realmName = request.payload.realm;
			let user = request.pre.user.attributes;

			Realm
				.findOne({name: realmName}, {require: false})
				.then(function(result){
					let realm = result;
					if (!realm) {
						return reply(Boom.unauthorized('Invalid realm'));
					} else {
						return reply(realm);
					}
				});
			// .catch(function (error) {
			// 	let errorMsg = error.message || 'An error occurred';
			// 	return reply(Boom.gatewayTimeout(errorMsg));
			// });
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
		method: function (request, reply) {

			let user = request.pre.user.attributes;

			if (user.isActive) {
				return reply();
			}
			else {
				return reply(Boom.badRequest('Account is inactive.'));
			}
		}
	},
	// {
	// 	assign: 'session',
	// 	method: function (request, reply) {
	// 		if (authStrategy === AUTH_STRATEGIES.TOKEN) {
	// 			reply(null);
	// 		}
	// 		else {
	// 			Session.createInstance(request.pre.user)
	// 				.then(function (session) {
	// 					return reply(session);
	// 				})
	// 				.catch(function (error) {
	// 					Log.error(error);
	// 					return reply(Boom.gatewayTimeout('An error occurred.'));
	// 				});
	// 		}
	// 	}
	// },
	{
		assign: 'roles',
		method: function (request, reply) {

			let user = request.pre.user.attributes;
			let realm = request.pre.realm.attributes;
			let roles = [];

			User
				.findOne({id: user.id},
					{withRelated: ['roles', {
						'roles': function (qb) {
							qb.where('roles.realm_id', '=', realm.id);
						}}]
					})
				.then(function(result){
					roles = result.related('roles');
					if(roles && roles.length){
						return reply(roles);
					} else {
						return reply(Boom.unauthorized('No roles'));
					}
				})
				.catch(function (error) {
					let errorMsg = error.message || 'An error occurred';
					return reply(Boom.gatewayTimeout(errorMsg));
				});

			// return Permission.getScope(request.pre.user, Log)
			// 	.then(function (scope) {
			// 		return reply(scope);
			// 	});
		}
	},
	{
		assign: 'scope',
		method: function (request, reply) {

			let realm = request.pre.realm.attributes;
			let roles = request.pre.roles;
			let scope = [];

			// Add Realm [id] to Scope
			scope = scope.concat('Realm-'+realm.id);

			// Add Roles to Scope
			roles.each(function (role){
				if (role.attributes.name.indexOf('User') !== -1) {
					scope = scope.concat(role.attributes.name+'-'+request.pre.user.attributes.id)
				} else {
					scope = scope.concat(role.attributes.name);
				}
			});

			return reply(scope);

			// return Permission.getScope(request.pre.user, Log)
			// 	.then(function (scope) {
			// 		return reply(scope);
			// 	});

		}
	},
	{
		assign: 'standardToken',
		method: function (request, reply) {

			let user = request.pre.user.attributes;
			let realm = request.pre.realm.attributes;
			let roles = request.pre.roles;
			let scope = request.pre.scope;

			switch (authStrategy) {
				case AUTH_STRATEGIES.PURE_TOKEN:
					reply(Token(user, null, scope, roles, realm, expirationPeriod.short));
					break;
				case AUTH_STRATEGIES.SESSION_TOKEN:
					reply(Token(user, null, scope, roles, realm, expirationPeriod.short));
					break;
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
		method: function (request, reply) {

			let user = request.pre.user.attributes;
			let realm = request.pre.realm.attributes;
			let roles = request.pre.roles;
			let scope = request.pre.scope;

			switch (authStrategy) {
				case AUTH_STRATEGIES.PURE_TOKEN:
					reply(Token(null, user, scope, roles, realm, expirationPeriod.long));
					break;
				case AUTH_STRATEGIES.SESSION_TOKEN:
					reply(Token(null, user, scope, roles, realm, expirationPeriod.long));
					break;
				default:
					break;
			}
		}
	}
];

module.exports = LoginPre;