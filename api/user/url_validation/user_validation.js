const Joi = require('joi');
const _ = require('lodash');
const DB = require('../../../config/sequelize');
const ModelValidation = require('../../../utilities/validation/model_validations');

// Model validation to integrate new User POST...with Related Object
const RealmsRolesUsersValidation = require('../../realms_roles_users/url_validation/realms_roles_users_validation');

const usrString = "^([a-zA-Z0-9]+[\_\.\-]?)*[a-zA-Z0-9]$";                   // alt(a-zA-Z0-9||_.-) always ends with a-zA-Z0-9 no max length
const pwdString = "^[a-zA-Z0-9àèéìòù\*\.\,\;\:\-\_\|@&%\$]{3,}$";
const usrRegExp = new RegExp(usrString);
const pwdRegExp = new RegExp(pwdString);

const User = DB.User;

let filters = ModelValidation(User).filters;
let ids = ModelValidation(User).ids;
let pagination = ModelValidation(User).pagination;
let sort = ModelValidation(User).sort;
let math = ModelValidation(User).math;
let softDeleted = ModelValidation(User).softDeleted;
let hardDeleted = ModelValidation(User).hardDeleted;
let excludedFields = ModelValidation(User).excludedFields;
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
	queryAll: Joi.object().keys(Object.assign({}, filters, pagination, sort, math, softDeleted, excludedFields, count, fields, related, extra)),

	//FindOne
	queryOne: Joi.object().keys(_.assign({}, fields, softDeleted, excludedFields, related)),
	paramOne:  Joi.object().keys({
		userId: Joi.number().integer().min(1).required(),
	}),

	//POST
	postPayload:  Joi.object().keys({
		username: Joi.string().min(3).max(64).regex(usrRegExp).required(),
		password: Joi.string().min(3).max(64).regex(pwdRegExp).required(),
		email: Joi.string().email().required(),
		isActive: Joi.boolean().valid(true, false).default(false),
		firstName: Joi.string().min(1).max(64).required(),
		lastName: Joi.string().min(1).max(64).required(),
		realmsRolesUsers: Joi.alternatives().try(
			Joi.array()
				.items(
					RealmsRolesUsersValidation.postRelationPayload),
			RealmsRolesUsersValidation.postRelationPayload),
	}),

	//PUT
	putPayload:  Joi.object().keys({
		username: Joi.string().min(3).max(64).regex(usrRegExp).required(),
		password: Joi.string().min(3).max(64).regex(pwdRegExp).required(),
		email: Joi.string().email().required(),
		isActive: Joi.boolean().valid(true, false).default(false),
		firstName: Joi.string().min(1).max(64).required(),
		lastName: Joi.string().min(1).max(64).required(),
	}),

	//DELETE
	deleteOnePayload: Joi.object().keys(_.assign({}, hardDeleted)),

	//DELETEMANY
	deleteManyPayload: Joi.object().keys(_.assign({}, hardDeleted, ids)),

};

module.exports = UserValidation;