const Joi = require('joi');
const ModelValidation = require('../../../utilities/validation/model_validations');
const DB = require('../../../config/sequelize');
const _ = require('lodash');

const usrString = "^([a-zA-Z0-9]+[\_\.\-]?)*[a-zA-Z0-9]$";                   // alt(a-zA-Z0-9||_.-) always ends with a-zA-Z0-9 no max length
const pwdString = "^[a-zA-Z0-9àèéìòù\*\.\,\;\:\-\_\|@&%\$]{3,}$";
const usrRegExp = new RegExp(usrString);
const pwdRegExp = new RegExp(pwdString);

const User = DB.User;

let filters = ModelValidation(User).filters;
let pagination = ModelValidation(User).pagination;
let sort = ModelValidation(User).sort;
let math = ModelValidation(User).math;
let count = ModelValidation(User).sort;
let fields = ModelValidation(User).fields;
let related = ModelValidation(User).related;
let extra = ModelValidation(User).extra;

let FLRelations = ModelValidation(User).FLRelations;
let SLRelations = ModelValidation(User).SLRelations;
let ALLRelations = ModelValidation(User).ALLRelations;
let Attributes = ModelValidation(User).Attributes;

const UserValidation = {
	FLRelations: FLRelations,
	SLRelations: SLRelations,
	AllRelations: ALLRelations,
	Attributes: Attributes,

	//FindAll
	queryAll: Joi.object().keys(Object.assign({}, filters, pagination, sort, math, count, fields, related, extra)),

	//FindOne
	queryOne: Joi.object().keys(_.assign({}, fields, related)),
	paramOne:  Joi.object().keys({
		userId: Joi.number().min(1).required(),
	}),

	//POST
	postPayload:  Joi.object().keys({
		id: Joi.number().min(1),
		username: Joi.string().min(3).max(64).regex(usrRegExp).required(),
		password: Joi.string().min(3).max(64).regex(pwdRegExp).required(),
		email: Joi.string().email().required(),
		isActive: Joi.boolean().valid(true, false).required(),
		firstName: Joi.string().min(1).max(64),
		lastName: Joi.string().min(1).max(64),
		createdAt: Joi.date(),
		updatedAt: Joi.date(),
		deletedAt: Joi.date(),
	}),

};

module.exports = UserValidation;