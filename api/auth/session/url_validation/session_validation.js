const Joi = require('joi');
const _ = require('lodash');
const DB = require('../../../../config/sequelize');
const ModelValidation = require('../../../../utilities/validation/model_validations');
const ModelRelationValidation = require('../../../../utilities/validation/model_relation_validations');
const BaseValidation = require('../../../../utilities/validation/base_validation');
const SessionValidationBase = require('./session_validation_base');

// Base Validation
let paramId = BaseValidation.paramId;
let payloadId = BaseValidation.payloadId;
let baseIds = BaseValidation.ids;
let lang = BaseValidation.lang;

// Model Validation
const Validations = ModelValidation(DB.AuthSession);

let filters = Validations.filters;
let ids = Validations.ids;
let pagination = Validations.pagination;
let fulTextSearch = Validations.fullTextSearch;
let sort = Validations.sort;
let math = Validations.math;
let softDeleted = Validations.softDeleted;
let hardDelete = Validations.hardDelete;
let excludedFields = Validations.excludedFields;
let count = Validations.sort;
let fields = Validations.fields;
let fields4Select = Validations.fields4Select;
let withRelated = Validations.withRelated;
let withRelExcludedFields = Validations.withRelExcludedFields;
let withRelFields = Validations.withRelFields;
let withRelFilters = Validations.withRelFilters;
let withRelCount = Validations.withRelCount;
let withRelSort = Validations.withRelSort;
let val4QueryAll = Object.assign({}, lang, filters, pagination, fulTextSearch, sort, math, softDeleted, excludedFields,
	count, fields, withRelated, withRelExcludedFields, withRelFields, withRelFilters, withRelCount, withRelSort);
let val4Select = Object.assign({}, lang, filters, pagination, sort, fields4Select, withRelated, withRelFilters);

let FLRelations = Validations.FLRelations;
let SLRelations = Validations.SLRelations;
let ALLRelations = Validations.ALLRelations;
let Attributes = Validations.Attributes;

// Model Relations Validation
const RelationValidation = ModelRelationValidation(DB.AuthSession, true, DB.AuthSession.name, null);

let postRelation = RelationValidation.postRelObject;
let putRelation = RelationValidation.putRelObject;

let relationList = RelationValidation.relationList;

let relFilters = RelationValidation.filters;
let relPagination = RelationValidation.pagination;
let relSort = RelationValidation.sort;
let relMath = RelationValidation.math;
let relSoftDeleted = RelationValidation.softDeleted;
let relHardDeleted = RelationValidation.hardDeleted;
let relExcludedFields = RelationValidation.excludedFields;
let relCount = RelationValidation.count;
let relFields = RelationValidation.fields;
let relRelated = RelationValidation.related;
let relExtra = RelationValidation.extra;


module.exports = {
	//Model Information
	FLRelations: FLRelations,
	SLRelations: SLRelations,
	AllRelations: ALLRelations,
	Attributes: Attributes,

	//URL Query
	queryLang: Joi.object().keys(_.assign({}, lang)),
	//FindAll
	queryAll: Joi.object().keys(val4QueryAll),
	//FindOne
	oneParams: Joi.object().keys(_.assign({}, {sessionId: paramId})),
	queryOne: Joi.object().keys(_.assign({}, lang, fields, softDeleted, excludedFields, withRelated, withRelExcludedFields)),


	//Payload
	//POST
	postPayload:  Joi.object().keys(_.assign({}, SessionValidationBase.postPayloadObj, postRelation)),

	//PUT
	putPayload:  Joi.object().keys(_.assign({}, payloadId, SessionValidationBase.putPayloadObj, putRelation)),

	//DELETE
	deleteOnePayload: Joi.alternatives().try(
		Joi.object().keys(_.assign({}, hardDelete)),
		Joi.object().allow(null),
	),

	//DELETE_MANY
	deleteManyPayload: Joi.object().keys(_.assign({}, ids, hardDelete)),

	//Relations URL
	//ADD_ONE
	addOneParams: Joi.object().keys(_.assign({}, {sessionId: paramId}, {childModel: relationList}, {childId: BaseValidation.paramId})),

	//REMOVE_ONE
	removeOneParams: Joi.object().keys(_.assign({}, {sessionId: paramId}, {childModel: relationList}, {childId: BaseValidation.paramId})),
	removeOnePayload: Joi.alternatives().try(
		Joi.object().keys(_.assign({}, hardDelete)),
		Joi.object().allow(null),
	),

	//ADD_MANY
	addManyParams: Joi.object().keys(_.assign({}, {sessionId: paramId}, {childModel: relationList})),
	addManyPayload: Joi.object().keys(_.assign({}, postRelation, baseIds)),

	//REMOVE_MANY
	removeManyParams: Joi.object().keys(_.assign({}, {sessionId: paramId}, {childModel: relationList})),
	removeManyPayload: Joi.alternatives().try(
		Joi.object().keys(_.assign({}, BaseValidation.ids, hardDelete)),
		Joi.object().allow(null),
	),

	//GET_ALL
	getAllParams: Joi.object().keys(_.assign({}, {sessionId: paramId}, {childModel: relationList})),
	queryGetAll: Joi.object().keys(_.assign({}, lang, relFilters, relPagination, relSort, relMath, relSoftDeleted,
		relExcludedFields, relCount, relFields, relRelated, relExtra)),

    //GET for Select
    query4Select: Joi.object().keys(val4Select),

};