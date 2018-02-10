const SwaggerPack = require('./plugins/swagger_plugin');
const Joi18n = require('./plugins/joi18n_plugin');


const Plugins = [

	// Swagger
	SwaggerPack.inert,
	SwaggerPack.vision,
	SwaggerPack.swagger,

	// Joi Message Translate
	Joi18n.hapiLocale,
	Joi18n.joi18n,

];

module.exports = Plugins;
