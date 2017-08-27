const Joi = require('joi');
const UserSchema = require('../user/user_schema');
const RealmSchema = require('../realm/realm_schema');

// ROLE SCHEMA
const RoleSchema = {
	name: 'role',
	table: 'roles',
	attributes: [
		{
			name: 'id',
			type: 'integer',
		},
		{
			name: 'name',
			type: 'string',
		},
		{
			name: 'description',
			type: 'string'
		},
		{
			name: 'createdAt',
			type: 'date',
		},
		{
			name: 'updatedAt',
			type: 'date',
		},
		{
			name: 'deletedAt',
			type: 'date',
		},
	],
	schemaQuery: () => {return Joi.object().keys({
		id: Joi.number().min(1),
		name: Joi.string().min(4).max(64),
		description: Joi.string().min(5),
		created_at: Joi.date(),
		updated_at: Joi.date(),
		deleted_at: Joi.date(),
	})},
	schemaPayload: () => {return Joi.object().keys({
		id: Joi.number().min(1),
		name: Joi.string().min(4).max(64),
		description: Joi.string().min(5),
		createdAt: Joi.date(),
		updatedAt: Joi.date(),
		deletedAt: Joi.date(),
	})},
	schemaModel: () => {return Joi.object().keys({
		id: Joi.number().min(1),
		name: Joi.string().min(4).max(64),
		description: Joi.string().min(5),
		created_at: Joi.date(),
		updated_at: Joi.date(),
		deleted_at: Joi.date(),
	})},
	relations: [
		{
			name: 'realms',
			attributes: () => {return RealmSchema.attributes},
			relations: () => {return RealmSchema.relations},
		},
		{
			name: 'users',
			attributes: () => {return UserSchema.attributes},
			relations: () => {return UserSchema.relations},
		},
	],

};

module.exports = RoleSchema;