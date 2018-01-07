const Hapi = require('hapi');

const Plugins = require('./plugins');
const Routes = require('./routes');
const Auth = require('./auth');
const DB = require('./config/sequelize');

const Log = require('./utilities/logging/logging');
const Chalk = require('chalk');
const Config = require('./config/config');

const HOST = Config.get('/host');
const PORT = Config.get('/port');

// Create a server with a host and port
const server = new Hapi.Server({
	debug: {
		request: ['error']
	},
	connections: {
		routes: {
			security: true,
			cors: true,
		}
	},
});

server.connection({
	host: HOST,
	port: PORT,
});

server.realm.modifiers.route.prefix = '/api';

let db = createDB();

// Auth module
return server.register(Auth)
	.then(function() {
		Log.apiLogger.info(Chalk.cyan('Auth loaded'));
		return server.register(Plugins)
			.then(function() {
				Log.apiLogger.info(Chalk.cyan('Plugins loaded'));
				// Routes module
				server.register(Routes)
					.then(function(){
						Log.apiLogger.info(Chalk.cyan('Routes loaded'));
						// Start Server
						server.start()
							.then(function(){
								Log.apiLogger.info(Chalk.cyan('Server running at: ' + server.info.uri));
							})
							.catch(function(err){
								Log.apiLogger.error(Chalk.red('error', 'Failed to start Server: ' + err));
							})
					})
					.catch(function(err){
						Log.apiLogger.error(Chalk.red('Failed to register routes: ' + err));
					})
			})
			.catch(function(err){
				Log.apiLogger.error(Chalk.red('Failed to load plugin:' + err));
			})
	})
	.catch(function(err) {
		Log.apiLogger.error(Chalk.red('Failed to register auth: ' + err));
	});

//
// //EXPORT
// module.exports = server;

async function createDB() {
	let tables =  await DB.sequelize.showAllSchemas();
	Log.sequelizeLogger.info(Chalk.green('Sequelize started'));
	tables.forEach(function(table){
		Object.keys(table).map(function(name){
			let tableName = table[name];
			Log.sequelizeLogger.info(Chalk.green('Table found: ' + tableName));
		});
	});
	return tables;
}