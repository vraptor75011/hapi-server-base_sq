/**
 * @module 'hapi-locale'
 * @description
 * Configurable plugin for determine request language in hapi.js applications.
 */
const   Boom            = require('boom'),
	FS              = require('fs'),
	Path            = require('path'),
	_               = require('lodash'),
	HeaderParser    = require('accept-language-parser'),
	Joi             = require('joi');

let rootDir     = Path.join(__dirname, '../..');
let localeDir   = Path.join(__dirname);
let locales     = [];

/**
 * @typedef {Object}                    PluginOptions                   - Plugin configuration options.
 * @property {Array.<string>}           [locales=[]]                    - List of locales to use in application.
 * @property {string|null}              [default=1st Locale]            - Default locale to use if no locale is given.
 * @property {string|null}              [configFile=package.json]       - Configuration file to get available locales.
 * @property {string|null}              [configKey=locales]             - Key to look in configuration file to get available locales. May be nested key such as 'a.b.c'.
 * @property {Object}                   [scan]                          - Scanning options to get available locales
 * @property {string}                   [scan.path=locale]              - Path or paths to scan locale files to get available locales.
 * @property {string}                   [scan.fileTypes=json]           - File types to scan. ie. "json" for en_US.json, tr_TR.json
 * @property {boolean}                  [scan.directories=true]         - whether to scan directory names to get available locales.
 * @property {Array.<string>}           [scan.exclude=[templates]]      - Directory or file names to exclude from scan results.
 * @property {string|null}              [param=lang]                    - Name of the path parameter to determine language. ie. /{lang}/account
 * @property {string|null}              [query=lang]                    - Name of the query parameter to determine language. ie. /account?lang=tr_TR
 * @property {string|null}              [cookie=lang]                   - Name of the cookie to determine language.
 * @property {string|null}              [cookieKey=lang]                - Name of the key to look inside cookie to determine language. May be nested key such as 'a.b.c'.
 * @property {string|null}              [header=accept-language]        - Name of the header parameter to determine language.
 * @property {Array.<string>}           [order=['params', 'cookie', 'query', 'headers']] - Order in which language determination process follows. First successful method returns requested language.
 * @property {boolean}                  [throw404=true]                 - Whether to throw 404 not found if locale is not found. Does not apply path parameters, it always throws 404.
 * @property {string|null}              [getter=i18n.getLocale]         - Getter method in request object to get current locale. May be nested object such as 'a.b.c'
 * @property {string|null}              [setter=i18n.setLocale]         - Setter method in request object to set current locale. May be nested object such as 'a.b.c'
 * @property {string|null}              [attribute=i18n.locale]         - Key in request object which will be used to store locale name. May be nested path such as 'a.b.c'.
 * @property {boolean}                  [createAccessors=true]          - Enables creating getter and setter methods in request object.
 * @property {string}                   [onEvent=onPreAuth]             - Event on which locale determination process is fired.
 */

/**
 * @type {PluginOptions}
 * @private
 */
let defaultOptions = {
	locales         : [],
	configFile      : Path.join(rootDir, 'package.json'),
	configKey       : 'locales',
	scan            : {
		path        : Path.join(localeDir, 'locales'),
		fileType    : 'json',
		directories : true,
		exclude     : ['templates', 'template.json']
	},
	param           : 'lang',
	query           : 'lang',
	cookie          : 'lang',
	cookieKey       : 'lang',
	header          : 'accept-language',
	order           : ['params', 'cookie', 'query', 'headers'],
	throw404        : true,
	getter          : 'i18n.getLocale',
	setter          : 'i18n.setLocale',
	attribute       : 'i18n.locale',
	createAccessors : true,
	onEvent         : 'onPreAuth'
};

let orderParameters = {
	// Process in options.order array and JS method which will be called for that process.
	params  : 'parseParam',
	query   : 'parseQuery',
	headers : 'parseHeader',
	cookie  : 'parseCookie'
};

let optionsSchema = {
	locales         : Joi.array().items(Joi.string()).default(defaultOptions.locales),
	default         : Joi.string().allow(null).default(defaultOptions.default),
	configFile      : Joi.string().allow(null).default(defaultOptions.configFile),
	configKey       : Joi.string().allow(null).default(defaultOptions.configKey),
	scan            : Joi.object({
		path        : Joi.string().default(defaultOptions.scan.path),
		fileType    : Joi.string().default(defaultOptions.scan.fileType),
		directories : Joi.boolean().default(defaultOptions.scan.directories),
		exclude     : Joi.array().items(Joi.string()).allow(null).default(defaultOptions.scan.exclude)
	}).allow(null).default(defaultOptions.scan),
	param           : Joi.string().allow(null).default(defaultOptions.param),
	query           : Joi.string().allow(null).default(defaultOptions.query),
	cookie          : Joi.string().allow(null).default(defaultOptions.cookie),
	cookieKey       : Joi.string().allow(null).default(defaultOptions.cookieKey),
	header          : Joi.string().allow(null).default(defaultOptions.header),
	order           : Joi.array().items(Joi.any().valid(Object.keys(orderParameters))).default(defaultOptions.order),
	throw404        : Joi.boolean().default(defaultOptions.throw404),
	getter          : Joi.string().allow(null).default(defaultOptions.getter),
	setter          : Joi.string().allow(null).default(defaultOptions.setter),
	attribute       : Joi.string().allow(null).default(defaultOptions.attribute),
	createAccessors : Joi.string().allow(null).default(defaultOptions.createAccessors),
	onEvent         : Joi.string().default(defaultOptions.onEvent)
};

