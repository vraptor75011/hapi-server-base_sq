const Swagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');

const Options = {
	info: {
		'title': 'HAPI Server API Documentation',
		'version': '1.0.0',
	}
};

const SwaggerPack = {
	inert: {
		register: Inert,
	},
	vision: {
		register: Vision,
	},
	swagger: {
		register: Swagger,
		options: Options,
	}
};


module.exports = SwaggerPack;
