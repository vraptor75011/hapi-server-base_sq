const Joi = require('joi');
const ValidationBase = require('../../../validation_base');
const DB = require('../../../../config/sequelize');


const User = DB.User;


const filters = {
	id: Joi.alternatives().try(
		Joi.array().items(
			Joi.string().regex(ValidationBase.filterRegExp())
				.example('{<=}35'),
			Joi.number().integer().min(1)
				.example(35)
		).description('the user ID PK increment: [{=}]1 vs [{>}1,{<>}20,{<=}100]')
			.example(['{>}35', '{<}50']),
		Joi.string().regex(ValidationBase.filterRegExp())
			.example('{in}35,40'),
		Joi.number().integer().min(1)
			.example(40),
	),
	username: Joi.alternatives().try(
		Joi.array().items(
			Joi.string().min(3).regex(ValidationBase.filterRegExp())
				.example('{like}luigi.rossi'),
		).description('the username: name vs [{=}pippo1,{<>}pippo3,{like}pip]')
			.example(['{like}rossi', '{like}bianchi']),
		Joi.string().min(3).regex(ValidationBase.filterRegExp())
			.example('{<>}luigi.rossi,marco.tardelli-gobbo'),
	),
	email: Joi.alternatives().try(
		Joi.array().items(
			Joi.string().max(255).regex(ValidationBase.filterRegExp())
				.example('{=}luigi.rossi@eataly.it'),
			Joi.string().max(255)
				.example('{like}eataly.it'),
		).description('the user email: name vs [{=}pippo1@lol.it,{<>}pippo3@lol.it,{like}pip]')
			.example(['{like}rossi.it', '{like}verdi.it']),
		Joi.string().max(255).regex(ValidationBase.filterRegExp())
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
		Joi.string().max(255).regex(ValidationBase.filterRegExp())
			.example('{=}2017-08-17 10:00:00'),
	),
	updatedAt: Joi.alternatives().try(
		Joi.array().items(
			Joi.string().max(255).regex(ValidationBase.filterRegExp())
				.example('{=}2017-08-17 10:00:00'),
		).description('the creation date: [{=}]2017-08-15[ 09:00:00] vs [{btw}2017-08-17 09:00:00,2017-08-17 23:30:00]')
			.example(['{>=}2017-08-01', '{<}2017-09-01']),
		Joi.string().max(255).regex(ValidationBase.filterRegExp('date'))
			.example('2017-08-17 10:00:00'),
	),
	deletedAt: Joi.alternatives().try(
		Joi.array().items(
			Joi.string().max(255).regex(ValidationBase.filterRegExp())
				.example('{=}2017-08-17 10:00:00'),
		).description('the creation date: 2017-08-15 09:00:00 vs [{btw}2017-08-17 09:00:00,2017-08-17 23:30:00]')
			.example(['{>}2017-08-17 10:00:00', '{<}2017-08-31 10:00:00']),
		Joi.string().max(255).regex(ValidationBase.filterRegExp())
			.example('2017-08-17 10:00:00'),
	),
};

const pagination = {
	page: Joi.number().integer().min(1).description('page number')
		.default(1),
	pageSize: Joi.number().integer().min(5).max(100).description('rows per page')
		.default(10),
};

const sort = {
	sort: Joi.alternatives().try(
		Joi.string().max(255)
			.regex(ValidationBase.sortRegExp(User))
			.description('sort column: [{users}][+,-]id,[{users}][+,-]username vs [-id, -username]')
			.example('{users}-email'),
		Joi.array()
			.items(
				Joi.string().max(255)
					.regex(ValidationBase.sortRegExp(User))
					.example('-createdAt'))
			.example(['{users}-email','-username']),
	),
};

const extra = {
	count: Joi.boolean().description('only number of records found'),
	fields: Joi.alternatives().try(
		Joi.array().description('selected attributes: [{User}]id, [id, username, {User}email]')
			.items(
				Joi.string().max(255)
					.regex(ValidationBase.fieldRegExp(User)))
			.example(['{User}id','{User}username']),
		Joi.string().max(255)
			.regex(ValidationBase.fieldRegExp(User))
			.example('{User}id')
	),
	withRelated: Joi.alternatives().try(
		Joi.array().description('includes relationships: Roles, [Roles.Users, Realms]')
			.items(
				Joi.string().max(255)
					.regex(ValidationBase.withRelatedRegExp(User)))
			.example(['Realms','Roles']),
		Joi.string().max(255)
			.regex(ValidationBase.withRelatedRegExp(User))
			.example('Realms'),
	),
	withCount: Joi.alternatives().try(
		Joi.array().description('count relationships occurrences: Roles, [Roles.Users, Realms]')
			.items(
				Joi.string().max(255)
				.regex(ValidationBase.withRelatedRegExp(User)))
			.example(['Realms','Roles']),
		Joi.string().max(255).description('relationships: Roles, [Roles.Users, Realms]')
			.regex(ValidationBase.withRelatedRegExp(User))
			.example('Realms')
	),
	withFields: Joi.alternatives().try(
		Joi.array().description('selects relationships fields: {Roles}name, [{Realms}name,description]')
			.items(Joi.string().max(255)
				.regex(ValidationBase.withRelatedFieldRegExp(User)))
			.example(['{Realms}name','{Roles}id']),
		Joi.string().max(255)
			.regex(ValidationBase.withRelatedFieldRegExp(User))
			.example('{Realms.Roles}name,description'),
	),
	withSort: Joi.alternatives().try(
		Joi.array().description('sort related field: {Realms}[+,-]id vs [-id, -name]')
			.items(Joi.string().max(255)
				.regex(ValidationBase.withSortRegExp(User)))
			.example(['{Roles}+name','{Roles.Users}-username']),
		Joi.string().max(255)
			.regex(ValidationBase.withSortRegExp(User))
			.example('{Realms}description')
	),
	withFilter: Joi.alternatives().try(
		Joi.array().description('filter by relationships fields: {Roles}[{or|not}]{name}[{=}], [{Realms}{not}{name}{like}]')
			.items(Joi.string().max(255)
				.regex(ValidationBase.withFilterRegExp(User)))
			.example(['{Roles}{id}{=}3','{Realms}{name}{like}App']),
		Joi.string().max(255)
			.regex(ValidationBase.withFilterRegExp(User))
			.example('{Roles.Users}{not}{username}{null}')
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