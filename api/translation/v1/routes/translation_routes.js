const HeaderValidation = require('../../../../utilities/validation/header_validation');
const { query } = require('../../url_validation/translation_validation');
const { translation, availableLang } = require('../handlers/translation_handlers');
const { failAction } = require('../../../../utilities/error/error-helper');

module.exports = [

	//Translations
	{
		method: 'GET',
		path: '/v1/translations',
		config: {
			handler: translation,
			auth:	false,
			tags: ['api', 'Translation'],
			description: 'GET translation',
			notes: ['Returns stuff translation'],
			validate: {
				options: {
					abortEarly: false
				},
				// headers: HeaderValidation.headerRequired,
				query: query,
				failAction: failAction,
			},
		},
	},

	//Available Languages
	{
		method: 'GET',
		path: '/v1/translations/availableLang',
		config: {
			handler: availableLang,
			auth:	false,
			tags: ['api', 'Translation'],
			description: 'GET available languages',
			notes: ['Returns list of available languages'],
			validate: {
				options: {
					abortEarly: false
				},
				// headers: HeaderValidation.headerRequired,
				failAction: failAction,
			},
		},
	},
];