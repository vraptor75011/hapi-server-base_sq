const Joi = require('joi');


const usrString = "^([a-zA-Z0-9]+[_.-]?)*[a-zA-Z0-9]$";                   // alt(a-zA-Z0-9||_.-) always ends with a-zA-Z0-9 no max length
const pwdString = "^[a-zA-Z0-9àèéìòù\.\,\;\:\-\_\|@&%$]{3,}$";
const usrRegExp = new RegExp(usrString);
const pwdRegExp = new RegExp(pwdString);

//USER SCHEMA
const UserSchema = {
	name: 'User',
	rel: 'Users',
	table: 'users',
	schemaQuery: () => {return Joi.object().keys({
		id: Joi.number().min(1),
		username: Joi.string().min(1).max(64).regex(usrRegExp),
		email: Joi.string(),
		is_active: Joi.boolean().valid(true, false),
		created_at: Joi.date(),
		updated_at: Joi.date(),
		deleted_at: Joi.date(),
	})},
	schemaPayload: () => {return Joi.object().keys({
		id: Joi.number().min(1),
		username: Joi.string().min(3).max(64).regex(usrRegExp).required(),
		password: Joi.string().min(3).max(64).regex(pwdRegExp).required(),
		email: Joi.string().email().required(),
		isActive: Joi.boolean().valid(true, false).required(),
		createdAt: Joi.date(),
		updatedAt: Joi.date(),
		deletedAt: Joi.date(),
	})},
	
};

module.exports = UserSchema;