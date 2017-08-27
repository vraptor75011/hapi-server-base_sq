const Joi = require('joi');
const UserSchema = require('../user/user_schema');
const RealmSchema = require('../realm/realm_schema');
const RoleSchema = require('../role/role_schema');

// ROLE SCHEMA
const RealmsRolesUsersSchema = {
	name: 'realmsRolesUsers',
	table: 'realms_roles_users',
	attributes: [
		{
			name: 'id',
			type: 'integer',
		},
		{
			name: 'realmId',
			type: 'integer',
		},
		{
			name: 'roleId',
			type: 'integer',
		},
		{
			name: 'userId',
			type: 'integer',
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
		realm_id: Joi.number().min(1),
		role_id: Joi.number().min(1),
		user_id: Joi.number().min(1),
		created_at: Joi.date(),
		updated_at: Joi.date(),
		deleted_at: Joi.date(),
	})},
	schemaPayload: () => {return Joi.object().keys({
		id: Joi.number().min(1),
		realm_id: Joi.number().min(1),
		role_id: Joi.number().min(1),
		user_id: Joi.number().min(1),
		created_at: Joi.date(),
		updated_at: Joi.date(),
		deleted_at: Joi.date(),
	})},
	schemaModel: () => {return Joi.object().keys({
		id: Joi.number().min(1),
		realm_id: Joi.number().min(1),
		role_id: Joi.number().min(1),
		user_id: Joi.number().min(1),
		created_at: Joi.date(),
		updated_at: Joi.date(),
		deleted_at: Joi.date(),
	})},
	relations: [
		{
			name: 'realm',
			attributes: () => {return RealmSchema.attributes},
			relations: () => {return RealmSchema.relations},
		},
		{
			name: 'role',
			attributes: () => {return RoleSchema.attributes},
			relations: () => {return RoleSchema.relations},
		},
		{
			name: 'user',
			attributes: () => {return UserSchema.attributes},
			relations: () => {return UserSchema.relations},
		},
	],

};

module.exports = RealmsRolesUsersSchema;