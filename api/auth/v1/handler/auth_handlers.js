const Boom = require('boom');
const Log = require('../../../../utilities/logging/logging');
const Chalk = require('chalk');
const Jwt = require('jsonwebtoken');
const Bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;
const DB = require('../../../../config/sequelize');

const Config = require('../../../../config/config');
const AUTH_STRATEGIES = Config.get('/constants/AUTH_STRATEGIES');
const authStrategy = Config.get('/serverHapiConfig/authStrategy');
const expirationPeriod = Config.get('/expirationPeriod');
const ErrorHelper = require('../../../../utilities/error/error-helper');
const HandlerHelper = require('../../../../utilities/handler/handler-helper');
const Token = require('../../../../utilities/token/token');
const Mailer = require('../../../../utilities/mailer/mailer');

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
			let roles = [];
			let realms = [];
			realms.push(request.pre.realm.name);
			request.pre.roles.forEach(function(role){
				roles.push(role.name);
			});


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
			user.dataValues.roles = roles;
			user.dataValues.realms = realms;
			user.dataValues.scope = scope;

			Log.apiLogger.info(Chalk.cyan('User: ' + user.username + ' has logged in'));

			const mapperOptions = {
				meta: {
					authHeader,
					refreshToken,
				},
				doc: {
					user
				},
			};
			return reply(mapperOptions);

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
			try {
				let credential = request.auth.credentials;
				let realm = await Realm.findOne({where: {id: {[Op.eq]: credential.session.realmId}}});
				if (realm) {
					let realms = [];
					realms.push(realm.name);
					let user = await User.findOne({
						where: {id: {[Op.eq]: credential.user.id}},
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
					let roles = [];
					let scope = [];

					if (user) {
						// Check user active?
						if (!user.isActive) {
							return reply(Boom.unauthorized('Account is inactive.'));
						}

						// Create new Session
						let newSession = await Session.createInstance(user, realm);
						Log.session.info(Chalk.grey('User: ' + user.username + ' refresh session: ' + newSession.key));

						// Search user roles in Session realm
						user.roles.forEach(function(role){
							roles.push(role.name);
						});

						// Create new Scope from Session User Roles
						// Add 'Logged' to scope
						scope = scope.concat('Logged');
						// Add Realm-Roles to Scope
						roles.forEach(function (roleName){
							if (roleName.indexOf('User') !== -1) {
								scope = scope.concat(realm.name+'-'+roleName+'-'+user.id)
							} else {
								scope = scope.concat(realm.name+'-'+roleName);
							}
						});

						// Create new two tokens
						let authHeader = 'Bearer ' + await Token(user, null, scope, roles, realms, expirationPeriod.short);
						scope = scope.concat('Refresh');
						let refreshToken = await Token(null, newSession, scope, roles, realms, expirationPeriod.long);

						// Response
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
						user.dataValues.roles = roles;
						user.dataValues.realms = realms;
						user.dataValues.scope = scope;
						const response = {
							meta: {
								authHeader,
								refreshToken,
							},
							doc: {
								user
							},
						};
						return reply(response);
					} else {
						Log.apiLogger.error(Chalk.red('Refresh: Old Session without userId'));
						let errorMsg = error.message || 'An error occurred';
						return reply(Boom.gatewayTimeout(errorMsg));
					}
				} else {
					Log.apiLogger.error(Chalk.red('Refresh: Old Session without realmId'));
					let errorMsg = error.message || 'An error occurred';
					return reply(Boom.gatewayTimeout(errorMsg));
				}
			} catch(error) {
				Log.apiLogger.error(Chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return reply(Boom.gatewayTimeout(errorMsg));
			}
		},

		accountRegistration: async function (request, reply) {
			try {
				let user = request.payload.user;
				let result;

				let keyHash = await Session.generateKeyHash();

				user.isActive = false;
				user.password = User.hashPassword(user.password);
				user.activateAccountToken = keyHash.hash;
				user.activateAccountExpires = Date.now() + (4*1000*60*60);
				user.realmsRolesUsers = {realmId: 1, roleId: 1};

				result = await HandlerHelper.create(User, user);
				if (result.isBoom) {
					return result;
				} else {
					user = result.doc;
					const emailOptions = {
						subject: 'Activate your ' + Config.get('/websiteName') + ' account',
						to: {
							name: user.firstName + " " + user.lastName,
							address: user.email
						}
					};
					const template = 'welcome';

					const token = Jwt.sign({
						email: user.email,
						key: keyHash.key
					}, Config.get('/jwtSecret'), { algorithm: 'HS256', expiresIn: "4h" });

					const context = {
						clientURL: Config.get('/clientURL'),
						websiteName: Config.get('/websiteName'),
						key: token
					};

					Mailer.sendMail(emailOptions, template, context);
					Log.apiLogger.info(Chalk.cyan('sending welcome email to: ', user.email));
					return reply(result);
				}
			} catch(error) {
				Log.apiLogger.error(Chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return reply(Boom.gatewayTimeout(errorMsg));
			}
		},

		accountInvitation: async function (request, reply) {
			try {
				let user = request.payload.user;
				let result;

				let keyHash = await Session.generateKeyHash();

				let originalPassword = user.password;
				user.isActive = false;
				user.password = User.hashPassword(user.password);
				user.activateAccountToken = keyHash.hash;
				user.activateAccountExpires = Date.now() + (4*1000*60*60);
				user.realmsRolesUsers = {realmId: 1, roleId: 1};

				result = await HandlerHelper.create(User, user);
				if (result.isBoom) {
					return result;
				} else {
					user = result.doc;
					const emailOptions = {
						subject: 'Invitation to ' + Config.get('/websiteName'),
						to: {
							name: user.firstName + " " + user.lastName,
							address: user.email
						}
					};
					const template = 'invite';

					const token = Jwt.sign({
						email: user.email,
						key: keyHash.key
					}, Config.get('/jwtSecret'), { algorithm: 'HS256', expiresIn: "4h" });

					const context = {
						clientURL: Config.get('/clientURL'),
						websiteName: Config.get('/websiteName'),
						inviteeName: 'Admin',
						email: user.email,
						password: originalPassword,
						key: token
					};

					Mailer.sendMail(emailOptions, template, context);
					Log.apiLogger.info(Chalk.cyan('sending welcome email to: ', user.email));
					return reply(result);
				}
			} catch(error) {
				Log.apiLogger.error(Chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return reply(Boom.gatewayTimeout(errorMsg));
			}
		},

		accountActivation: async (request, reply) => {
			try {
				let key = request.pre.decoded.key;
				let user = request.pre.user;
				let token = user.activateAccountToken;

				let keyMatch = await Bcrypt.compare(key, token);
				if (!keyMatch) {
					return reply(Boom.badRequest('Invalid email or key.'));
				}

				const id = request.pre.user.id;
				let attributes = {
					isActive: true,
					activateAccountToken: null,
					activateAccountExpires: null,
				};

				const context = {
					email: user.email,
				};

				let result = await HandlerHelper.update(User, id, attributes);

				if (result) {
					return  reply.view('register_ok', context);
				}	else {
					return  reply.view('register_error');
				}
			} catch(error) {
				Log.apiLogger.error(Chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return reply(Boom.gatewayTimeout(errorMsg));
			}
		},

		resetPWDRequest: async function (request, reply) {
			try {
				let condition = {where: {email: {[Op.eq]: request.payload.email}}};
				let user = await User.findOne(condition);

				let keyHash = await Session.generateKeyHash();

				let attributes = {
					resetPasswordNewPWD: User.hashPassword(request.payload.password),
					resetPasswordToken: keyHash.hash,
					resetPasswordExpires: Date.now() + (4*1000*60*60),
				};

				let result = await HandlerHelper.update(User, user.id, attributes);
				if (result.isBoom) {
					return result;
				} else {
					const emailOptions = {
						subject: 'Reset Password Confirmation from ' + Config.get('/websiteName'),
						to: {
							name: user.firstName + " " + user.lastName,
							address: user.email
						}
					};
					const template = 'reset-password';

					const token = Jwt.sign({
						email: user.email,
						key: keyHash.key
					}, Config.get('/jwtSecret'), { algorithm: 'HS256', expiresIn: "4h" });

					const context = {
						clientURL: Config.get('/clientURL'),
						websiteName: Config.get('/websiteName'),
						key: token
					};

					Mailer.sendMail(emailOptions, template, context);
					Log.apiLogger.info(Chalk.cyan('sending reset password email to: ', user.email));
					return reply(result);
				}
			} catch(error) {
				Log.apiLogger.error(Chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return reply(Boom.gatewayTimeout(errorMsg));
			}
		},

		activeNewPWD: async (request, reply) => {
			try {
				let key = request.pre.decoded.key;
				let user = request.pre.user;
				let token = user.activateAccountToken;

				let keyMatch = await Bcrypt.compare(key, token);
				if (!keyMatch) {
					return reply(Boom.badRequest('Invalid email or key.'));
				}

				const id = request.pre.user.id;
				let attributes = {
					isActive: true,
					password: user.resetPasswordNewPWD,
					resetPasswordToken: null,
					resetPasswordExpires: null,
					resetPasswordNewPWD: null,
				};

				const context = {
					email: user.email,
				};

				let result = await HandlerHelper.update(User, id, attributes);

				if (result) {
					return  reply.view('reset_pwd_ok', context);
				}	else {
					return  reply.view('reset_pwd_error');
				}
			} catch(error) {
				Log.apiLogger.error(Chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return reply(Boom.gatewayTimeout(errorMsg));
			}
		},

	};