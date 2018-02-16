const Joi = require('joi');


module.exports = {
	postPayloadObj: {
		key: Joi.string().max(255).required(),
		passwordHash: Joi.string().max(255).required(),
		userId: Joi.number().integer().min(1).required(),
	},

	putPayloadObj: {
		id: Joi.number().integer().min(1).required(),
		key: Joi.string().max(255).required(),
		passwordHash: Joi.string().max(255).required(),
		userId: Joi.number().integer().min(1).required(),
	},

};
