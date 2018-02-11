const HapiPolyglot = require('./hapi-polyglot/hapi-polyglot');


const TranslatePack = {
	hapiLocale: {
		plugin: HapiPolyglot,
		options: {
			directory: './locales',
		}
	},
	// joi18n: {
	// 	plugin: Joi18n,
	// },
};

module.exports = TranslatePack;
