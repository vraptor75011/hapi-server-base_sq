const SwaggerPack = require('./plugins/swagger_plugin');
const I18n = require('./plugins/i18n_plugin');
const Auth = require('./plugins/auth_plugin');


const Plugins = [

	// Swagger
	SwaggerPack.inert,
	SwaggerPack.vision,
	SwaggerPack.swagger,

	// Joi Message Translate
	I18n.hapiLocale,

	// Auth with JWT2
	Auth.hapiAuth,

];

module.exports = Plugins;
