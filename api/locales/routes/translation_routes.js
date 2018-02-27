const HeaderValidation = require('../../../../../utilities/validation/header_validation');
const { query } = require('../../url_validation/translation_validation');
const { translation, availableLang } = require('../handlers/translation_handlers');
const { failAction } = require('../../../../../utilities/error/error-helper');

module.exports = [


	{
		method: 'GET',
		path: '/static/locales/en/common.json',
		config: {
			handler: translation,
			auth:	false,
			tags: ['api', 'Translation'],
			description: 'GET commons eng translation json',
			notes: ['Returns commons english translation'],
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

    {
        method: 'GET',
        path: '/static/locales/en/app.json',
        config: {
            handler: translation,
            auth:	false,
            tags: ['api', 'Translation'],
            description: 'GET app eng translation json',
            notes: ['Returns app english translation'],
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

    {
        method: 'GET',
        path: '/static/locales/it/common.json',
        config: {
            handler: translation,
            auth:	false,
            tags: ['api', 'Translation'],
            description: 'GET commons italian translation json',
            notes: ['Returns commons italian translation'],
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

    {
        method: 'GET',
        path: '/static/locales/it/common.json',
        config: {
            handler: translation,
            auth:	false,
            tags: ['api', 'Translation'],
            description: 'GET app italian translation json',
            notes: ['Returns app italian translation'],
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


];
