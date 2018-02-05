const Hapi = require('hapi');
const AuthJWT2 = require('hapi-auth-jwt2');

const Plugins = require('./plugins');
const Routes = require('./routes');
const AuthValidation = require('./auth');
const DB = require('./config/sequelize');

const Log = require('./utilities/logging/logging');
const Chalk = require('chalk');
const Config = require('./config/config');
const Handlebars = require('handlebars');


const HOST = Config.get('/host');
const PORT = Config.get('/port');

let authStrategy = Config.get('/serverHapiConfig/authStrategy');

createDB();
startServer();



async function createDB() {
	let tables = await DB.sequelize.showAllSchemas();
	let host = await DB.sequelize.config.host;
	Log.sequelizeLogger.info(Chalk.green('Sequelize started'));
	Log.sequelizeLogger.info(Chalk.green('Host: ', host));
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

		// API prefix for Route
		server.realm.modifiers.route.prefix = '/api';

		// Load Auth Plugin
		await server.register(AuthJWT2);

		// Config the Auth strategy
		server.auth.strategy(authStrategy, 'jwt',
			{
				key: Config.get('/jwtSecret'),          // Never Share your secret key
				validate: AuthValidation,                 // validate function defined above
				verifyOptions: {algorithms: ['HS256']}  // pick a strong algorithm
			});

		server.auth.default(authStrategy);

		// Add to server Response Refreshed Tokens (if they exist!)
		server.ext('onPreResponse', (request, h) => {

			const Creds = request.auth.credentials;

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
			} else {
				return h.continue
			}
		});

		Log.apiLogger.info(Chalk.cyan('Auth loaded'));

		// Load other Plugins: Vision, Inert and Swagger
		await server.register(Plugins);
		Log.apiLogger.info(Chalk.cyan('Plugins loaded'));

		// Config views for the HTML response
		server.views({
			engines: { html: Handlebars },
			relativeTo: __dirname,
			path: `templates/.}`
		});
		Log.apiLogger.info(Chalk.cyan('View loaded'));

		// Import in server all endpoints
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