/**
 * Class to implement inner working of plugin.
 * @param {PluginOptions} options     - Plugin configuration options.
 * @constructor
 * @private
 */
let Internal = function(options) {
	"use strict";
	if ((options.setter && options.setter.indexOf('.') > -1) || (options.getter && options.getter.indexOf('.') > -1)) {
		throw new Error('Getter (' + options.getter + ') and setter (' + options.setter + ') methods cannot be nested, so they cannot contain dot(.)');
	}

	this.options    = Joi.attempt(options, optionsSchema);
	this.locales    = this.getAvailableLocales();
	this.default    = this.options.default || this.locales[0];
	//this.callback   = this.getCallback(this.options.callback);
};

/**
 * Returns requested languages as an array by looking url part.
 * @param {Object}          request     - Hapi request object.
 * @returns {string|undefined}          - Requested locale or undefined.
 * @private
 */
Internal.prototype.parseParam = function parseParam(request) {
	"use strict";
	if (!request.params.hasOwnProperty(this.options.param)) return;
	let name    = this.options.param,
		locales = _.get(request.params, name),
		match   = this.bestMatch(locales);

	if (!match && this.options.throw404) {
		throw new Error('Requested locale/language ' + locales + ' cannot be found.');
	}

	return match;
};

/**
 * Returns requested languages as an array by looking query parameter.
 * @param {Object}          request     - Hapi request object.
 * @returns {string|undefined}          - Requested locale or undefined.
 * @private
 */
Internal.prototype.parseQuery = function parseQuery(request) {
	"use strict";
	let name    = this.options.query,
		locales = _.get(request.query, name);

	return this.bestMatch(locales);
};

/**
 * Returns requested language from cookie if found in available languages.
 * @param {Object}          request     - Hapi request object.
 * @returns {string|undefined}          - Requested locale or undefined.
 * @private
 */
Internal.prototype.parseCookie = function parseCookie(request) {
	"use strict";
	let name    = this.options.cookie,
		key     = this.options.cookieKey,
		locales = _.get(request.state[name], key);

	return this.bestMatch(locales);
};

/**
 * Returns requested language from header if found in available languages.
 * @param {Object}          request     - Hapi request object
 * @returns {string|undefined}          - Requested locale or undefined.
 * @private
 */
Internal.prototype.parseHeader = function parseHeader(request) {
	let name    = this.options.header,
		raw     = HeaderParser.parse(request.headers[name]),
		locales = raw.map(function(value) {
			return value.region ? value.code + '_' + value.region : value.code;
		});

	return this.bestMatch(locales);
};

/**
 * Returns best match for requested locale among available locales. First matched locale will be returned.
 * @param {string|Array.<string>} requested     - Requested locale or list of requested locales.
 * @returns {string|undefined}                  - Matched locale or null if not any match found.
 * @private
 */
Internal.prototype.bestMatch = function bestMatch(requested) {
	if (!requested) return;
	if (!Array.isArray(requested)) requested = [requested];

	for (let one of requested) {
		if (this.locales.indexOf(one) > -1) return one;
	}
};


/**
 * Checks synchroniously if given file or directory exists. Returns true or false.
 * @param {string}  path        - Path of the file or directory.
 * @param {boolean} shouldBeDir - Whether given path should be directory.
 * @returns {boolean}
 * @private
 */
function fileExists(path, shouldBeDir) {
	"use strict";
	try {
		let lstat = FS.lstatSync(path);
		if (shouldBeDir && lstat.isDirectory()) { return true; }
		if (!shouldBeDir && lstat.isFile()) { return true; }
	} catch(err) {
		return false;
	}
	return false;
}



/**
 * Scans path in options.scan.path and returns list of available locale files.
 * @returns {Array.<string>}
 * @throws {Error} - Throws error if locales directory is not found.
 * @private
 */
