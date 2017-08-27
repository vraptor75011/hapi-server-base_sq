const Joi = require('joi');
const RoleSchema = require('../role/role_schema');
const RealmSchema = require('../realm/realm_schema');
const RealmsRolesUsersSchema = require('../realms_roles_users/realms_roles_users_schema');

const usrString = "^([a-zA-Z0-9]+[_.-]?)*[a-zA-Z0-9]$";                   // alt(a-zA-Z0-9||_.-) always ends with a-zA-Z0-9 no max length
const pwdString = "^[a-zA-Z0-9àèéìòù\.\,\;\:\-\_\|@&%$]{3,}$";
const usrRegExp = new RegExp(usrString);
const pwdRegExp = new RegExp(pwdString);

const UserSchema = {
	name: 'user',
	table: 'users',
	attributes: [
		{
			name: 'id',
			type: 'integer',
		},
		{
			name: 'username',
			type: 'string',
		},
		{
			name: 'password',
			type: 'string'
		},
		{
			name: 'email',
			type: 'string',
		},
		{
			name: 'isActive',
			type: 'boolean',
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
		username: Joi.string().min(1).max(64).regex(usrRegExp),
		email: Joi.string(),
		is_active: Joi.boolean().valid(true, false),
		created_at: Joi.date(),
		updated_at: Joi.date(),
		deleted_at: Joi.date(),
	})},
	schemaPayload: () => {return Joi.object().keys({
		id: Joi.number().min(1),
		username: Joi.string().min(3).max(64).regex(usrRegExp).required(),
		password: Joi.string().min(3).max(64).regex(pwdRegExp).required(),
		email: Joi.string().email().required(),
		isActive: Joi.boolean().valid(true, false).required(),
		createdAt: Joi.date(),
		updatedAt: Joi.date(),
		deletedAt: Joi.date(),
	})},
	schemaModel: Joi.object().keys({
		id: Joi.number().min(1),
		username: Joi.string().min(3).max(64).required(),
		password: Joi.string().min(3).max(64).required(),
		email: Joi.string().email().required(),
		is_active: Joi.boolean().valid(true, false).required(),
		created_at: Joi.date(),
		updated_at: Joi.date(),
		deleted_at: Joi.date(),
	}),
	relations: [
		{
			name: 'realmsRolesUsers',
			modelSchema: () => {return RealmsRolesUsersSchema},
			attributes: () => {return RealmsRolesUsersSchema.attributes},
			relations: () => {return RealmsRolesUsersSchema.relations},
			schemaQuery: () => {return RealmsRolesUsersSchema.schemaQuery()},
		},
	],

};

module.exports = UserSchema;