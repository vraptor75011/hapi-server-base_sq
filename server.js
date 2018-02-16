const Hapi = require('hapi');

const Plugins = require('./plugins');
const Routes = require('./routes');
const DB = require('./config/sequelize');

const { apiLogger, seqLogger, chalk } = require('./utilities/logging/logging');
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
		seqLogger.info(chalk.green('Sequelize started'));
		seqLogger.info(chalk.green('Host: ', host));
		tables.forEach(function(table) {
			Object.keys(table).map(function(name) {
				let tableName = table[name];
				seqLogger.info(chalk.green('Table found: ' + tableName));
			});
		});
		return tables;
	} catch(error) {
		seqLogger.error(chalk.red(error));
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
		apiLogger.info(chalk.cyan('Plugins loaded'));

		// Config views for the HTML response
		server.views({
			engines: { html: Handlebars },
			relativeTo: __dirname,
			path: `templates/.}`
		});
		apiLogger.info(chalk.cyan('View loaded'));

		// Import in server all endpoints
		await server.route(Routes);
		apiLogger.info(chalk.cyan('Routes loaded'));

		// Start Server
		await server.start();
		apiLogger.info(chalk.cyan('Server running at: ' + server.info.uri));
		return server;
	} catch(error) {
		apiLogger.error(chalk.red('Failed to start Server: ' + error));
	}
}
