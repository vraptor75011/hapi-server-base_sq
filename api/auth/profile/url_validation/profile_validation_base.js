const Joi = require('joi');

module.exports = {
	postPayloadObj: {
		userId: Joi.number().integer().min(1).required(),
		firstName: Joi.string().min(1).max(64).required(),
		lastName: Joi.string().min(1).max(64).required(),
		langDefault: Joi.string().min(2).max(8),
		mobilePhone: Joi.string().min(5).max(15),
	},

	putPayloadObj: {
		id: Joi.number().integer().min(1).required(),
		userId: Joi.number().integer().min(1).required(),
		firstName: Joi.string().min(1).max(64).required(),
		lastName: Joi.string().min(1).max(64).required(),
		langDefault: Joi.string().min(2).max(8),
		mobilePhone: Joi.string().min(5).max(15),
	},

};
