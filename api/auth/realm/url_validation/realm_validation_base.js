const Joi = require('joi');


module.exports = {
	postPayloadObj: {
		name: Joi.string().min(3).max(64).required(),
		description: Joi.string().min(3).max(255).required(),
	},

	putPayloadObj: {
		id: Joi.number().integer().min(1).required(),
		name: Joi.string().min(3).max(64).required(),
		description: Joi.string().min(3).max(255).required(),
	},

};
