const Joi = require('joi');
const ModelValidation = require('../../../utilities/validation/model_validations');
const DB = require('../../../config/sequelize');
const _ = require('lodash');


const RealmsRolesUsers = DB.RealmsRolesUsers;

let filters = ModelValidation(RealmsRolesUsers).filters;
let pagination = ModelValidation(RealmsRolesUsers).pagination;
let sort = ModelValidation(RealmsRolesUsers).sort;
let math = ModelValidation(RealmsRolesUsers).math;
let softDeleted = ModelValidation(RealmsRolesUsers).softDeleted;
let excludedFields = ModelValidation(RealmsRolesUsers).excludedFields;
let count = ModelValidation(RealmsRolesUsers).sort;
let fields = ModelValidation(RealmsRolesUsers).fields;
let related = ModelValidation(RealmsRolesUsers).related;
let extra = ModelValidation(RealmsRolesUsers).extra;

let FLRelations = ModelValidation(RealmsRolesUsers).FLRelations;
let SLRelations = ModelValidation(RealmsRolesUsers).SLRelations;
let ALLRelations = ModelValidation(RealmsRolesUsers).ALLRelations;
let Attributes = ModelValidation(RealmsRolesUsers).Attributes;

const RealmsRolesUsersValidation = {
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
		realmId: Joi.number().min(1).required(),
		roleId: Joi.number().min(1).required(),
		userId: Joi.number().min(1).required(),
	}),
	//POST in Relation with User Model
	postRelationPayload:  Joi.object().keys({
		realmId: Joi.number().min(1),
		roleId: Joi.number().min(1),
	}),

};

module.exports = RealmsRolesUsersValidation;