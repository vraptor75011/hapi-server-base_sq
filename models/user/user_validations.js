const Joi = require('joi');
const ValidationBase = require('../validation_base');
const UserSchema = require('./user_schema');

let forString = ValidationBase.filterRegExp('string');


const filters = {
	id: Joi.alternatives().try(
		Joi.array().items(
			Joi.string().regex(ValidationBase.filterRegExp('integer'))
				.example('{<=}35'),
			Joi.number().integer().min(1)
				.example(35)
		).description('the user ID PK increment: [{=}]1 vs [{>}1,{<>}20,{<=}100]')
			.example(['{>}35', '{<}50']),
		Joi.string().regex(ValidationBase.filterRegExp('integer'))
			.example('{in}35,40'),
		Joi.number().integer().min(1)
			.example(40),
	),
	username: Joi.alternatives().try(
		Joi.array().items(
			Joi.string().min(3).regex(ValidationBase.filterRegExp('string'))
				.example('{like}luigi.rossi'),
		).description('the username: name vs [{=}pippo1,{<>}pippo3,{like}pip]')
			.example(['{like}rossi', '{like}bianchi']),
		Joi.string().min(3).regex(ValidationBase.filterRegExp('string'))
			.example('{<>}luigi.rossi,marco.tardelli-gobbo'),
	),
	email: Joi.alternatives().try(
		Joi.array().items(
			Joi.string().max(255).regex(ValidationBase.filterRegExp('string'))
				.example('{=}luigi.rossi@eataly.it'),
			Joi.string().max(255)
				.example('{like}eataly.it'),
		).description('the user email: name vs [{=}pippo1@lol.it,{<>}pippo3@lol.it,{like}pip]')
			.example(['{like}rossi.it', '{like}verdi.it']),
		Joi.string().max(255).regex(ValidationBase.filterRegExp('string'))
			.example('{<>}luigi.rossi@eataly.it'),
		Joi.string().email(),
	),
	isActive: Joi.alternatives().try(
		Joi.array().description('the user active: true, [true, false]')
			.items(Joi.boolean().valid(true, false)),
		Joi.boolean().description('the user active: true, [true, false]').valid(true, false)),
	createdAt: Joi.alternatives().try(
		Joi.array().description('the creation date: 2017-08-15[ 09:00:00] vs [{btw}2017-08-17 09:00:00,2017-08-17 23:30:00]')
			.items(Joi.string().max(255)
				.regex(ValidationBase.filterRegExp('date')))
			.example(['{>=}2017-08-01', '{<}2017-09-01']),
		Joi.string().max(255).regex(ValidationBase.filterRegExp('date'))
			.example('{=}2017-08-17 10:00:00'),
	),
	updatedAt: Joi.alternatives().try(
		Joi.array().items(
			Joi.string().max(255).regex(ValidationBase.filterRegExp('date'))
				.example('{=}2017-08-17 10:00:00'),
		).description('the creation date: [{=}]2017-08-15[ 09:00:00] vs [{btw}2017-08-17 09:00:00,2017-08-17 23:30:00]')
			.example(['{>=}2017-08-01', '{<}2017-09-01']),
		Joi.string().max(255).regex(ValidationBase.filterRegExp('date'))
			.example('2017-08-17 10:00:00'),
	),
	deletedAt: Joi.alternatives().try(
		Joi.array().items(
			Joi.string().max(255).regex(ValidationBase.filterRegExp('date'))
				.example('{=}2017-08-17 10:00:00'),
		).description('the creation date: 2017-08-15 09:00:00 vs [{btw}2017-08-17 09:00:00,2017-08-17 23:30:00]')
			.example(['{>}2017-08-17 10:00:00', '{<}2017-08-31 10:00:00']),
		Joi.string().max(255).regex(ValidationBase.filterRegExp('date'))
			.example('2017-08-17 10:00:00'),
	),
};

