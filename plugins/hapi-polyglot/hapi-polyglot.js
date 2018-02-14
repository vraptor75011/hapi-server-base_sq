const LocaleI18n = require('./polyglot');

exports.plugin = {
	name: 'polyglot',
	version: '2.2.2',
	pkg: require('../../package.json'),
	register: (server, options) => {
		try {
			LocaleI18n.register(server, options);
		} catch(error) {
			return error;
		}
	}
};

