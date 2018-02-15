const Log = require('../../../../utilities/logging/logging');
const Polyglot = require('./../../../../plugins/hapi-polyglot/polyglot');


let polyglot = Polyglot.getPolyglot();

module.exports = {
	// TRANSLATIONS - One endpoints for all translation
	translation: async (request, h) => {
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let translation = {
			// translation: {
			// 	[modelName]: translation[modelName],
			// 	common: translation.common,
			// 	relation: translation.relation,
			// }
		};
		let stuff = request.query.stuff;

		if (stuff) {
			let scaffold = require('../../../../locales/'+ polyglot.locale() + '/web_app/scaffold');
			let model = require('../../../../locales/'+ polyglot.locale() + '/model/model');

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

};