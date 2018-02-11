const _ = require('lodash');
const FS = require('fs');
const HeaderParser = require('accept-language-parser');
const Log = require('../../utilities/logging/logging');
const Chalk = require('chalk');
const Polyglot = require('node-polyglot');
const Config = require('./../../config/config');

const Locales = Config.get('/locales');

let polyglot = new Polyglot();

module.exports = {

	constructor () {
		this.currentLocale = 'en_US';
	},

	bestMatch (requested) {
		if (!requested) return;
		if (!Array.isArray(requested)) requested = [requested];

		for (let one of requested) {
			if (Locales.indexOf(one) > -1) return one
		}
		return 'en_US'
	},

	parseHeader (request) {
		let raw = HeaderParser.parse(request.headers['accept-language']);
		let locales = raw.map(function (value) {
			return value.region ? value.code + '_' + value.region : value.code
		});
		return this.bestMatch(locales)
	},

	getLocale (request) {
		if (request.query && request.query.lang) {
			this.currentLocale = request.query.lang;
			return
		}
		this.currentLocale = this.parseHeader(request)
	},

	extractDefaultLocale (allLocales) {
		if (!allLocales) {
			throw new Error('No locales defined!')
		}
		if (allLocales.length === 0) {
			throw new Error('Locales array is empty!')
		}
		return allLocales[0]
	},

	register (server, options) {
		let pluginOptions = {};
		if (options) {
			pluginOptions = options
		}
		this.polyglot = polyglot;
		let defaultLocale = this.extractDefaultLocale(Locales);

		server.ext('onPreAuth', (request, h) => {
			if (typeof this.polyglot === 'undefined') {
				this.polyglot = polyglot;
			}
			request.polyglot = this.polyglot;
			request.polyglot.locale(defaultLocale);
			if (pluginOptions.languageHeaderField) {
				let languageCode = request.headers[pluginOptions.languageHeaderField];
				if (languageCode) {
					request.i18n.setLocale(languageCode)
				}
			}
			this.getLocale(request);
			if (_.includes(Locales, this.currentLocale) === false) {
				this.polyglot.locale(defaultLocale);
				request.polyglot.locale(defaultLocale);
				Log.apiLogger.error(Chalk.red('No localization available for ' + this.currentLocale));
			} else {
				this.polyglot.locale(this.currentLocale);
				request.polyglot.locale(this.currentLocale);
			}
			let directory = 'locales/' + this.polyglot.locale();
			let files = getFiles(directory);
			let extend = {}
			files.forEach((file) => {
				let f = require('../../locales/' + this.polyglot.locale() + '/' + file);
				_.merge(extend, f);
			});
			this.polyglot.extend(extend);
			request.polyglot.extend(extend);
			return h.continue
		});

		// server.ext('onPreResponse', (request, reply) => {
		// 	if (!request.i18n || !request.response) {
		// 		return reply.continue()
		// 	}
		// 	var response = request.response
		// 	if (response.variety === 'view') {
		// 		response.source.context = Hoek.merge(response.source.context || {}, request.i18n)
		// 		response.source.context.languageCode = request.i18n.getLocale()
		// 	}
		// 	return reply.continue()
		// })

	},

	polyglot () {
		return this.polyglot
	},


};

let getFiles = function(dir, fileList = []) {
//
	let	files = FS.readdirSync(dir);
	files.forEach(function(file) {
		if (FS.statSync(dir + '/' + file).isDirectory()) {
			getFiles(dir + '/' + file, fileList);
		}
			fileList.push(file);
	});
	return fileList;
};
