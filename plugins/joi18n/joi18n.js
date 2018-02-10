const Hoek = require('hoek'),
      Path = require('path');



exports.plugin = {
    register: (server, options) => {
	    let defaults = {
		    directory       : __dirname + '/../hapi-locale/locales',
		    defaultLocale   : 'en_US',
		    onEvent         : 'onPostAuth',
	    };

	    options = Hoek.applyToDefaults(defaults, options);

	    server.ext(options.onEvent, function (request, h) {
		    let locale = request.server.plugins['hapi-locale'].getLocale(request, h);
		    try {
			    request.route.settings.validate.options.language = require(Path.join(options.directory, locale + '.json'));
		    } catch(err) {
			    request.route.settings.validate.options.language = require(Path.join(options.directory, 'en_US' + '.json'));
		    }

		    return h.continue;
	    });
    },
	pkg             : require('./../../package.json'),
	dependencies    : ['hapi-locale']
};

