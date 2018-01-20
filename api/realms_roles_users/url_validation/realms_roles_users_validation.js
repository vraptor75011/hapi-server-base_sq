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
let hardDelete = Validations.hardDelete;
let excludedFields = Validations.excludedFields;
let count = Validations.sort;
let fields = Validations.fields;
let fields4Select = Validations.fields4Select;
let withRelated = Validations.withRelated;
let withRelFields = Validations.withRelFields;
let withRelFilters = Validations.withRelFilters;
let withRelCount = Validations.withRelCount;
let withRelSort = Validations.withRelSort;
let val4QueryAll = Object.assign({}, filters, pagination, sort, math, softDeleted, excludedFields, count, fields,
	withRelated, withRelFields, withRelFilters, withRelCount, withRelSort);
let val4Select = Object.assign({}, filters, pagination, sort, fields4Select, withRelated, withRelFilters);

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
	queryAll: Joi.object().keys(val4QueryAll),

	//FindOne
	queryOne: Joi.object().keys(_.assign({}, fields, related)),
	paramOne:  Joi.object().keys({
		realmsRolesUsersId: Joi.number().min(1).required(),
	}),

	//POST
	postPayload:  Joi.object().keys({
		realmId: Joi.number().integer().min(1).required(),
		roleId: Joi.number().integer().min(1).required(),
		userId: Joi.number().integer().min(1).required(),
	}),

	//PUT
	putPayload:  Joi.object().keys({
		id: Joi.number().integer().min(1).required(),
		realmId: Joi.number().integer().min(1).required(),
		roleId: Joi.number().integer().min(1).required(),
		userId: Joi.number().integer().min(1).required(),
	}),

	//POST in Relation with User Model
	postRelationPayload:  Joi.object().keys({
		realmId: Joi.number().integer().min(1),
		roleId: Joi.number().integer().min(1),
	}),
	//PUT in Relation with User Model
	putRelationPayload:  Joi.object().keys({
		id: Joi.number().integer().min(1),
		realmId: Joi.number().integer().min(1),
		roleId: Joi.number().integer().min(1),
	}),

	//GET for Select
	find4SelectParams: Joi.object().keys(val4Select),

};

module.exports = RealmsRolesUsersValidation;