const SwaggerPack = require('./plugins/swagger_plugin');


const Plugins = [

	// Swagger
	SwaggerPack.inert,
	SwaggerPack.vision,
	SwaggerPack.swagger,

];

module.exports = Plugins;
