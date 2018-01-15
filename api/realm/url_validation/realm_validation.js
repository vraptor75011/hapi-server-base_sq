const Joi = require('joi');
const _ = require('lodash');
const DB = require('../../../config/sequelize');
const ModelValidation = require('../../../utilities/validation/model_validations');
const ModelRelationValidation = require('../../../utilities/validation/model_relation_validations');

// Model validation to integrate new User POST...with Related Object
const RealmsRolesUsersValidation = require('../../realms_roles_users/url_validation/realms_roles_users_validation');
const relationUrl = Joi.string().required().valid(['realmsRolesUsers', 'users']);

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
let idsRelation = {
	ids: Joi.alternatives().try(
		Joi.array().min(1).items(
			Joi.number().integer().min(1)
		),
		Joi.number().integer().min(1),
		Joi.object().allow(null),
	),
};

// ^To add all relations to create or add from USER form (with User Object)

const Validations = ModelValidation(DB.Realm);

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

// const RelationValidation = ModelRelationValidation(DB.Realm, true);
//
// let postRelation = RelationValidation.postRelObject;

let id = Joi.number().integer().min(1).required();

const RealmValidation = {
	//Model Information
	FLRelations: FLRelations,
	SLRelations: SLRelations,
	AllRelations: ALLRelations,
	Attributes: Attributes,

	//Params
	//FindOne, Update, Delete
	paramUserId:  Joi.object().keys({
		userId: id,
	}),

	//URL Query
	//FindAll
	queryAll: Joi.object().keys(Object.assign({}, filters, pagination, sort, math, softDeleted, excludedFields, count, fields, related, extra)),
	//FindOne
	queryOne: Joi.object().keys(_.assign({}, fields, softDeleted, excludedFields, related)),


	//Payload
	//POST
	postPayload:  Joi.object().keys({
		name: Joi.string().min(3).max(64).required(),
		description: Joi.string().min(3).max(255).required(),

		// For Relation Objects optional
		// realmsRolesUsers: postManyRRU,
	}),

	//PUT
	putPayload:  Joi.object().keys({
		id: Joi.number().integer().min(1).required(),
		name: Joi.string().min(3).max(64).required(),
		description: Joi.string().min(3).max(255).required(),

		// For Relation Objects optional
		// realmsRolesUsers: putManyRRU,
	}),

	//DELETE
	deleteOnePayload: Joi.alternatives().try(
		Joi.object().keys(_.assign({}, hardDelete)),
		Joi.object().allow(null),
	),

	//DELETE_MANY
	deleteManyPayload: Joi.object().keys(_.assign({}, ids, hardDelete)),

	//Relations Payload
	//ADD_MANY
	addManyParams: Joi.object().keys(_.assign({}, {userId: id}, {childModel: relationUrl})),
	addManyPayload: Joi.object().keys(_.assign({}, postChildModels, idsRelation)),

	//REMOVE_ONE
	removeOneParams: Joi.object().keys(_.assign({}, {userId: id}, {childModel: relationUrl}, {childId: id})),
	removeOnePayload: Joi.alternatives().try(
		Joi.object().keys(_.assign({}, hardDelete)),
		Joi.object().allow(null),
	),
};

module.exports = RealmValidation;