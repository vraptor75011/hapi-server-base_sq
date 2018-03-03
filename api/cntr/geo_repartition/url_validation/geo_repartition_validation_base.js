const Joi = require('joi');


module.exports = {
	postPayloadObj: {
		name: Joi.string().min(3).max(128).required(),
	},

	putPayloadObj: {
		id: Joi.number().integer().min(1).required(),
		name: Joi.string().min(3).max(128).required(),
	},

};