const pagination = {
	page: Joi.number().integer().min(1).description('page number')
		.default(1),
	pageSize: Joi.number().integer().min(5).max(100).description('rows per page')
		.default(10),
	offset: Joi.number().integer().min(0).description('(page number - 1) * pageSize'),
	limit: Joi.number().integer().min(5).max(100).description('pageSize'),
};

const sort = {
	sort: Joi.alternatives().try(
		Joi.array()
			.items(Joi.string().max(255)
				.regex(ValidationBase.sortRegExp(UserSchema))
				.example('-createdAt')
			).description('sort column: [{user}][+,-]id vs [-id, -username]')
			.example(['{user}-email','-username']),
		Joi.string().max(255)
			.regex(ValidationBase.sortRegExp(UserSchema))
			.example('{user}-email'),
	),
};

const extra = {
	count: Joi.boolean().description('only number of records found'),
	fields: Joi.alternatives().try(
		Joi.array().description('selected attributes: [{user}]id, [id, username, {user}email]')
			.items(Joi.string().max(255).regex(ValidationBase.fieldRegExp(UserSchema))),
		Joi.string().max(255)
			.regex(ValidationBase.fieldRegExp(UserSchema))
	),
	withRelated: Joi.alternatives().try(
		Joi.array().description('includes relationships: roles, [roles, realms]')
			.items(Joi.string().max(255)
				.regex(ValidationBase.withRelatedRegExp(UserSchema)))
			.example(['realmsRolesUsers','realmsRolesUsers.role']),
		Joi.string().max(255).description('relationships: roles, [roles, realms]')
			.regex(ValidationBase.withRelatedRegExp(UserSchema))
			.example('realmsRolesUsers.role')
	),
	withCount: Joi.alternatives().try(
		Joi.array().description('count relationships occurrences: roles, [roles, realms]')
			.items(Joi.string().max(255)
				.regex(ValidationBase.withRelatedRegExp(UserSchema)))
			.example(['realmsRolesUsers','realmsRolesUsers.role']),
		Joi.string().max(255).description('relationships: roles, [roles, realms]')
			.regex(ValidationBase.withRelatedRegExp(UserSchema))
			.example('realmsRolesUsers.role')
	),
	withFields: Joi.alternatives().try(
		Joi.array().description('selects relationships fields: {roles}name, [{realms}name,description]')
			.items(Joi.string().max(255)
				.regex(ValidationBase.withRelatedFieldRegExp(UserSchema)))
			.example(['{realmsRolesUsers}roleId','{realmsRolesUsers}userId']),
		Joi.string().max(255)
			.regex(ValidationBase.withRelatedFieldRegExp(UserSchema))
	),
	withSort: Joi.alternatives().try(
		Joi.array().description('sort related field: {realms}[+,-]id vs [-id, -name]')
			.items(Joi.string().max(255)
				.regex(ValidationBase.withSortRegExp(UserSchema)))
			.example(['{realmsRolesUsers}+roleId','{realmsRolesUsers}-userId']),
		Joi.string().max(255)
			.regex(ValidationBase.withSortRegExp(UserSchema))
			.example('{realmsRolesUsers}realmId')
	),
	withFilter: Joi.alternatives().try(
		Joi.array().description('filter by relationships fields: {roles}[{or|not}]{name}[{=}], [{realms}{not}{name}{like}]')
			.items(Joi.string().max(255)
				.regex(ValidationBase.withFilterRegExp(UserSchema)))
			.example(['{realmsRolesUsers}{roleId}{=}3','{realmsRolesUsers}{userId}{=}1']),
		Joi.string().max(255)
			.regex(ValidationBase.withFilterRegExp(UserSchema))
			.example('{realmsRolesUsers}{not}{userId}{null}')
	),
};



const UserValidations = {
	filters: filters,
	pagination: pagination,
	sort: sort,
	extra: extra,
	query: Joi.object().keys(Object.assign({}, filters, pagination, sort, extra)),

};


module.exports = UserValidations;