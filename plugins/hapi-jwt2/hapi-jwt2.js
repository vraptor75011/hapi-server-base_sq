const HapiJWT2 = require('./auth-jwt2');

exports.plugin = {
	name: 'auth-jwt2',
	version: '2.0.7',
	pkg: require('../../package.json'),
	register: (server, options) => {
		try {
			HapiJWT2.register(server, options);
		} catch(error) {
			return error;
		}
	}
};
