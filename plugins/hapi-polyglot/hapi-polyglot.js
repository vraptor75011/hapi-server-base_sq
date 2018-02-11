const _ = require('lodash');
const Boom = require('boom');
const HeaderParser = require('accept-language-parser');
const Hoek = require('hoek');
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

// module.export = i18n;
