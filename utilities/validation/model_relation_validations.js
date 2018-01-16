const Joi = require('joi');
const Sequelize = require('sequelize');
const _ = require('lodash');
const ValidationHelper = require('./validation_helper');

/**
 * Returns the filters JOI validation for query URL
 * @param model: The model with the attributes to build query URL validation.
 * @param recursive: Flag, true to call child relation.
 * @param PK: Flag, to insert the Primary Key in Validation.
 * @param exceptionModel: Model do not insert in validation.
 * @param foreignKey: In Child Model skip foreign key.
 * @returns {object} A Joi schema object for all model attributes.
 */
let getRelObject = (model, recursive, PK, exceptionModel, foreignKey) => {
	let relationSchema = {};
	Object.keys(model.associations).map((rel) => {
		let relation = model.associations[rel];
		let targetModel = relation.target;
		foreignKey = foreignKey || relation.foreignKey;
		let schema = {};

		if (exceptionModel !== targetModel.name) {
			let modelName = targetModel.name;
			let modelFileName = _.snakeCase(modelName);
			let file = '../../api/' + modelFileName + '/url_validation/' + modelFileName + '_validation_base';
			let modelValidation = require(file);
			let schema1L = Joi.object().keys(modelValidation.putPayloadObj);
			let subSchema1L = {};
			let cleanSchema1L = {};

			Object.keys(targetModel.attributes).map((attr) => {
				if ((PK && attr === 'id') || (attr !== 'id' && attr !== foreignKey)) {
					if (Joi.reach(schema1L, attr) !== undefined) {
						cleanSchema1L[attr] = Joi.reach(schema1L, attr)
					}
				}
			});

			if (recursive) {
				let temp = getRelObject(targetModel, false, PK, exceptionModel, foreignKey);
				subSchema1L = Joi.object().keys(_.assign({}, cleanSchema1L, temp));
			} else {
				subSchema1L = Joi.object().keys(cleanSchema1L);
			}

			if (relation.associationType === 'HasMany' || relation.associationType === 'BelongsToMany') {
				schema = Joi.alternatives().try(
					Joi.array().min(1).items(
						subSchema1L),
					subSchema1L,
					Joi.object().allow(null),
				);
			} else {
				schema = Joi.alternatives().try(
					subSchema1L,
					Joi.object().allow(null),
				);
			}

			relationSchema[relation.as] = schema;
		}

	});

	return relationSchema;
};

/**
 * Returns the filters JOI validation for query URL
 * @param model: The model with the attributes to build query URL validation.
 * @returns {object} An array of model relations for ADD and REMOVE Many.
 */
let getRelList = (model) => {
	let relationList = [];
	Object.keys(model.associations).map((rel) => {
		// let relation = model.associations[rel];
		// if (relation.associationType === 'HasMany' || relation.associationType === 'BelongsToMany') {
		// 	relationList.push(rel);
		// }
		relationList.push(rel);

	});

	return relationList.sort();
};

/**
 * Returns the filters JOI validation for query URL
 * @param model: The model with the attributes to build query URL validation.
 * @returns {object} A Joi schema object for all model attributes.
 */
let getFilters = (model) => {
	let filtersSchema = {};
	Object.keys(model.associations).map((rel) => {
		let relation = model.associations[rel];
		let targetModel = relation.target;
		if (relation.associationType !== 'BelongsTo' && relation.associationType !== 'HasOne') {
			Object.keys(targetModel.attributes).map((attr) => {
				let attribute = targetModel.attributes[attr];
				let schema = {};
				let joiArray = [];
				let type = attribute.type.key;
				let date = Sequelize.DATE().key;

				if (attribute.query && !attribute.exclude) {
					Object.keys(attribute.query).map((el) => {
						let element = attribute.query[el];
						joiArray.push(joiCompile(el, element, model));

					});

					if (joiArray.length > 1) {
						schema = Joi.alternatives().try(joiArray);
					} else {
						schema = joiArray[0];
					}

					filtersSchema[rel + '.' + attr] = schema;
				} else if (!attribute.exclude && type === date) {
					schema = Joi.alternatives().try(
						Joi.array().description('the date: 2017-08-15 09:00:00] vs [{or}{btw}2017-08-17 09:00:00,2017-08-17 23:30:00, {or}{btw}2017-12-25 09:00:00,2018-01-06 23:30:00]')
							.items(Joi.string().max(255)
								.regex(ValidationHelper.filterRegExp('date')))
							.example(['{>=}2017-08-01', '{<}2017-09-01']),
						Joi.string().max(255).regex(ValidationHelper.filterRegExp())
							.example('{=}2017-08-17 10:00:00'),
					);
					filtersSchema[rel + '.' + attr] = schema;
				}

			});
		}
	});

	return filtersSchema;
};

