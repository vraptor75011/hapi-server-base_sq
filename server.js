const Hapi = require('hapi');

const Plugins = require('./plugins');
const Routes = require('./routes');
const DB = require('./config/sequelize');

const Log = require('./utilities/logging/logging');
const Chalk = require('chalk');
const Config = require('./config/config');
const Handlebars = require('handlebars');


const HOST = Config.get('/host');
const PORT = Config.get('/port');


createDB();
module.exports = startServer();



async function createDB() {
	try{
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
	} catch(error) {
		Log.sequelizeLogger.error(Chalk.red(error));
	}
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

		// Load Plugin: Auth with JWT2
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
		await server.start();
		Log.apiLogger.info(Chalk.cyan('Server running at: ' + server.info.uri));
		return server;
	} catch(error) {
		Log.apiLogger.error(Chalk.red('Failed to start Server: ' + error));
	}
}
