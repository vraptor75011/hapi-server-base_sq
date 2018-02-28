const Joi = require('joi');
const Config = require('./../../config/config');

const TModel = require('../../locales/it/model/model');
const TWeb = require('../../locales/it/web_app/scaffold');

const Locales = Config.get('/locales');

let translationValues = () => {
	let transArray = [];
	Object.keys(TModel).map((key) => {
		transArray.push(key)
	});
	Object.keys(TWeb).map((key) => {
		transArray.push(key)
	});

	return transArray.sort();
};

let files = ['app.json', 'common.js'];

module.exports = {
	paramId: Joi.number().integer().min(1).required(),

	payloadId: {
		id: Joi.number().integer().min(1).required(),
	},

	ids: {
		$ids: Joi.alternatives().try(
			Joi.array().min(1).items(
				Joi.number().integer().min(1)
			),
			Joi.number().integer().min(1),
			Joi.object().allow(null),
		),
	},

	lang: {
		lang:	Joi.string().min(2).max(6).allow(Locales)
	},

	stuff: {
		stuff: Joi.string().allow(translationValues())
	},

	file: {
		file: Joi.string().allow(files)
	},

};