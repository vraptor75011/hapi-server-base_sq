const SwaggerPack = require('./plugins/swagger_plugin');
const I18n = require('./plugins/i18n_plugin');


const Plugins = [

	// Swagger
	SwaggerPack.inert,
	SwaggerPack.vision,
	SwaggerPack.swagger,

	// Joi Message Translate
	I18n.hapiLocale,

];

module.exports = Plugins;
