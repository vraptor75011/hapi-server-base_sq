const { apiLogger } = require('../../../../../utilities/logging/logging');
const Polyglot = require('./../../../../../plugins/hapi-polyglot/polyglot');
const Config = require('./../../../../../config/config');

const Joi = require('joi');
const _ = require('lodash');

const Locales = Config.get('/locales');

let polyglot = Polyglot.getPolyglot();

module.exports = {
	// TRANSLATIONS - One endpoints for all translation
	translation: async (request, h) => {
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		apiLogger.info('RequestData: ' + JSON.stringify(request.query));
		let translation = {
			// translation: {
			// 	[modelName]: translation[modelName],
			// 	common: translation.common,
			// 	relation: translation.relation,
			// }
		};
		let stuff = request.query.stuff;

		if (stuff) {
			let scaffold = require('../../../../../locales/'+ polyglot.locale() + '/web_app/scaffold');
			let model = require('../../../../../locales/'+ polyglot.locale() + '/model/model');

			if (scaffold[stuff]) {
				translation[stuff] = scaffold[stuff];
			}

			if (model[stuff]) {
				translation[stuff] = model[stuff];
			}
		}


		//translation[modelName] = _.extend(translation[modelName], translation.common);
		// Logged user can get list of User model translation

		return {translation};
	},

	availableLang: async (request, h) => {
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		const Locales = Config.get('/locales');

		let translation = { langs: Locales };
		//translation[modelName] = _.extend(translation[modelName], translation.common);
		// Logged user can get list of User model translation

		return {translation};
	},

	translationAll: async (request, h) => {
		let files = ['app.json', 'common.json'];

		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		apiLogger.info('RequestData: ' + JSON.stringify(request.query));
		let translation = {};
		let lang = request.params.lang;
		let file = request.params.file;

		if (_.includes(Locales, lang)) {
			if (file === 'app.json') {
				let pippo =  './../../../../../locales/'+lang+'/model/model';
				let model = require(pippo);
				translation = model;
			}

			if (file === 'common.json') {
				let pippo =  './../../../../../locales/'+lang+'/web_app/scaffold';
				let scaffold = require(pippo);
				translation = scaffold;
			}
		}

		//translation[modelName] = _.extend(translation[modelName], translation.common);
		// Logged user can get list of User model translation

		return translation;
	},

};