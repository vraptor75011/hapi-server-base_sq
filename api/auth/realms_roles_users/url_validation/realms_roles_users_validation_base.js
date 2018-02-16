const Joi = require('joi');


module.exports = {
	postPayloadObj: {
		realmId: Joi.number().integer().min(1).required(),
		roleId: Joi.number().integer().min(1).required(),
		userId: Joi.number().integer().min(1).required(),
	},

	putPayloadObj: {
		id: Joi.number().integer().min(1).required(),
		realmId: Joi.number().integer().min(1).required(),
		roleId: Joi.number().integer().min(1).required(),
		userId: Joi.number().integer().min(1).required(),
	},

};
