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

const Validations = ModelValidation(DB.User);

let filters = Validations.filters;
let ids = Validations.ids;
let pagination = Validations.pagination;
let sort = Validations.sort;
let math = Validations.math;
let softDeleted = Validations.softDeleted;
let hardDeleted = Validations.hardDeleted;
let excludedFields = Validations.excludedFields;
let count = Validations.sort;
let fields = Validations.fields;
let related = Validations.related;
let extra = Validations.extra;

let FLRelations = Validations.FLRelations;
let SLRelations = Validations.SLRelations;
let ALLRelations = Validations.ALLRelations;
let Attributes = Validations.Attributes;

const UserValidation = {
	//Model Information
	FLRelations: FLRelations,
	SLRelations: SLRelations,
	AllRelations: ALLRelations,
	Attributes: Attributes,

	//Params
	//FindOne, Update, Delete
	paramOne:  Joi.object().keys({
		userId: Joi.number().integer().min(1).required(),
	}),

	//URL Query
	//FindAll
	queryAll: Joi.object().keys(Object.assign({}, filters, pagination, sort, math, softDeleted, excludedFields, count, fields, related, extra)),
	//FindOne
	queryOne: Joi.object().keys(_.assign({}, fields, softDeleted, excludedFields, related)),


	//Payload
	//POST
	postPayload:  Joi.object().keys({
		username: Joi.string().min(3).max(64).regex(usrRegExp).required(),
		password: Joi.string().min(3).max(64).regex(pwdRegExp).required(),
		email: Joi.string().email().required(),
		isActive: Joi.boolean().valid(true, false).default(false),
		firstName: Joi.string().min(1).max(64).required(),
		lastName: Joi.string().min(1).max(64).required(),
		// For Relation Objects
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
	deleteOnePayload: Joi.alternatives().try(
		Joi.object().keys(_.assign({}, hardDeleted)),
		Joi.object().allow(null),
	),

	//DELETE_MANY
	deleteManyPayload: Joi.object().keys(_.assign({}, ids, hardDeleted)),

	//ADD_MANY
	addOnePayload:  Joi.object().keys({
		realmsRolesUsers: Joi.alternatives().try(
			Joi.array()
				.items(
					RealmsRolesUsersValidation.postRelationPayload),
			RealmsRolesUsersValidation.postRelationPayload,
			Joi.object().allow(null)),

	})
};

module.exports = UserValidation;