Internal.prototype.scan = function scan() {
	// Check if scan path is available
	if (this.options.scan && !fileExists(this.options.scan.path, true)) {
		throw new Error('Locales directory "' + this.options.scan.path + '"cannot be found.');
	}

	let dir     = this.options.scan.path,
		files   = FS.readdirSync(dir),
		locales = [];

	for (let file of files) {
		let fullPath = Path.join(dir, file);

		// Skip if it is in exclude list or it is directory and scan.directories is false
		if (this.options.scan.exclude.indexOf(file) > -1 || (FS.statSync(fullPath).isDirectory() && !this.options.scan.directories)) {
			continue;
		}

		locales.push(Path.basename(file, Path.extname(file)));  // Strip extension such as .json
	}

	return _.uniq(locales);
};


/**
 * Determines which locales are available. It tries to determine available locales in given order:
 * 1. Returns if locales are present in options.locales.
 * 2. If not found, looks for given config file and searches opted key in config file.
 * 3. If not found, scans path given in options.scan.path for files and directories excluding files in options.scan.exclude.
 * @returns {Array|null}    - List of available locales
 * @throws {Error}          - Throws error if necessary files are not found or no locales are available.
 * @private
 */
Internal.prototype.getAvailableLocales = function getAvailableLocales() {
	"use strict";
	let locales = [];

	if (Array.isArray(this.options.locales) && this.options.locales.length > 0) {
		locales = this.options.locales;
		if (!Array.isArray(locales)) locales = [];
	}

	// Config file
	if (locales.length === 0 && this.options.configFile) {

		// Check if config file is available
		if (!fileExists(this.options.configFile, false)) {
			throw new Error('Configuration file "' + this.options.configFile + '" cannot be found');
		}

		locales = _.get(require(this.options.configFile), this.options.configKey);       // key chain string to reference: 'options.locale' => options.locale
		if (!Array.isArray(locales)) locales = [];
	}

	// Locale files
	if (locales.length === 0 && this.options.scan.path) {
		locales = this.scan();
	}

	if (locales.length === 0) {
		throw new Error('Cannot found any locale.')
	}

	return _.uniq(locales);
};


/**
 * @param {Object}              request - hapi.js request object
 * @returns {string|undefined}          - Locale
 * @private
 */
Internal.prototype.determineLocale = function determineLocale(request) {
	let requestedLocale;

	for (let method of this.options.order) {
		requestedLocale = this[orderParameters[method]](request);       // this.parseParam | this.parseCookie ... etc.
		if (requestedLocale) break;
	}

	return requestedLocale || this.default;
};



/**
 *
 * @param {Object}              request - hapi.js request object
 * @param {Function}            h   - hapi.js reply object
 * @returns {*}
 */
Internal.prototype.processRequest = function processRequest(request, h) {
	"use strict";
	try {
		let locale = this.determineLocale(request);

		let getter      = this.options.getter,
			setter      = this.options.setter,
			attribute   = this.options.attribute;

		// Create accessors if necessary
		if (this.options.createAccessors) {
			if (! _.get(request, getter)) {
				_.set(request, getter, function() {
					return _.get(request, attribute);
				});
			}
			if (! _.get(request, setter)) {
				_.set(request, setter, function (locale) {
					return _.set(request, attribute, locale);
				});
			}
		}

		// Call setter.
		_.get(request, setter)(locale);

		return h.continue;

	} catch(err) {
		return Boom.notFound(err);
	}
};





/**
 * Hapi plugin function which adds i18n support to request and response objects.
 * @param {Object}          server      - Hapi server object
 * @param {PluginOptions}   options     - Plugin configuration options.
 * @param {Function}        next        - Callback function.
 */
exports.plugin = {
	name: 'hapi-locale',
	version: '1.0.0',
	register: (server, options) => {
		try {
			let internal = new Internal(options);

			/**
			 * @module exposed
			 * @description
			 * Exposed functions and attributes are listed under exposed name.
			 * To access those attributes `request.server.plugins['hapi-locale']` can be used.
			 * @example
			 * let locales = request.server.plugins['hapi-locale'].getLocales(); // ['tr_TR', 'en_US'] etc.
			 */

			/**
			 * Returns all available locales as an array.
			 * @name getLocales
			 * @function
			 * @returns {Array.<string>}    - Array of locales.
			 * @example
			 * let locales = request.server.plugins['hapi-locale'].getLocales(); // ['tr_TR', 'en_US'] etc.
			 */
			server.expose('getLocales', function getLocales() { return internal.locales; } );

			/**
			 * Returns default locale.
			 * @name getDefaultLocale
			 * @function
			 * @returns {string}    - Default locale
			 */
			server.expose('getDefaultLocale', function getDefaultLocale() { return internal.default; } );

			/**
			 * Returns requested language.
			 * @name getLocale
			 * @function
			 * @param {Object}      request - Hapi.js request object
			 * @returns {string}    Locale
			 */
			server.expose('getLocale', function getLocale(request) {
				try {
					return _.get(request, internal.options.getter)();
				} catch(err) {
					return null;
				}
			});

			server.ext(internal.options.onEvent, internal.processRequest, { bind: internal });

		} catch(err) {
			return err;
		}

	},
	pkg: require('../../package.json'),
};