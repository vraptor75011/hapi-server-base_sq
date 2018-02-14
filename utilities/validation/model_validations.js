const Joi = require('joi');
const ValidationHelper = require('./validation_helper');
const SchemaHelper = require('../schema/schema_helper');
const Sequelize = require('sequelize');
const _ = require('lodash');

/**
 * Returns the filters JOI validation for query URL
 * @param model: The model with the attributes to build query URL validation.
 * @returns {object} A Joi schema object for all model attributes.
 */
let getFilters = (model) => {
	let filtersSchema = {};
	Object.keys(model.attributes).map((attr) => {
		let attribute = model.attributes[attr];
		let schema = {};
		let joiArray = [];
		let type = attribute.type.key;
		let date = Sequelize.DATE().key;

		if (attribute.query) {
			Object.keys(attribute.query).map((el) => {
				let element = attribute.query[el];
				joiArray.push(joiCompile(el, element, model));

			});

			if (joiArray.length > 1) {
				schema = Joi.alternatives().try(joiArray);
			} else {
				schema = joiArray[0];
			}

			filtersSchema[attr] = schema;
		} else if (!attribute.exclude && type === date) {
			schema = Joi.alternatives().try(
				Joi.array().description('the date: 2017-08-15 09:00:00] vs [{or}{btw}2017-08-17 09:00:00,2017-08-17 23:30:00, {or}{btw}2017-12-25 09:00:00,2018-01-06 23:30:00]')
					.items(Joi.string().max(255)
						.regex(ValidationHelper.filterRegExp('date')))
					.example(['{>=}2017-08-01', '{<}2017-09-01']),
				Joi.string().max(255).regex(ValidationHelper.filterRegExp())
					.example('{=}2017-08-17 10:00:00'),
			);
			filtersSchema[attr] = schema;
		}

	});

	return filtersSchema;
};


/**
 * Returns the single element Joi schema. More element for one attributes. Recursively!
 * @param key: Property key to build Joi schema
 * @param element: The relative key object with the Joi validation
 * @param model: The model with the attributes to build query URL validation.
 * @returns {object} A Joi schema object for all model attributes.
 */
let joiCompile = (key, element, model) => {
	let element01 = element;

	if (key === 'array') {
		let schema = Joi.array();
		Object.keys(element01).map((key) => {
			let element02 = element01[key];
			if (key === 'items') {
				Object.keys(element02).map((key) => {
					schema = schema.items(joiCompile(key, element02[key], model));
				});
			}

			if (key === 'description') {
				schema = addJoiAnyDescription(schema, element02);
			}

			if (key === 'example') {
				schema = addJoiAnyExample(schema, element02);
			}
		});

		return schema;
	}

	if (key === 'string') {
		let schema = Joi.string();

		Object.keys(element01).map((key) => {
			let element02 = element01[key];

			if (key === 'regex') {
				let test = ValidationHelper.filterRegExp(model);
				schema = schema.regex(test);
			}

			if (key === 'description') {
				schema = addJoiAnyDescription(schema, element02);
			}

			if (key === 'example') {
				schema = addJoiAnyExample(schema, element02);
			}

			if (key === 'min') {
				schema = addJoiAnyMin(schema, element02);
			}

			if (key === 'max') {
				schema = addJoiAnyMax(schema, element02);
			}
		});

		return schema;
	}

	if (key === 'integer') {
		let schema = Joi.number().integer();

		Object.keys(element01).map((key) => {
			let element02 = element01[key];

			if (key === 'min') {
				schema = addJoiAnyMin(schema, element02);
			}

			if (key === 'max') {
				schema = addJoiAnyMax(schema, element02);
			}

			if (key === 'description') {
				schema = addJoiAnyDescription(schema, element02);
			}

			if (key === 'example') {
				schema = addJoiAnyExample(schema, element02);
			}
		});

		return schema;
	}

	if (key === 'any') {
		let schema = Joi.any();

		Object.keys(element01).map((key) => {
			let element02 = element01[key];

			if (key === 'forbidden') {
				schema = addJoiAnyForbidden(schema, element02);
			}

		});

		return schema;
	}

	if (key === 'boolean') {
		let schema = Joi.boolean();

		Object.keys(element01).map((key) => {
			let element02 = element01[key];

			if (key === 'valid') {
				schema = addJoiAnyValid(schema, element02);
			}

		});

		return schema;
	}
};

