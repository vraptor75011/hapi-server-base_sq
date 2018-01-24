const Hoek = require('hoek');
const Vision = require('vision');

module.exports.register = (server, options, next) => {

    server.register(Vision, (err) => {
        Hoek.assert(!err, err);

        server.views({
            engines: {
                html: require('handlebars')
            },
            relativeTo: __dirname,
            path: 'templates'
        });
    });

    next();
};

module.exports.register.attributes = {
    name: 'view',
    version: '0.0.1',
};