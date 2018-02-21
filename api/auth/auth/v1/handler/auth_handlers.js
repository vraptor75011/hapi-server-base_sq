const Boom = require('boom');
const { apiLogger, chalk } = require('../../../../../utilities/logging/logging');
const Jwt = require('jsonwebtoken');
const Bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;
const DB = require('../../../../../config/sequelize');

const Config = require('../../../../../config/config');
const AUTH_STRATEGIES = Config.get('/constants/AUTH_STRATEGIES');
const AuthStrategy = Config.get('/serverHapiConfig/authStrategy');
const expirationPeriod = Config.get('/expirationPeriod');
const ErrorHelper = require('../../../../../utilities/error/error-helper');
const HandlerHelper = require('../../../../../utilities/handler/handler-helper');
const Token = require('../../../../../utilities/token/token');
const Mailer = require('../../../../../utilities/mailer/mailer');

const AuthUser = DB.AuthUser;
const AuthRealm = DB.AuthRealm;
const AuthRole = DB.AuthRole;
const AuthSession = DB.AuthSession;


module.exports =
	{
		login: async (request, h) => {
			let authHeader = "";
			let refreshToken = "";
			let scope = "";
			let userPre = request.pre.user;
			let attempt = request.pre.authAttempt;
			let roles = [];
			let realms = [];
			realms.push(request.pre.realm.name);
			request.pre.roles.forEach(function(role){
				roles.push(role.name);
			});

			// Reset user failed attempts counter
			attempt.count = 0;
			await attempt.save();

			// Update user login information
			userPre.lastLoginAt = userPre.currentLoginAt;
			userPre.currentLoginAt = Date.now();
			userPre.lastLoginIP = userPre.currentLoginIP;
			userPre.currentLoginIP = attempt.ip;
			await userPre.save();

			switch (AuthStrategy) {
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

			let profile = {};
			if (userPre.authProfile) {
				let authProfile = userPre.authProfile;
				profile = {
					id: authProfile.id,
					fullName: authProfile.fullName,
					firstName: authProfile.firstName,
					lastName: authProfile.lastName,
				};
			}

			let user = {
				id: userPre.id,
				email: userPre.email,
				fullName: userPre.fullName,
				username: userPre.username,
				firstName: userPre.firstName,
				lastName: userPre.lastName,
				profile: profile,
				realms,
				roles,
			};

			apiLogger.info(chalk.cyan('User: ' + user.username + ' has logged in'));

			const mapperOptions = {
				meta: {
					authHeader,
					refreshToken,
					user,
				},
				doc: {
					user,
				},
			};
			return mapperOptions;

		},

		logout: async (request, h) => {
			let user = request.auth.credentials.user;
			let sessionKey = request.payload.sessionKey;

			try {
				let query = {where: {key: sessionKey, userId: user.id}};
				let session = await AuthSession.findOne(query);
				if (session) {
					apiLogger.info(chalk.cyan('AuthUser: ' + user.username + ' has logged out'));
					session.destroy();
					return true;
				} else {
					apiLogger.info(chalk.cyan('AuthUser: ' + user.username + ' failed to log out'));
					let message = AuthSession.name + ' key: ' + sessionKey + ' not present';
					let data = {type: AuthSession.name, context: {model: AuthSession.name, value: sessionKey}};
					apiLogger.error(chalk.red(message));
					return Boom.notFound(message, data);
				}
			} catch(error) {
				apiLogger.error(chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return Boom.badImplementation(errorMsg);
			}
		},

		refresh: async (request, h) => {
			// Take new two tokens from Request Auth
			// let authHeader = request.auth.credentials.standardToken;
			// let refreshToken = request.auth.credentials.refreshToken;
			//
			// let user = {
			// 	id: request.auth.credentials.user.id,
			// 	email: request.auth.credentials.user.email,
			// 	fullName: request.auth.credentials.user.fullName,
			// 	username: request.auth.credentials.user.username,
			// 	firstName: request.auth.credentials.user.firstName,
			// 	lastName: request.auth.credentials.user.lastName,
			// 	realms: request.auth.credentials.realms,
			// 	roles: request.auth.credentials.roles,
			// };
			//
			// const response = {
			// 	meta: {
			// 		authHeader,
			// 		refreshToken,
			// 		user,
			// 	},
			// };
			return h.continue;
		},

		accountRegistration: async (request, h) => {
			try {
				let user = request.payload.user;
				let result;

				let keyHash = await AuthSession.generateKeyHash();

				user.isActive = false;
				user.password = AuthUser.hashPassword(user.password);
				user.activateAccountToken = keyHash.hash;
				user.activateAccountExpires = Date.now() + (4*1000*60*60);
				user.realmsRolesUsers = {realmId: 1, roleId: 1};

				result = await HandlerHelper.create(AuthUser, user);
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
					apiLogger.info(chalk.cyan('sending welcome email to: ', user.email));
					return result;
				}
			} catch(error) {
				apiLogger.error(chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return Boom.gatewayTimeout(errorMsg);
			}
		},

		accountInvitation: async (request, h) => {
			try {
				let user = request.payload.user;
				let result;

				let keyHash = await AuthSession.generateKeyHash();

				let originalPassword = user.password;
				user.isActive = false;
				user.password = AuthUser.hashPassword(user.password);
				user.activateAccountToken = keyHash.hash;
				user.activateAccountExpires = Date.now() + (4*1000*60*60);
				user.realmsRolesUsers = {realmId: 1, roleId: 1};

				result = await HandlerHelper.create(AuthUser, user);
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
					apiLogger.info(chalk.cyan('sending welcome email to: ', user.email));
					return result;
				}
			} catch(error) {
				apiLogger.error(chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return Boom.gatewayTimeout(errorMsg);
			}
		},

		accountActivation: async (request, h) => {
			try {
				let key = request.pre.decoded.key;
				let user = request.pre.user;
				let token = user.activateAccountToken;

				let keyMatch = await Bcrypt.compare(key, token);
				if (!keyMatch) {
					return Boom.badRequest('Invalid email or key.');
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

				let result = await HandlerHelper.update(AuthUser, id, attributes);

				if (result) {
					return  h.view('register_ok', context);
				}	else {
					return  h.view('register_error');
				}
			} catch(error) {
				apiLogger.error(chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return Boom.gatewayTimeout(errorMsg);
			}
		},

		resetPWDRequest: async (request, h) => {
			try {
				let condition = {where: {email: {[Op.eq]: request.payload.email}}};
				let user = await AuthUser.findOne(condition);

				let keyHash = await AuthSession.generateKeyHash();

				let attributes = {
					resetPasswordNewPWD: AuthUser.hashPassword(request.payload.password),
					resetPasswordToken: keyHash.hash,
					resetPasswordExpires: Date.now() + (4*1000*60*60),
				};

				let result = await HandlerHelper.update(AuthUser, user.id, attributes);
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
					apiLogger.info(chalk.cyan('sending reset password email to: ', user.email));
					return result;
				}
			} catch(error) {
				apiLogger.error(chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return Boom.gatewayTimeout(errorMsg);
			}
		},

		activeNewPWD: async (request, h) => {
			try {
				let key = request.pre.decoded.key;
				let user = request.pre.user;
				let token = user.activateAccountToken;

				let keyMatch = await Bcrypt.compare(key, token);
				if (!keyMatch) {
					return Boom.badRequest('Invalid email or key.');
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

				let result = await HandlerHelper.update(AuthUser, id, attributes);

				if (result) {
					return  h.view('reset_pwd_ok', context);
				}	else {
					return  h.view('reset_pwd_error');
				}
			} catch(error) {
				apiLogger.error(chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return Boom.gatewayTimeout(errorMsg);
			}
		},

	};