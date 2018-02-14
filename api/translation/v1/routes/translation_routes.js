const HeaderValidation = require('../../../../utilities/validation/header_validation');
const TValidation = require('../../url_validation/translation_validation');
const THandler = require('../handlers/translation_handlers');
const ErrorHelper = require('../../../../utilities/error/error-helper');

module.exports = [

	//Translations
	{
		method: 'GET',
		path: '/v1/users/t',
		config: {
			handler: THandler.translation,
			auth:
			false,
			tags: ['api', 'Users', 'Translation'],
			description: 'GET User model translation',
			notes: ['Returns User model translation'],
			validate: {
				options: {
					abortEarly: false
				},
				// headers: HeaderValidation.headerRequired,
				query: TValidation.queryLang,
				failAction: ErrorHelper.failAction,
			},
		},
	},
];