/**
 * Returns the pagination JOI validation for query URL
 * @param model: The model with the attributes to build query URL validation.
 * @returns {object} A Joi schema object for all model attributes.
 */
let getPagination = (model) => {
	let paginationSchema = {};
	Object.keys(model.associations).map((rel) => {
		let relation = model.associations[rel];
		if (relation.associationType !== 'BelongsTo' && relation.associationType !== 'HasOne') {
			paginationSchema[rel + '.$page'] = Joi.number().integer().min(1).description('page number')
				.default(1);
			paginationSchema[rel + '.$pageSize'] = Joi.number().integer().min(1).max(100).description('rows per page')
				.default(10);
		}

	});

	return paginationSchema;
};

/**
 * Returns the sort JOI validation for query URL
 * @param model: The model with the attributes to build query URL validation.
 * @returns {object} A Joi schema object for all model attributes.
 */
let getSort = (model) => {
	let sortSchema = {};
	Object.keys(model.associations).map((rel) => {
		let relation = model.associations[rel];
		if (relation.associationType !== 'BelongsTo' && relation.associationType !== 'HasOne') {
			let targetModel = relation.target;
			let attributes = Object.values(targetModel.attributes);
			let attr0 = attributes[0].field;
			let attr1 = attributes[1] ? attributes[1].field : attributes[0].field;
			let attr2 = attributes[2] ? attributes[2].field : attributes[1] ? attributes[1].field : attributes[0].field;

			sortSchema[rel + '.$sort'] = Joi.alternatives().try(
				Joi.array().description('sort column: [{' + rel + '}][+,-]' + attr0 + ',[{' + rel + '}][+,-]' + attr1 + ' vs [-' + attr1 + ', -' + attr2 + ']')
					.items(
						Joi.string().max(255)
							.regex(ValidationHelper.sortRegExp(targetModel))
							.example('-createdAt'))
					.example(['{' + rel + '}-' + attr1,'-' + attr2]),
				Joi.string().max(255)
					.regex(ValidationHelper.sortRegExp(targetModel))
					.example('{' + rel + '}-' + attr1),
			);
		}

	});

	return sortSchema;
};

/**
 * Returns the math JOI validation for query URL
 * @param model: The model with the attributes to build query URL validation.
 * @returns {object} A Joi schema object for all model attributes.
 */
let getMath = (model) => {
	let mathSchema = {};
	Object.keys(model.associations).map((rel) => {
		let relation = model.associations[rel];
		let targetModel = relation.target;
		if (relation.associationType !== 'BelongsTo' && relation.associationType !== 'HasOne') {
			mathSchema[rel + '.$min'] = Joi.string().description('selected attribute MIN: {' + rel + '}id vs updatedAt]').max(255)
				.regex(ValidationHelper.mathFieldRegExp(targetModel))
				.example('{' + rel + '}id');
			mathSchema[rel + '.$max'] =	Joi.string().description('selected attribute MAX: {' + rel + '}id vs createdAt]').max(255)
				.regex(ValidationHelper.mathFieldRegExp(targetModel))
				.example('{model}id');
			mathSchema[rel + '.$sum'] =	Joi.string().description('selected attribute SUM: {' + rel + '}id vs updatedAt]').max(255)
				.regex(ValidationHelper.mathFieldRegExp(targetModel))
				.example('{model}id');

		}
	});

	return mathSchema;
};

/**
 * Returns the softDeleted JOI validation for query URL
 * @param model: The model with the attributes to build query URL validation.
 * @returns {object} A Joi schema object for all model attributes.
 */
