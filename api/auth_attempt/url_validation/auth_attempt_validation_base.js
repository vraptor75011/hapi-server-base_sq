const Joi = require('joi');

const ipString = "\\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.\n" +
	"  (25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.\n" +
	"  (25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.\n" +
	"  (25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\b ";                   // alt(a-zA-Z0-9||_.-) always ends with a-zA-Z0-9 no max length
const ipRegExp = new RegExp(ipString);
const usrString = "^([a-zA-Z0-9]+[\_\.\-]?)*[a-zA-Z0-9]$";                   // alt(a-zA-Z0-9||_.-) always ends with a-zA-Z0-9 no max length
const usrRegExp = new RegExp(usrString);


module.exports = {
	postPayloadObj: {
		ip: Joi.string().length(15).required().regex(ipRegExp),
		username: Joi.string().min(3).max(64).regex(usrRegExp),
		email: Joi.string().email(),
		count: Joi.number().min(0).required(),
	},

	putPayloadObj: {
		id: Joi.number().integer().min(1).required(),
		ip: Joi.string().length(15).required().regex(ipRegExp),
		username: Joi.string().min(3).max(64).regex(usrRegExp),
		email: Joi.string().email(),
		count: Joi.number().min(0).required(),
	},

};
