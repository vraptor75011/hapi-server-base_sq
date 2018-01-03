const Hapi = require('hapi');

const Plugins = require('./plugins');
const Routes = require('./routes');
const Auth = require('./auth');
const DB = require('./config/sequelize');

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
        server.log('info', 'Auth loaded');
        // DB module
        // return server.register(DB)
        //     .then(function() {
        //         server.log('info', 'Sequelize loaded');
                // Plugins module
                return server.register(Plugins)
                    .then(function() {
                        server.log('info', 'Plugins loaded');
                        // Routes module
                        server.register(Routes)
                            .then(function(){
                                server.log('info', 'Routes loaded');
                                // Start Server
                                server.start()
                                    .then(function(){
                                        server.log('info', 'Server running at: ' + server.info.uri);
                                    })
                                    .catch(function(err){
                                        server.log('error', 'Failed to start Server: ' + err);
                                    })
                            })
                            .catch(function(err){
                                server.log('error', 'Failed to register routes: ' + err);
                            })
                    })
                    .catch(function(err){
                        server.log('error', 'Failed to load plugin:' + err);
                    })
            // })
            // .catch(function(err){
            //     server.log('error', 'Failed to load Sequelize:' + err);
            // })
    })
    .catch(function(error) {
        server.log('error', 'Failed to register auth: ' + err);
    });

//
// //EXPORT
// module.exports = server;

async function createDB() {
    return await DB.sequelize.sync();
}