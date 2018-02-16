const _ = require('lodash');
const FS = require('fs');
const HeaderParser = require('accept-language-parser');
const { apiLogger, chalk } = require('../../utilities/logging/logging');
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
			polyglot.locale(defaultLocale);
			if (pluginOptions.languageHeaderField) {
				let languageCode = request.headers[pluginOptions.languageHeaderField];
				if (languageCode) {
					polyglot.locale(languageCode)
				}
			}
			this.getLocale(request);
			if (_.includes(Locales, this.currentLocale) === false) {
				polyglot.locale(defaultLocale);
				apiLogger.error(chalk.red('No localization available for ' + this.currentLocale));
			} else {
				polyglot.locale(this.currentLocale);
			}
			let directory = 'locales/' + this.polyglot.locale();
			let files = getFiles(directory);

			let extend = {};
			files.forEach((file) => {
				let f = require('../../' + file.dir + '/' + file.file);
				if (file.dir === 'locales/it_IT/model') {
					Object.keys(f).map((key) => {
						_.extend(extend, f[key]);
					});
				} else {
					_.extend(extend, f);
				}
			});
			polyglot.extend(extend);
			request.polyglot = polyglot;
			// request.polyglot.extend(JSON.stringify(extend));
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

	getPolyglot () {
		return polyglot
	},


};

let getFiles = function(dir, fileList = []) {
// For Polyglot takes the error files .js and del model folder
	let	files = FS.readdirSync(dir);
	files.forEach(function(file) {
		if (FS.statSync(dir + '/' + file).isDirectory()) {
			if (file === 'model') {
				getFiles(dir + '/' + file, fileList);
			}
		} else if (_.includes(file, '.js')) {
			let tmp = {};
			tmp.dir = dir;
			tmp.file = file;
			fileList.push(tmp);
		}
	});
	return fileList;
};
