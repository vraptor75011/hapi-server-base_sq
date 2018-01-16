const Joi = require('joi');
const _ = require('lodash');
const DB = require('../../../config/sequelize');
const ModelValidation = require('../../../utilities/validation/model_validations');
const ModelRelationValidation = require('../../../utilities/validation/model_relation_validations');
const BaseValidation = require('../../../utilities/validation/base_validation');
const SessionValidationBase = require('./session_validation_base');


const Validations = ModelValidation(DB.Session);

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
let related = Validations.related;
let extra = Validations.extra;

let FLRelations = Validations.FLRelations;
let SLRelations = Validations.SLRelations;
let ALLRelations = Validations.ALLRelations;
let Attributes = Validations.Attributes;

const RelationValidation = ModelRelationValidation(DB.Session, true, DB.Session.name, null);

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


const SessionValidation = {
	//Model Information
	FLRelations: FLRelations,
	SLRelations: SLRelations,
	AllRelations: ALLRelations,
	Attributes: Attributes,

	//URL Query
	//FindAll
	queryAll: Joi.object().keys(Object.assign({}, filters, pagination, sort, math, softDeleted, excludedFields, count, fields, related, extra)),
	//FindOne
	oneParams: Joi.object().keys(_.assign({}, {sessionId: BaseValidation.paramId})),
	queryOne: Joi.object().keys(_.assign({}, fields, softDeleted, excludedFields, related)),


	//Payload
	//POST
	postPayload:  Joi.object().keys(_.assign({}, SessionValidationBase.postPayloadObj, postRelation)),

	//PUT
	putPayload:  Joi.object().keys(_.assign({}, BaseValidation.payloadId, SessionValidationBase.postPayloadObj, putRelation)),

	//DELETE
	deleteOnePayload: Joi.alternatives().try(
		Joi.object().keys(_.assign({}, hardDelete)),
		Joi.object().allow(null),
	),

	//DELETE_MANY
	deleteManyPayload: Joi.object().keys(_.assign({}, ids, hardDelete)),

	//Relations URL
	//ADD_ONE
	addOneParams: Joi.object().keys(_.assign({}, {sessionId: BaseValidation.paramId}, {childModel: relationList}, {childId: BaseValidation.paramId})),

	//REMOVE_ONE
	removeOneParams: Joi.object().keys(_.assign({}, {sessionId: BaseValidation.paramId}, {childModel: relationList}, {childId: BaseValidation.paramId})),
	removeOnePayload: Joi.alternatives().try(
		Joi.object().keys(_.assign({}, hardDelete)),
		Joi.object().allow(null),
	),

	//ADD_MANY
	addManyParams: Joi.object().keys(_.assign({}, {sessionId: BaseValidation.paramId}, {childModel: relationList})),
	addManyPayload: Joi.object().keys(_.assign({}, postRelation, BaseValidation.ids)),

	//REMOVE_MANY
	removeManyParams: Joi.object().keys(_.assign({}, {sessionId: BaseValidation.paramId}, {childModel: relationList})),
	removeManyPayload: Joi.alternatives().try(
		Joi.object().keys(_.assign({}, BaseValidation.ids, hardDelete)),
		Joi.object().allow(null),
	),

	//GET_ALL
	getAllParams: Joi.object().keys(_.assign({}, {sessionId: BaseValidation.paramId}, {childModel: relationList})),
	queryGetAll: Joi.object().keys(_.assign({}, relFilters, relPagination, relSort, relMath, relSoftDeleted, relExcludedFields, relCount, relFields, relRelated, relExtra)),

};

module.exports = SessionValidation;