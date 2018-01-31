const Joi = require('joi');

const usrString = "^([a-zA-Z0-9]+[\_\.\-]?)*[a-zA-Z0-9]$";                   // alt(a-zA-Z0-9||_.-) always ends with a-zA-Z0-9 no max length
const pwdString = "^[a-zA-Z0-9àèéìòù\*\.\,\;\:\-\_\|@&%\$]{3,}$";
const usrRegExp = new RegExp(usrString);
const pwdRegExp = new RegExp(pwdString);


module.exports = {
	postPayloadObj: {
		username: Joi.string().min(3).max(64).regex(usrRegExp),
		password: Joi.string().min(3).max(64).regex(pwdRegExp).required(),
		email: Joi.string().email().required(),
		isActive: Joi.boolean().valid(true, false).default(false),
		firstName: Joi.string().min(1).max(64).required(),
		lastName: Joi.string().min(1).max(64).required(),
	},

	putPayloadObj: {
		id: Joi.number().integer().min(1).required(),
		username: Joi.string().min(3).max(64).regex(usrRegExp),
		password: Joi.string().min(3).max(64).regex(pwdRegExp),
		email: Joi.string().email().required(),
		isActive: Joi.boolean().valid(true, false).default(false),
		firstName: Joi.string().min(1).max(64).required(),
		lastName: Joi.string().min(1).max(64).required(),
	},

	registrationPayloadObj: {
		username: Joi.string().min(3).max(64).regex(usrRegExp),
		password: Joi.string().min(3).max(64).regex(pwdRegExp).required(),
		email: Joi.string().email().required(),
		firstName: Joi.string().min(1).max(64).required(),
		lastName: Joi.string().min(1).max(64).required(),
	},

	registrationResetPWDPayloadObj: {
		email: Joi.string().email().required(),
		password: Joi.string().min(3).max(64).regex(pwdRegExp).required(),
	},

};
