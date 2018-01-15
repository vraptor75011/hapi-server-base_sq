const Joi = require('joi');
const _ = require('lodash');
const DB = require('../../../config/sequelize');
const ModelValidation = require('../../../utilities/validation/model_validations');
const ModelRelationValidation = require('../../../utilities/validation/model_relation_validations');

const usrString = "^([a-zA-Z0-9]+[\_\.\-]?)*[a-zA-Z0-9]$";                   // alt(a-zA-Z0-9||_.-) always ends with a-zA-Z0-9 no max length
const pwdString = "^[a-zA-Z0-9àèéìòù\*\.\,\;\:\-\_\|@&%\$]{3,}$";
const usrRegExp = new RegExp(usrString);
const pwdRegExp = new RegExp(pwdString);

// Model validation to integrate new User POST...with Related Object
const RealmsRolesUsersValidation = require('../../realms_roles_users/url_validation/realms_roles_users_validation');
const relationUrl = Joi.string().required().valid(['realmsRolesUsers', 'roles']);

let putManyRRU = Joi.alternatives().try(
	Joi.array().min(1).items(
		RealmsRolesUsersValidation.putRelationPayload),
	RealmsRolesUsersValidation.putRelationPayload,
	Joi.object().allow(null),
);

let postManyRRU = Joi.alternatives().try(
	Joi.array().min(1).items(
		RealmsRolesUsersValidation.postRelationPayload),
	RealmsRolesUsersValidation.postRelationPayload,
	Joi.object().allow(null),
);
let putChildModels = {
	realmsRolesUsers: putManyRRU,
};
let postChildModels = {
	realmsRolesUsers: postManyRRU,
};


// ^To add all relations to create or add from USER form (with User Object)

const Validations = ModelValidation(DB.User);

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

const RelationValidation = ModelRelationValidation(DB.User, true, DB.User.name, null);

let paramId = RelationValidation.paramId;
let payloadId = RelationValidation.payloadId;
let idsRelation = RelationValidation.ids;
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


let postPayload = {
	username: Joi.string().min(3).max(64).regex(usrRegExp).required(),
	password: Joi.string().min(3).max(64).regex(pwdRegExp).required(),
	email: Joi.string().email().required(),
	isActive: Joi.boolean().valid(true, false).default(false),
	firstName: Joi.string().min(1).max(64).required(),
	lastName: Joi.string().min(1).max(64).required(),
};

const UserValidation = {
	//Model Information
	FLRelations: FLRelations,
	SLRelations: SLRelations,
	AllRelations: ALLRelations,
	Attributes: Attributes,

	//URL Query
	//FindAll
	queryAll: Joi.object().keys(Object.assign({}, filters, pagination, sort, math, softDeleted, excludedFields, count, fields, related, extra)),
	//FindOne
	queryOne: Joi.object().keys(_.assign({}, fields, softDeleted, excludedFields, related)),


	//Payload
	//POST
	postPayload:  Joi.object().keys(_.assign({}, postPayload, postRelation)),

	//PUT
	putPayload:  Joi.object().keys(_.assign({}, payloadId, postPayload, putRelation)),

	//DELETE
	deleteOnePayload: Joi.alternatives().try(
		Joi.object().keys(_.assign({}, hardDelete)),
		Joi.object().allow(null),
	),

	//DELETE_MANY
	deleteManyPayload: Joi.object().keys(_.assign({}, ids, hardDelete)),

	//Relations URL
	//ADD_ONE
	addOneParams: Joi.object().keys(_.assign({}, {userId: paramId}, {childModel: relationList}, {childId: paramId})),

	//REMOVE_ONE
	removeOneParams: Joi.object().keys(_.assign({}, {userId: paramId}, {childModel: relationList}, {childId: paramId})),
	removeOnePayload: Joi.alternatives().try(
		Joi.object().keys(_.assign({}, hardDelete)),
		Joi.object().allow(null),
	),

	//ADD_MANY
	addManyParams: Joi.object().keys(_.assign({}, {userId: paramId}, {childModel: relationList})),
	addManyPayload: Joi.object().keys(_.assign({}, postRelation, idsRelation)),

	//REMOVE_MANY
	removeManyParams: Joi.object().keys(_.assign({}, {userId: paramId}, {childModel: relationList})),
	removeManyPayload: Joi.alternatives().try(
		Joi.object().keys(_.assign({}, idsRelation, hardDelete)),
		Joi.object().allow(null),
	),

	//GET_ALL
	getAllParams: Joi.object().keys(_.assign({}, {userId: paramId}, {childModel: relationList})),
	queryGetAll: Joi.object().keys(_.assign({}, relFilters, relPagination, relSort, relMath, relSoftDeleted, relExcludedFields, relCount, relFields, relRelated, relExtra)),

};

module.exports = UserValidation;