const Joi = require('joi');
const ModelValidation = require('../../../utilities/validation/model_validations');
const DB = require('../../../config/sequelize');
const _ = require('lodash');


const RealmsRolesUsers = DB.RealmsRolesUsers;
const Validations = ModelValidation(RealmsRolesUsers);

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