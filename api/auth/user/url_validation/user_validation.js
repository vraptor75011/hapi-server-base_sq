const Joi = require('joi');
const _ = require('lodash');
const DB = require('../../../../config/sequelize');
const ModelValidation = require('../../../../utilities/validation/model_validations');
const ModelRelationValidation = require('../../../../utilities/validation/model_relation_validations');
const BaseValidation = require('../../../../utilities/validation/base_validation');
const UserValidationBase = require('./user_validation_base');


// Base Validation
let paramId = BaseValidation.paramId;
let payloadId = BaseValidation.payloadId;
let baseIds = BaseValidation.ids;
let lang = BaseValidation.lang;

// Model Validation
const Validations = ModelValidation(DB.AuthUser);

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
let withRelTFields = Validations.withRelThroughFields;
let withRelFilters = Validations.withRelFilters;
let withRelTFilters = Validations.withRelThroughFilters;
let withRelCount = Validations.withRelCount;
let withRelSort = Validations.withRelSort;
let val4QueryAll = Object.assign({}, lang, filters, pagination, fulTextSearch, sort, math, softDeleted, excludedFields,
	count, fields, withRelated, withRelExcludedFields, withRelFields, withRelTFields, withRelFilters, withRelTFilters,
	withRelCount, withRelSort);
let val4Select = Object.assign({}, lang, filters, pagination, sort, fields4Select, withRelated, withRelFilters);

let FLRelations = Validations.FLRelations;
let SLRelations = Validations.SLRelations;
let ALLRelations = Validations.ALLRelations;
let Attributes = Validations.Attributes;
let Attributes4Select = Validations.Attributes4Select;


// Relation Validation
const RelationValidation = ModelRelationValidation(DB.AuthUser, true, DB.AuthUser.name, null);

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

let unordered = _.assign({}, relFilters, relPagination, relSort, relMath, relSoftDeleted,
	relExcludedFields, relCount, relFields, relRelated, relExtra);
let ordered = {};

Object.keys(unordered).sort().forEach((key) => {
	ordered[key] = unordered[key];
});


module.exports = {
	//Model Information
	FLRelations: FLRelations,
	SLRelations: SLRelations,
	AllRelations: ALLRelations,
	Attributes: Attributes,
	Attributes4Select: Attributes4Select,

	//URL Query
	queryLang: Joi.object().keys(_.assign({}, lang)),
	//FindAll
	queryAll: Joi.object().keys(val4QueryAll),
	//FindOne
	oneParams: Joi.object().keys(_.assign({}, {userId: paramId})),
	queryOne: Joi.object().keys(_.assign({}, lang, fields, softDeleted, excludedFields, withRelated, withRelExcludedFields)),


	//Payload
	//POST
	postPayload:  Joi.object().keys(_.assign({}, UserValidationBase.postPayloadObj, postRelation)),

	//PUT
	putPayload:  Joi.object().keys(_.assign({}, BaseValidation.payloadId, UserValidationBase.putPayloadObj, putRelation)),

	//DELETE
	deleteOnePayload: Joi.alternatives().try(
		Joi.object().keys(_.assign({}, hardDelete)),
		Joi.object().allow(null),
	),

	//DELETE_MANY
	deleteManyPayload: Joi.object().keys(_.assign({}, ids, hardDelete)),

	//Relations URL
	//ADD_ONE
	addOneParams: Joi.object().keys(_.assign({}, {userId: BaseValidation.paramId}, {childModel: relationList}, {childId: BaseValidation.paramId})),

	//REMOVE_ONE
	removeOneParams: Joi.object().keys(_.assign({}, {userId: BaseValidation.paramId}, {childModel: relationList}, {childId: BaseValidation.paramId})),
	removeOnePayload: Joi.alternatives().try(
		Joi.object().keys(_.assign({}, hardDelete)),
		Joi.object().allow(null),
	),

	//ADD_MANY
	addManyParams: Joi.object().keys(_.assign({}, {userId: BaseValidation.paramId}, {childModel: relationList})),
	addManyPayload: Joi.object().keys(_.assign({}, postRelation, BaseValidation.ids)),

	//REMOVE_MANY
	removeManyParams: Joi.object().keys(_.assign({}, {userId: BaseValidation.paramId}, {childModel: relationList})),
	removeManyPayload: Joi.alternatives().try(
		Joi.object().keys(_.assign({}, BaseValidation.ids, hardDelete)),
		Joi.object().allow(null),
	),

	//GET_ALL
	getAllParams: Joi.object().keys(_.assign({}, {userId: BaseValidation.paramId}, {childModel: relationList})),
	queryGetAll: Joi.object().keys(_.assign({}, lang, ordered)),

	//GET for Select
	query4Select: Joi.object().keys(val4Select),

	//Check Email
	checkMailParams: Joi.string().email().required(),

};