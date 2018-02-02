const Hapi = require('hapi');
const AuthJWT2 = require('hapi-auth-jwt2');

const Plugins = require('./plugins');
const Routes = require('./routes');
const AuthValidation = require('./auth');
const DB = require('./config/sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Log = require('./utilities/logging/logging');
const Chalk = require('chalk');
const Config = require('./config/config');
const Vision = require('vision');
const Handlebars = require('handlebars');


const HOST = Config.get('/host');
const PORT = Config.get('/port');

let authStrategy = Config.get('/serverHapiConfig/authStrategy');

createDB();
startServer();


//
// //EXPORT
// module.exports = server;

async function createDB() {
	let tables = await DB.sequelize.showAllSchemas();
	Log.sequelizeLogger.info(Chalk.green('Sequelize started'));
	tables.forEach(function(table) {
		Object.keys(table).map(function(name) {
			let tableName = table[name];
			Log.sequelizeLogger.info(Chalk.green('Table found: ' + tableName));
		});
	});
	return tables;
}

async function startServer() {
	try {
		const server = await new Hapi.Server({
			debug: {
				request: ['error'],
			},
			host: HOST,
			port: PORT,
			routes: {
				cors: true,
				security: true,
			}
		});

		server.realm.modifiers.route.prefix = '/api';

		await server.register(AuthJWT2);

		server.auth.strategy(authStrategy, 'jwt',
			{
				key: Config.get('/jwtSecret'),          // Never Share your secret key
				validate: AuthValidation,                 // validate function defined above
				verifyOptions: {algorithms: ['HS256']}  // pick a strong algorithm
			});

		server.auth.default(authStrategy);

		server.ext('onPreResponse', function (request, h) {

			const Creds = request.auth.credentials;

			// EXPL: if the auth credentials contain session info (i.e. a refresh store), respond with a fresh set of tokens in the header.
			// Otherwise, clear the header tokens.
			if (Creds && Creds.session && request.response.header) {
				request.response.header('X-Auth-Header', Creds.standardToken);
				request.response.header('X-Refresh-Token', Creds.refreshToken);

				let user = {
					id: Creds.user.id,
					username: Creds.user.username,
					email: Creds.user.email,
					fullName: Creds.user.fullName,
					firstName: Creds.firstName,
					lastName: Creds.lastName,
					roles: Creds.roles,
					realms: Creds.realms,
				};
				request.response.header('X-User', JSON.stringify(user));
			}

			return h.continue;
		});
		// await server.register({
		// 	plugin: Auth,
		// });
		Log.apiLogger.info(Chalk.cyan('Auth loaded'));

		await server.register(Plugins);
		Log.apiLogger.info(Chalk.cyan('Plugins loaded'));

		server.views({
			engines: { html: Handlebars },
			relativeTo: __dirname,
			path: `templates/.}`
		});
		Log.apiLogger.info(Chalk.cyan('View loaded'));

		await server.route(Routes);
		Log.apiLogger.info(Chalk.cyan('Routes loaded'));

		// Start Server
		let result = await server.start();
		Log.apiLogger.info(Chalk.cyan('Server running at: ' + server.info.uri));
		return result;
	} catch(error) {
		Log.apiLogger.error(Chalk.red('Failed to start Server: ' + error));
	}
}
