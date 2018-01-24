const Hapi = require('hapi');

const Plugins = require('./plugins');
const Routes = require('./routes');
const Auth = require('./auth');
const View = require('./views');
const DB = require('./config/sequelize');

const Log = require('./utilities/logging/logging');
const Chalk = require('chalk');
const Config = require('./config/config');

const HOST = Config.get('/host');
const PORT = Config.get('/port');

// Create a server with a host and port
const server = new Hapi.Server({
  debug: {
    request: ['error'],
  },
  connections: {
    routes: {
      security: true,
      cors: true,
    },
  },
});

server.connection({
  host: HOST,
  port: PORT,
});
server.realm.modifiers.route.prefix = '/api';

createDB();
startServer(server);


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

async function startServer(server) {
  try {
      await server.register(Auth);
      Log.apiLogger.info(Chalk.cyan('Auth loaded'));
      await server.register(Plugins);
      Log.apiLogger.info(Chalk.cyan('Plugins loaded'));
      await server.register(View);
      Log.apiLogger.info(Chalk.cyan('View loaded'));
      await server.register(Routes);
      Log.apiLogger.info(Chalk.cyan('Routes loaded'));
      // Start Server
      let result = await server.start();
      Log.apiLogger.info(Chalk.cyan('Server running at: ' + server.info.uri));
      return result;
  } catch(error) {
      Log.apiLogger.error(Chalk.red('Failed to start Server: ' + error));
  }
}