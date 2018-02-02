const Swagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');

const BaseOptions = {
	basePath: '/api',
	validVersions: [1, 2],
	defaultVersion: 2
};


const Options = {
	info: {
		'title': 'HAPI Server API Documentation',
		'version': '1.0.0',
	},
	pathPrefixSize: 3,
	basePath: BaseOptions.basePath,

	deReference: false
};

const SwaggerPack = {
	inert: {
		plugin: Inert,
	},
	vision: {
		plugin: Vision,
	},
	swagger: {
		plugin: Swagger,
		options: Options,
	}
};


module.exports = SwaggerPack;