let getSoftDeleted = (model) => {
	let softDeletedSchema = {};
	Object.keys(model.associations).map((rel) => {
		softDeletedSchema[rel + '.$withDeleted'] = Joi.boolean().description('includes soft deleted record').default(false);
	});

	return softDeletedSchema;
};

/**
 * Returns the hardDeleted JOI validation for query URL
 * @param model: The model with the attributes to build query URL validation.
 * @returns {object} A Joi schema object for all model attributes.
 */
let getHardDeleted = (model) => {
	let hardDeletedSchema = {};
	Object.keys(model.associations).map((rel) => {

		hardDeletedSchema[rel + '.$hardDeleted'] = Joi.boolean().description('destroy record from DB').default(false);

	});

	return hardDeletedSchema;
};

/**
 * Returns the excludedFields JOI validation for query URL
 * @param model: The model with the attributes to build query URL validation.
 * @returns {object} A Joi schema object for all model attributes.
 */
let getExcludedFields = (model) => {
	let excludedFieldsSchema = {};
	Object.keys(model.associations).map((rel) => {
		excludedFieldsSchema[rel + '.$withExcludedFields'] = Joi.boolean().description('includes excluded fields in query').default(false);
	});

	return excludedFieldsSchema;
};

/**
 * Returns the count JOI validation for query URL
 * @param model: The model with the attributes to build query URL validation.
 * @returns {object} A Joi schema object for all model attributes.
 */
let getCount = (model) => {
	let countSchema = {};
	Object.keys(model.associations).map((rel) => {
		let relation = model.associations[rel];
		if (relation.associationType !== 'BelongsTo' && relation.associationType !== 'HasOne') {
			countSchema[rel + '.$count'] = Joi.boolean().description('count model occurrences fields').default(false);
		}
	});

	return countSchema;
};

/**
 * Returns the Fields JOI validation for query URL
 * @param model: The model with the attributes to build query URL validation.
 * @returns {object} A Joi schema object for all model attributes.
 */
let getFields = (model) => {
	let fieldsSchema = {};
	Object.keys(model.associations).map((rel) => {
		let relation = model.associations[rel];
		let targetModel = relation.target;
		let attributes = Object.values(targetModel.attributes);
		let attr0 = attributes[0].field;
		let attr1 = attributes[1] ? attributes[1].field : attributes[0].field;
		let attr2 = attributes[2] ? attributes[2].field : attributes[1] ? attributes[1].field : attributes[0].field;


		fieldsSchema[rel + '.$fields'] = Joi.alternatives().try(
			Joi.array().description('selected attributes: [{' + rel + '}' + attr0 + ', [' + attr0 + ', ' + attr1 + ', {' + rel + '}' + attr2 + ']')
				.items(
					Joi.string().max(255)
						.regex(ValidationHelper.fieldRegExp(targetModel)))
				.example(['{' + rel + '}' + attr0, '{' + rel + '}' + attr1]),
			Joi.string().max(255)
				.regex(ValidationHelper.fieldRegExp(targetModel))
				.example('{' + rel + '}' + attr0)
		);
	});

	return fieldsSchema;
};

/**
 * Returns the Related JOI validation for query URL
 * @param model: The model with the attributes to build query URL validation.
 * @returns {object} A Joi schema object for all model attributes.
 */
let getRelated = (model) => {
	let relatedSchema = {};
	Object.keys(model.associations).map((rel) => {
		let relation = model.associations[rel];
		let targetModel = relation.target;
		let associations = Object.values(targetModel.associations);
		let ass0 = associations[0].as;
		let ass1 = associations[1] ? associations[1].as : associations[0].as;
		let ass2 = associations[2] ? associations[2].as : associations[1] ? associations[1].as : associations[0].as;


		relatedSchema[rel + '.$withRelated'] = Joi.alternatives().try(
			Joi.array().description('includes relationships: ' + ass0 + ', [' + ass1 + ', ' + ass2 + ']')
				.items(
					Joi.string().max(255)
						.regex(ValidationHelper.withRelatedRegExp(targetModel)))
				.example(['Realms','Roles']),
			Joi.string().max(255)
				.regex(ValidationHelper.withRelatedRegExp(targetModel))
				.example('Realms'),
		);
		relatedSchema[rel + '.$withFields'] = Joi.alternatives().try(
			Joi.array().description('selects relationships fields: {Roles}name, [{Realms}name,description]')
				.items(Joi.string().max(255)
					.regex(ValidationHelper.withRelatedFieldRegExp(targetModel)))
				.example(['{Realms}name','{Roles}id']),
			Joi.string().max(255)
				.regex(ValidationHelper.withRelatedFieldRegExp(targetModel))
				.example('{Realms.Roles}name,description'),
		);

	});

	return relatedSchema;
};

