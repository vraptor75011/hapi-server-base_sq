const HeaderValidation = require('../../../../utilities/validation/header_validation');
const { query } = require('../../url_validation/translation_validation');
const THandler = require('../handlers/translation_handlers');
const ErrorHelper = require('../../../../utilities/error/error-helper');

module.exports = [

	//Translations
	{
		method: 'GET',
		path: '/v1/translations',
		config: {
			handler: THandler.translation,
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
				failAction: ErrorHelper.failAction,
			},
		},
	},
];