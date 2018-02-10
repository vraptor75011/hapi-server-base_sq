const HapiLocale = require('./hapi-locale/hapi-locale');
const Joi18n = require('./joi18n/joi18n');


const JoiTranslatePack = {
	hapiLocale: {
		plugin: HapiLocale,
	},
	joi18n: {
		plugin: Joi18n,
	},
};

module.exports = JoiTranslatePack;