/**
 * Returns the Related JOI validation for query URL
 * @param model: The model with the attributes to build query URL validation.
 * @returns {object} A Joi schema object for all model attributes.
 */
let getExtra = (model) => {
	let extraSchema = {};
	Object.keys(model.associations).map((rel) => {
		let relation = model.associations[rel];

		if (relation.associationType !== 'BelongsTo' && relation.associationType !== 'HasOne') {
			let targetModel = relation.target;
			let associations = Object.values(targetModel.associations);
			let ass0 = associations[0].as;
			let ass1 = associations[1] ? associations[1].as : associations[0].as;
			let ass2 = associations[2] ? associations[2].as : associations[1] ? associations[1].as : associations[0].as;

			extraSchema[rel + '.$withFilter'] = Joi.alternatives().try(
				Joi.array().description('filter by relationships fields: {' + ass0 + '}[{or|not}]{name}[{=}], [{'+ ass1 + '}{not}{name}{like}]')
					.items(Joi.string().max(255)
						.regex(ValidationHelper.withFilterRegExp(model)))
					.example(['{'+ ass1 + '}{id}{=}3','{'+ ass2 + '}{name}{like}App']),
				Joi.string().max(255)
					.regex(ValidationHelper.withFilterRegExp(model))
					.example('{'+ ass0 + '}{not}{username}{null}')
			);
			extraSchema[rel + '.$withCount'] = Joi.alternatives().try(
				Joi.array().description('count relationships occurrences: '+ ass0 + ', ['+ ass1 + '.childModel, '+ ass2 + ']')
					.items(
						Joi.string().max(255)
							.regex(ValidationHelper.withCountRegExp(model)))
					.example([ass0, ass1]),
				Joi.string().max(255).description('relationships: '+ ass0 + ', ['+ ass1 + ', Realms]')
					.regex(ValidationHelper.withCountRegExp(model))
					.example('Realms')
			);
			extraSchema[rel + '.$withSort'] = Joi.alternatives().try(
				Joi.array().description('sort related field: {'+ ass1 + '}[+,-]id vs [-id, -name]')
					.items(Joi.string().max(255)
						.regex(ValidationHelper.withSortRegExp(model)))
					.example(['{'+ ass0 + '}+name','{'+ ass0 + '}-username']),
				Joi.string().max(255)
					.regex(ValidationHelper.withSortRegExp(model))
					.example('{'+ ass0 + '}description')
			);
		}
	});

	return extraSchema;
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
				schema = schema.regex(ValidationHelper.filterRegExp(model));
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
				schema = addJoiAnyMin(schema, element02);
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


module.exports = (model, recursive, foreignKey) => {
	const relationList = Joi.string().required().valid(getRelList(model));

	const postRelObject = getRelObject(model, recursive, false, foreignKey);

	const putRelObject = getRelObject(model, recursive, true, foreignKey);

	const filters = getFilters(model);

	const pagination = getPagination(model);

	const sort = getSort(model);

	const math = getMath(model);

	const softDeleted = getSoftDeleted(model);

	const hardDeleted = getHardDeleted(model);

	const excludedFields = getExcludedFields(model);

	const count = getCount(model);

	const fields = getFields(model);

	const related = getRelated(model);

	const extra = getExtra(model);

	return {
		postRelObject: postRelObject,
		putRelObject: putRelObject,

		relationList: relationList,

		filters: filters,
		pagination: pagination,
		sort: sort,
		math: math,
		softDeleted: softDeleted,
		hardDeleted: hardDeleted,
		excludedFields: excludedFields,
		count: count,
		fields: fields,
		related: related,
		extra: extra,
	};
};
