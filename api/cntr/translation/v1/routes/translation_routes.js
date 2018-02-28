const HeaderValidation = require('../../../../../utilities/validation/header_validation');
const { query, params } = require('../../url_validation/translation_validation');
const { translation, availableLang, translationAll } = require('../handlers/translation_handlers');
const { failAction } = require('../../../../../utilities/error/error-helper');

module.exports = [

	//Translations
	{
		method: 'GET',
		path: '/v1/cntr/translations',
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
		path: '/v1/cntr/translations/availableLang',
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

	//Translation all together
	{
		method: 'GET',
		path: '/static/locales/{lang}/{file}',
		config: {
			handler: translationAll,
			auth:	false,
			tags: ['api', 'Translation'],
			description: 'GET commons eng translation json',
			notes: ['Returns commons english translation'],
			validate: {
				options: {
					abortEarly: false
				},
				// headers: HeaderValidation.headerRequired,
				params: params,
				failAction: failAction,
			},
		},
	},

	//     {
//         method: 'GET',
//         path: '/static/locales/it/common.json',
//         config: {
//             handler: translation,
//             auth:	false,
//             tags: ['api', 'Translation'],
//             description: 'GET app italian translation json',
//             notes: ['Returns app italian translation'],
//             validate: {
//                 options: {
//                     abortEarly: false
//                 },
//                 // headers: HeaderValidation.headerRequired,
//                 query: query,
//                 failAction: failAction,
//             },
//         },
//     },
];