let addJoiAnyDescription = (schema, description) => {
	if (!_.isEmpty(description)) {
		return schema.description(description);
	}
};

let addJoiAnyExample = (schema, example) => {
		return schema.example(example);
};

let addJoiAnyForbidden = (schema) => {
	return schema.forbidden();
};

let addJoiAnyMax = (schema, max) => {
	return schema.max(max);
};

let addJoiAnyMin = (schema, min) => {
		return schema.min(min);
};

let addJoiAnyValid = (schema, value) => {
	return schema.valid(value);
};


module.exports = function(model) {
	const FLRelations = SchemaHelper.relationsFromSchema(model, 1, 1);
	const SLRelations = SchemaHelper.relationsFromSchema(model, 2, 2);
	const ALLRelations = SchemaHelper.relationsFromSchema(model, 1, 2);
	const RelationsArray = SchemaHelper.relationFromSchema(model, 2);
	const Attributes = SchemaHelper.createAttributesList(model);
	const AllAttributes = SchemaHelper.createAllAttributesList(model);
	const Attributes4Select = SchemaHelper.createAttributesList4Select(model);

	const filters = getFilters(model);

	const ids = {
		ids: Joi.array().min(1).required()
			.items(
				Joi.number().integer().min(1)),
	};

	const pagination = {
		$page: Joi.number().integer().min(1).description('page number')
			.default(1),
		$pageSize: Joi.number().integer().min(1).max(100).description('rows per page')
			.default(10),
	};

	const sort = {
		$sort: Joi.alternatives().try(
			Joi.array().description('sort column: [{model}][+,-]id,[{model}][+,-]username vs [-id, -username]')
				.items(
					Joi.string().max(255)
						.regex(ValidationHelper.sortRegExp(model))
						.example('-createdAt'))
				.example(['{model}-email','-username']),
			Joi.string().max(255)
				.regex(ValidationHelper.sortRegExp(model))
				.example('{model}-email'),
		),
	};

	const math = {
		$min:
			Joi.string().description('selected attribute MIN: {model}id vs updatedAt]').max(255)
				.regex(ValidationHelper.mathFieldRegExp(model))
				.example('{model}id'),
		$max:
			Joi.string().description('selected attribute MAX: {model}id vs updatedAt]').max(255)
				.regex(ValidationHelper.mathFieldRegExp(model))
				.example('{model}id'),
		$sum:
			Joi.string().description('selected attribute SUM: {model}id vs updatedAt]').max(255)
				.regex(ValidationHelper.mathFieldRegExp(model))
				.example('{model}id'),
	};

	const softDeleted = {
		$withDeleted: Joi.boolean().description('includes soft deleted record').default(false),
	};

	const hardDelete = {
		$hardDelete: Joi.boolean().description('includes soft deleted record').default(false),
	};

	const excludedFields = {
		$withExcludedFields: Joi.boolean().description('includes excluded attributes').default(false),
	};

	const count = {
		$count: Joi.boolean().description('only number of records found'),
	};

	const fullTextSearch = {
		$fullTextSearch:
			Joi.string().description('search text in ALL string attributes')
				.max(255)
				.regex(ValidationHelper.fullTextSearchRegExp())
				.example('qulsiasi cosa')
	};

	const fields = {
		$fields: Joi.alternatives().try(
			Joi.array().description('selected attributes: {model}id, [id, username, {model}email]')
				.items(
					Joi.string().max(255)
						.regex(ValidationHelper.fieldRegExp(model)))
				.example(['{model}id','{model}username']),
			Joi.string().max(255)
				.regex(ValidationHelper.fieldRegExp(model))
				.example('{model}id')
		),
	};

	const fields4Select = {
		$fields4Select: Joi.alternatives().try(
			Joi.array().description('selected attributes: [{model}id, [id, username, {model}email]')
				.default(ValidationHelper.fieldDefault4Select(model))
				.items(
					Joi.string().max(255)
						.regex(ValidationHelper.field4SelectRegExp(model)))
				.example(['{model}id','{model}username']),
			Joi.string().max(255)
				.default(ValidationHelper.fieldDefault4Select(model)[0] + ',' + ValidationHelper.fieldDefault4Select(model)[1])
				.regex(ValidationHelper.field4SelectRegExp(model))
				.example('{model}id')
		),
	};

	const withRelated = {
		$withRelated: Joi.alternatives().try(
			Joi.array().description('includes relationships: model, [model.models, models]')
				.items(
					Joi.string().max(255)
						.regex(ValidationHelper.withRelatedRegExp(model)))
				.example(['model','models']),
			Joi.string().max(255)
				.regex(ValidationHelper.withRelatedRegExp(model))
				.example('models'),
		),
	};

	const withRelExcludedFields = {
		$withRelExcludedFields: Joi.boolean().description('includes excluded related attributes').default(false),
	};

	const withRelFields = {
		$withFields: Joi.alternatives().try(
			Joi.array().description('selects relationships fields: {model}name, [{models}name,description]')
				.items(Joi.string().max(255)
					.regex(ValidationHelper.withRelatedFieldRegExp(model)))
				.example(['{models}name','{model}id']),
			Joi.string().max(255)
				.regex(ValidationHelper.withRelatedFieldRegExp(model))
				.example('{models.model}name,description'),
		),
	};

	const withRelFilters = {
		$withFilter: Joi.alternatives().try(
			Joi.array().description('filter by relationships fields: {model}[{or|not}]{name}[{=}], [{model}{not}{name}{like}]')
				.items(Joi.string().max(255)
					.regex(ValidationHelper.withFilterRegExp(model)))
				.example(['{model}{id}{=}3', '{models}{name}{like}App']),
			Joi.string().max(255)
				.regex(ValidationHelper.withFilterRegExp(model))
				.example('{model.models}{not}{username}{null}')
		),
	};

	const withRelCount = {
		$withCount: Joi.alternatives().try(
			Joi.array().description('count relationships occurrences: model, [model, models]')
				.items(
					Joi.string().max(255)
						.regex(ValidationHelper.withCountRegExp(model)))
				.example(['models','model']),
			Joi.string().max(255).description('relationships: model, [model.models, models]')
				.regex(ValidationHelper.withCountRegExp(model))
				.example('models')
		),
	};

	const withRelSort = {
		$withSort: Joi.alternatives().try(
			Joi.array().description('sort related field: {Realms}[+,-]id vs [-id, -name]')
				.items(Joi.string().max(255)
					.regex(ValidationHelper.withSortRegExp(model)))
				.example(['{model}+name','{model.models}-username']),
			Joi.string().max(255)
				.regex(ValidationHelper.withSortRegExp(model))
				.example('{model}description')
		),
	};

	const modelValidations = {
		filters,
		ids,
		pagination,
		sort,
		math,
		fullTextSearch,
		softDeleted,
		hardDelete,
		excludedFields,
		count,
		fields,
		fields4Select,
		withRelated,
		withRelExcludedFields,
		withRelFields,
		withRelFilters,
		withRelCount,
		withRelSort,

		FLRelations,
		SLRelations,
		ALLRelations,
		RelationsArray,
		Attributes,
		AllAttributes,
		Attributes4Select,
	};

	return modelValidations;
};
