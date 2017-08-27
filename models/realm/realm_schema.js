const Joi = require('joi');
const RoleSchema = require('../role/role_schema');
const UserSchema = require('../user/user_schema');

// REALMS
const RealmSchema = {
	name: 'realm',
	table: 'realms',
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
			name: 'roles',
			attributes: () => {return RoleSchema.attributes},
			relations: () => {return RoleSchema.relations},
		},
		{
			name: 'users',
			attributes: () => {return UserSchema.attributes},
			relations: () => {return UserSchema.relations},
		},
	],

};

module.exports = RealmSchema;