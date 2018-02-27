const Joi = require('joi');


module.exports = {
	postPayloadObj: {
		profileId: Joi.number().integer().min(1).required(),
		image: {
			parse: true,
			output: 'stream',
			allow: 'multipart/form-data',
		},
	},

	putPayloadObj: {
		id: Joi.number().integer().min(1).required(),
		profileId: Joi.number().integer().min(1).required(),
		image: {
			parse: true,
			output: 'stream',
			allow: 'multipart/form-data',
		},
	},

};
