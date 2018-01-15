const Joi = require('joi');


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
};