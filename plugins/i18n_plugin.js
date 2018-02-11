const HapiPolyglot = require('./hapi-polyglot/hapi-polyglot');


module.exports = {
	hapiLocale: {
		plugin: HapiPolyglot,
		options: {
			directory: './locales',
		}
	},

};
