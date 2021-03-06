const _ = require('lodash');
const SchemaUtility = require('../schema/schema_helper');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

// Only ONE element follows
const Operators = ['{=}', '{<}', '{<=}', '{>}', '{>=}', '{<>}'];
const SQOperators = {
	'{=}': Op.eq,
	'{<}': Op.lt,
	'{<=}': Op.lte,
	'{>}': Op.gt,
	'{>=}': Op.gte,
	'{<>}': Op.ne,
};

const LikeOperators = ['{like}', '{notlike}', '{like%}', '{notlike%}', '{%like}', '{not%like}'];
const SQLikeOperators = {
	'{like}': Op.like,
	'{%like}': Op.like,
	'{like%}': Op.like,
	'{notlike}': Op.notLike,
	'{not%like}': Op.notLike,
	'{notlike%}': Op.notLike,
};

// Array follows
const InOperators = ['{in}', '{notin}'];
const SQInOperators = {
	'{in}': Op.in,
	'{notin}': Op.notIn,
};
// Array follows ONLY TWO elements
const BtwOperators = ['{btw}', '{notbtw}'];
const SQBtwOperators = {
	'{btw}': Op.between,
	'{notbtw}': Op.notBetween,
};
// End condition
const NullOperators = ['{NULL}', '{notNULL}', '{not}'];
const SQNullOperators = {
	'{NULL}': Op.eq,
	'{notNULL}': Op.ne,
	'{not}': Op.ne,
};
// Changes Where => OR Array with Where elements
const OrOperators = ['{or}'];
const SQOrOperators = {
	'{or}': Op.or,
	// '{and}': Op.and,
};

const ALLOperators = _.union(Operators, LikeOperators, InOperators, BtwOperators, NullOperators, OrOperators);

//Object to export
const PreHandlerBase = {
	filterParser: (response, key, value, schema) => {

		return filterParser(response, key, value, schema);
	},

	sortParser: (response, value, schema) => {

		return sortParser(response, value, schema);
	},

	mathParser: (response, op, value, schema) => {
		let realValue = _.replace(value, '{'+schema.name+'}', '');

		response = realValue;

		return response;
	},

	fullTextSearchParser: (response, value, schema) => {
		response['where'] = response.where || {};

		Object.keys(schema.attributes).map((attr) => {
			let actualLevel = response.where;
			let attribute = schema.attributes[attr];
			let type = attribute.type.key;
			if ((type === 'STRING' || type === 'TEXT') && !attribute.exclude) {
				if (!_.has(actualLevel, SQOrOperators['{or}'])) {
					_.set(actualLevel, SQOrOperators['{or}'], []);
				}
				actualLevel = actualLevel[SQOrOperators['{or}']];

				let toTake = true;
				LikeOperators.forEach((op) => {
					if (_.includes(value, op)) {
						toTake = false;
						let tmp = {};
						tmp[attr] = {};
						actualLevel.push(tmp);
						actualLevel = tmp[attr];

						tmp = '';
						switch (op) {
							case '{%like}': {
								tmp = '%' + _.replace(value, op, '');
								break
							}
							case '{like}': {
								tmp = '%' + _.replace(value, op, '') +'%';
								break;
							}
							case '{like%}': {
								tmp = _.replace(value, op, '') + '%';
								break;
							}
							case '{not%like}': {
								tmp = '%' + _.replace(value, op, '');
								break
							}
							case '{notlike}': {
								tmp = '%' + _.replace(value, op, '') +'%';
								break;
							}
							case '{notlike%}': {
								tmp = _.replace(value, op, '') + '%';
								break;
							}
						}

						if (!_.has(actualLevel, SQLikeOperators[op])) {
							_.set(actualLevel, SQLikeOperators[op], tmp);
						}
					}
				});
				if (toTake) {
					let tmp = '%' + value +'%';
					if (!_.has(actualLevel, SQLikeOperators['{like}'])) {
						_.set(actualLevel, SQLikeOperators['{like}'], tmp);
					}
				}

			}

		});
		return response;
	},

	extraParser: (response, op, value, schema) => {
		let models = schema.sequelize.models;

		value.forEach(function(el){
			let responseChanged = false;
			if (op === '$fields') {
				response['attributes'] = response.attributes || [];
				let realValue = _.replace(el, '{'+schema.name+'}', '');

				let tmp = _.split(realValue, ',');
				tmp.forEach((col) => {
					response.attributes.push(col);
				});
				responseChanged = true;
			}

			if (op === '$fields4Select') {
				response['attributes'] = response.attributes || [];
				let realValue = _.replace(el, '{'+schema.name+'}', '');

				let tmp = _.split(realValue, ',');
				tmp.forEach((col) => {
					response.attributes.push(col);
				});
				responseChanged = true;
			}

			if (op === '$withCount' && !responseChanged) {
				response['include'] = response.include || [];
				let preLevel = response;
				let preRel = '';
				let includeLevel = response.include;
				let schemaClone = schema;
				let relTree = _.split(el,'.');
				let column = '';
				let targetAssociation = '';
				let targetModel = '';
				let as = '';
				relTree.forEach(function(levelRel, level){
					targetAssociation = schemaClone.associations[levelRel];
					targetModel = targetAssociation.target;
					as = targetAssociation.as;
					if (level === 0) {
						preLevel['includeIgnoreAttributes'] = false;
						preLevel['attributes'] = preLevel.attributes || [];
						preLevel.group = preLevel.group || [];
						preLevel.group.push(schemaClone.name + '.id');
					} else {
						// includeLevel.group = includeLevel.group || [];
						// includeLevel.group.push(preRel + '.id');
						preLevel.group.push(preRel + '.id');
					}
					column += levelRel + '.';

					if (!_.some(includeLevel, {model: targetModel, as: as})) {
						if (level === 0) {
							let tmp = {};
							tmp.model = targetModel;
							tmp.as = as;
							tmp.duplicating = false;
							tmp.attributes = [];
							includeLevel.push(tmp);
							includeLevel = tmp;
						} else if (level > 0) {
							if (!_.has(includeLevel, 'include')) {
								includeLevel['include'] = [];
							}
							if (!_.some(includeLevel['include'], {model: targetModel, as: as})) {
								let tmp = {};
								tmp.model = targetModel;
								tmp.as = as;
								tmp.duplicating = false;
								tmp.attributes = [];
								includeLevel['include'].push(tmp);
								includeLevel = tmp;
							}
						}
					} else {
						includeLevel.forEach(function(include){
							if (!_.some(include, {model: targetModel, as: as})) {
								includeLevel = include;
							}
						});
					}
					schemaClone = targetModel;
					preRel = levelRel;
				});

				preLevel.attributes.push([Sequelize.fn('COUNT', column + 'id'), targetAssociation.as + 'Count']);

				// preLevel['includeIgnoreAttributes'] = false;

				// preLevel['attributes'] = preLevel.attributes || [];
				// let column = el + '.id';
				// includeLevel.attributes = includeLevel.attributes || [];
				// preLevel.attributes.push([Sequelize.fn('COUNT', Sequelize.col(column)), targetAssociation.as + 'Count']);
				// includeLevel.duplicating = false;

				// if (!_.some(includeLevel, {model: targetModel, as: as})) {
				// 	let tmp = {};
				// 	tmp.model = targetModel;
				// 	tmp.as = as;
				// 	tmp.attributes = [];
				// 	tmp.duplicating = false;
				// 	includeLevel.push(tmp);
				// } else {
				// 	includeLevel.forEach((level) => {
				// 		if (level.as === as) {
				// 			level['attributes'] = level['attributes'] || [];
				// 			// level['attributes'].push(column);
				// 			level['duplicating'] = false;
				// 		}
				// 	});
				// }



				responseChanged = true;
			}

			if (op === '$withRelated' && !responseChanged) {
				response['include'] = response.include || [];
				let includeLevel = response.include;
				let schemaClone = _.clone(schema);
				let relTree = _.split(el,'.');
				relTree.forEach(function(levelRel, level){
					let targetAssociation = schemaClone.associations[levelRel];
					let targetModel = targetAssociation.target;
					let as = targetAssociation.as;

					if (!_.some(includeLevel, {model: targetModel, as: as})) {
						if (level === 0) {
							let tmp = {};
							tmp.model = targetModel;
							tmp.as = as;
							includeLevel.push(tmp);
							includeLevel = tmp;
						} else if (level > 0) {
							if (!_.has(includeLevel, 'include')) {
								includeLevel['include'] = [];
							}
							if (!_.some(includeLevel['include'], {model: targetModel, as: as})) {
								let tmp = {};
								tmp.model = targetModel;
								tmp.as = as;
								includeLevel['include'].push(tmp);
								includeLevel = tmp;
							}
						}
					} else {
						includeLevel.forEach(function(include){
							if (!_.some(include, {model: targetModel, as: as})) {
								includeLevel = include;
							}
						});
					}
					schemaClone = targetModel;
				});

				responseChanged = true;
			}

			if (op === '$withFields' && !responseChanged) {
				response['include'] = response.include || [];
				let relation = '';
				let prefix = '';
				let associations = SchemaUtility.relationFromSchema(schema, 2);

				associations.forEach(function(rel){
					if (_.includes(el, rel.name)) {
						relation = rel.name;
						prefix = '{' + relation + '}';
					}
				});

				let realValue = _.replace(el, prefix, '');

				let includeLevel = response.include;
				let schemaClone = _.clone(schema);
				let relTree = _.split(relation,'.');
				relTree.forEach(function(levelRel, level){
					let targetAssociation = schemaClone.associations[levelRel];
					let targetModel = targetAssociation.target;
					let as = targetAssociation.as;

					if (!_.some(includeLevel, {model: targetModel, as: as})) {
						if (level === 0) {
							let tmp = {};
							tmp.model = targetModel;
							tmp.as = as;
							includeLevel.push(tmp);
							includeLevel = tmp;
						} else if (level > 0) {
							if (!_.has(includeLevel, 'include')) {
								includeLevel['include'] = [];
							}
							if (!_.some(includeLevel['include'], {model: targetModel, as: as})) {
								let tmp = {};
								tmp.model = targetModel;
								tmp.as = as;
								includeLevel['include'].push(tmp);
								includeLevel = tmp;
							}
						}
					} else {
						includeLevel.forEach(function(include){
							if (!_.some(include, {model: targetModel, as: as})) {
								includeLevel = include;
							}
						});
					}
					schemaClone = targetModel;
				});

				let columns = _.split(realValue, ',');

				if (!_.has(includeLevel, 'attributes')) {
					includeLevel['attributes'] = [];
				}
				columns.forEach(function(col){
					includeLevel['attributes'].push(col);
				});

				responseChanged = true;
			}

			if (op === '$withSort' && !responseChanged) {
				response['include'] = response.include || [];
				response['order'] = response.order || [];
				let relation = '';
				let prefix = '';
				let associations = SchemaUtility.relationFromSchema(schema, 2);

				associations.forEach(function(rel){
					if (_.includes(el, rel.name)) {
						relation = rel.name;
						prefix = '{' + relation + '}';
					}
				});

				let realValue = _.replace(el, prefix, '');

				let includeLevel = response.include;
				let schemaClone = _.clone(schema);
				let relTree = _.split(relation,'.');
				relTree.forEach(function(levelRel, level){
					let targetAssociation = schemaClone.associations[levelRel];
					let targetModel = targetAssociation.target;
					let as = targetAssociation.as;

					if (!_.some(includeLevel, {model: targetModel, as: as})) {
						if (level === 0) {
							let tmp = {};
							tmp.model = targetModel;
							tmp.as = as;
							includeLevel.push(tmp);
							includeLevel = tmp;
						} else if (level > 0) {
							if (!_.has(includeLevel, 'include')) {
								includeLevel['include'] = [];
							}
							if (!_.some(includeLevel['include'], {model: targetModel, as: as})) {
								let tmp = {};
								tmp.model = targetModel;
								tmp.as = as;
								includeLevel['include'].push(tmp);
								includeLevel = tmp;
							}
						}
					} else {
						includeLevel.forEach(function(include){
							if (!_.some(include, {model: targetModel, as: as})) {
								includeLevel = include;
							}
						});
					}
					schemaClone = targetModel;
				});

				let columns = _.split(realValue, ',');

				columns.forEach(function(col){
					let direction = _.includes(col, '-') ? 'DESC' : 'ASC';

					realValue = _.replace(_.replace(col, '-', ''), '+', '');

					let tmp = [];
					let relArray = _.split(relation,'.');
					relArray.forEach(function(rel){
						tmp.push(rel);
					});
					tmp.push(realValue);
					tmp.push(direction);
					response.order.push(tmp);
				});

				responseChanged = true;
			}

			if (op === '$withFilter' && !responseChanged) {
				response['include'] = response.include || [];

				let relation = '';        // User relation name
				let model = '';           // relation Model
				let attribute = '';       // Relation attribute with condition
				let dbAttribute = '';     // DB Attribute name (Snake Case);
				let prefix = '';
				let suffix = '';
				let realValue = '';       // Final condition value;

				// relation and attribute
				let associations = SchemaUtility.relationFromSchema(schema, 2);
				associations.forEach(function(rel){
					if (_.includes(el, '{' + rel.name + '}')) {
						relation = rel.name;
						model = models[rel.model];
						prefix = '{' + rel.name + '}';
						Object.keys(model.attributes).map((attr) => {
							if (_.includes(el, '{' + attr + '}')) {
								attribute = attr;
								dbAttribute = attribute;
								suffix = '{' + attribute + '}';
							}
						});
					}
				});

				realValue = _.replace(_.replace(el, prefix, ''), suffix, '');

				let includeLevel = response.include;
				let schemaClone = schema;
				let relTree = _.split(relation,'.');
				relTree.forEach(function(levelRel, level){
					let targetAssociation = schemaClone.associations[levelRel];
					let targetModel = targetAssociation.target;
					let as = targetAssociation.as;

					if (!_.some(includeLevel, {model: targetModel, as: as})) {
						if (level === 0) {
							let tmp = {};
							tmp.model = targetModel;
							tmp.as = as;
							includeLevel.push(tmp);
							includeLevel = tmp;
						} else if (level > 0) {
							if (!_.has(includeLevel, 'include')) {
								includeLevel['include'] = [];
							}
							if (!_.some(includeLevel['include'], {model: targetModel, as: as})) {
								let tmp = {};
								tmp.model = targetModel;
								tmp.as = as;
								includeLevel['include'].push(tmp);
								includeLevel = tmp;
							}
						}
					} else {
						includeLevel.forEach(function(include){
							if (!_.some(include, {model: targetModel, as: as})) {
								includeLevel = include;
							}
						});
					}
					schemaClone = targetModel;
				});

				// let newInclude = includeLevel['through'] = {};

				includeLevel = filterParser(includeLevel, dbAttribute, [realValue], schemaClone);

			}

			if (op === '$withThroughFilter' && !responseChanged) {
				response['include'] = response.include || [];

				let relation = '';        // User relation name
				let attribute = '';       // Relation attribute with condition
				let dbAttribute = '';     // DB Attribute name (Snake Case);
				let prefix = '';
				let suffix = '';
				let realValue = '';       // Final condition value;
				let targetAssociation = '';
				let throughModel = '';

				// relation and attribute
				// let associations = SchemaUtility.relationFromSchema(schema, 2);
				// associations.forEach(function(rel){
				// 	if (_.includes(el, '{' + rel.name + '}')) {
				// 		relation = rel.name;
				// 		model = models[rel.model];
				//
				// 		prefix = '{' + rel.name + '}';
				// 		Object.keys(model.attributes).map((attr) => {
				// 			if (_.includes(el, '{' + attr + '}')) {
				// 				attribute = attr;
				// 				dbAttribute = attribute;
				// 				suffix = '{' + attribute + '}';
				// 			}
				// 		});
				// 	}
				// });
				let indexFirstBrace = el.indexOf('{');
				let indexSecondBrace = el.indexOf('}');
				relation = el.slice(indexFirstBrace + 1, indexSecondBrace);
				prefix = '{' + relation + '}';
				let relTree = _.split(relation, '.');
				relTree.forEach((levelRel) => {
					targetAssociation = schema.associations[levelRel];
					if (targetAssociation.through) {
						throughModel = targetAssociation.through.model;

						Object.keys(throughModel.attributes).map((attr) => {
							if (_.includes(el, '{' + attr + '}')) {
								attribute = attr;
								dbAttribute = attribute;
								suffix = '{' + attribute + '}';
							}
						});
					}
				});

				let includeLevel = response.include;
				let schemaClone = _.clone(schema);

				realValue = _.replace(_.replace(el, prefix, ''), suffix, '');

				relTree.forEach(function(levelRel, level){
					let targetAssociation = schemaClone.associations[levelRel];
					let targetModel = targetAssociation.target;
					let as = targetAssociation.as;

					if (!_.some(includeLevel, {model: targetModel, as: as})) {
						if (level === 0) {
							let tmp = {};
							tmp.model = targetModel;
							tmp.as = as;
							includeLevel.push(tmp);
							includeLevel = tmp;
						} else if (level > 0) {
							if (!_.has(includeLevel, 'include')) {
								includeLevel['include'] = [];
							}
							if (!_.some(includeLevel['include'], {model: targetModel, as: as})) {
								let tmp = {};
								tmp.model = targetModel;
								tmp.as = as;
								includeLevel['include'].push(tmp);
								includeLevel = tmp;
							}
						}
					} else {
						includeLevel.forEach(function(include){
							if (!_.some(include, {model: targetModel, as: as})) {
								includeLevel = include;
							}
						});
					}
					schemaClone = targetModel;
				});

				if (!_.has(includeLevel, 'through')) {
					includeLevel['through'] = {};
				}
				includeLevel = includeLevel.through;

				includeLevel = filterParser(includeLevel, dbAttribute, [realValue], throughModel);

			}


		});
		return response;
	},
};

module.exports = PreHandlerBase;


/**
 * Given a set of parameters, the function builds the string (or upgrade it)
 * to include in the Sequelize query string the model attributes conditions filters
 * @param response: A string with the building Sequelize query.
 * @param key: The URL Query object key to one attribute.
 * @param value: The URL Query object key value to one attribute.
 * @param schema: The model is building for Sequelize query string.
 * @returns {string} The building Sequelize query string.
 * @private
 */
let filterParser = (response, key, value, schema) => {
	response['where'] = response.where || {};
	let actualLevel = response.where;
	value.forEach(function(el){
		actualLevel = response.where;
		let dbAttribute = key;     // DB Attribute name (Camel Case);
		let realValue = el;       // Final condition value;
		let or = false;

		//Least one operator. Always
		let addEQ = true;
		ALLOperators.forEach( (op) => {
			if (_.includes(realValue, op)) {
				addEQ = false;
			}
		});
		if (addEQ) {
			realValue = '{=}'+realValue;
		}

		// OR operator
		OrOperators.forEach( (op) => {
			if (_.includes(realValue, op) && op === '{or}') {
				or = true;
				realValue = _.replace(realValue, op, '');
				if (!_.has(actualLevel, SQOrOperators[op])) {
					_.set(actualLevel, SQOrOperators[op], []);
				}
				actualLevel = actualLevel[SQOrOperators[op]];
			}
		});

		// BETWEEN operator
		BtwOperators.forEach( (op) => {
			if (_.includes(realValue, op)) {
				if (or) {
					let btw = {};
					_.set(btw, key, {});
					_.set(btw[key], SQBtwOperators[op], _.split(_.replace(realValue, op, ''), ','));
					actualLevel.push(btw);
				} else {
					if (!_.has(actualLevel, dbAttribute)) {
						_.set(actualLevel, dbAttribute, {});
					}
					actualLevel = actualLevel[dbAttribute];

					let tmp = _.split(_.replace(realValue, op, ''), ',');
					if (!_.has(actualLevel, SQBtwOperators[op])) {
						_.set(actualLevel, SQBtwOperators[op], tmp);
					}
				}
			}
		});

		// IN operator
		InOperators.forEach( (op) => {
			if (_.includes(realValue, op)) {
				if (or) {
					let btw = {};
					_.set(btw, key, {});
					_.set(btw[key], SQInOperators[op], _.split(_.replace(realValue, op, ''), ','));
					actualLevel.push(btw);
				} else {
					if (!_.has(actualLevel, dbAttribute)) {
						_.set(actualLevel, dbAttribute, {});
					}
					actualLevel = actualLevel[dbAttribute];

					let tmp = _.split(_.replace(realValue, op, ''), ',');
					if (!_.has(actualLevel, SQInOperators[op])) {
						_.set(actualLevel, SQInOperators[op], tmp);
					}
				}
			}
		});

		// NULL operator
		NullOperators.forEach( (op) => {
			if (_.includes(realValue, op)) {
				if (or) {
					let btw = {};
					_.set(btw, key, {});
					_.set(btw[key], SQNullOperators[op], _.split(_.replace(realValue, op, ''), ','));
					actualLevel.push(btw);
				} else {
					if (!_.has(actualLevel, dbAttribute)) {
						_.set(actualLevel, dbAttribute, {});
					}
					actualLevel = actualLevel[dbAttribute];

					let tmp = null;
					if (op === '{not}') {
						tmp = _.replace(realValue, op, '');
					}
					if (!_.has(actualLevel, SQNullOperators[op])) {
						_.set(actualLevel, SQNullOperators[op], tmp);
					}
				}
			}
		});

		// NULL operator
		LikeOperators.forEach( (op) => {
			if (_.includes(realValue, op)) {
				if (or) {
					let btw = {};
					_.set(btw, key, {});
					_.set(btw[key], SQLikeOperators[op], _.split(_.replace(realValue, op, ''), ','));
					actualLevel.push(btw);
				} else {
					if (!_.has(actualLevel, dbAttribute)) {
						_.set(actualLevel, dbAttribute, {});
					}
					actualLevel = actualLevel[dbAttribute];

					let tmp = '';
					switch (op) {
						case '{%like}': {
							tmp = '%' + _.replace(realValue, op, '');
							break
						}
						case '{like}': {
							tmp = '%' + _.replace(realValue, op, '') +'%';
							break;
						}
						case '{like%}': {
							tmp = _.replace(realValue, op, '') + '%';
							break;
						}
						case '{not%like}': {
							tmp = '%' + _.replace(realValue, op, '');
							break
						}
						case '{notlike}': {
							tmp = '%' + _.replace(realValue, op, '') +'%';
							break;
						}
						case '{notlike%}': {
							tmp = _.replace(realValue, op, '') + '%';
							break;
						}
					}

					if (!_.has(actualLevel, SQLikeOperators[op])) {
						_.set(actualLevel, SQLikeOperators[op], tmp);
					}
				}
			}
		});


		// LOGICAL operator
		Operators.forEach( (op) => {
			if (_.includes(realValue, op)) {
				realValue = _.replace(realValue, op, '');

				let attr = schema.attributes[dbAttribute];

				if (attr.type.key === 'BOOLEAN') {
					if (realValue === 'true' || realValue === '1' || realValue === 1) {
						realValue = true;
					} else {
						realValue = false;
					}

				}

				if (or) {
					let btw = {};
					_.set(btw, key, {});
					_.set(btw[key], SQOperators[op], realValue);
					actualLevel.push(btw);
				} else {

					if (!_.has(actualLevel, dbAttribute)) {
						_.set(actualLevel, dbAttribute, {});
					}
					actualLevel = actualLevel[dbAttribute];

					if (!_.has(actualLevel, SQOperators[op])) {
						_.set(actualLevel, SQOperators[op], realValue);
					}
				}
			}
		});


	});
	return response;
};

/**
 * Given a set of parameters, the function builds the string (or upgrade it)
 * to include in the Sequelize query string the model attributes conditions to sort
 * @param response: A string with the building Sequelize query.
 * @param value: The URL Query object key value to one attribute.
 * @param schema: The model is building for Sequelize query string.
 * @returns {string} The building Sequelize query string.
 * @private
 */
let sortParser = (response, value, schema) => {
	response['order'] = response.order || [];
	value.forEach(function(el){
		let realValue = _.replace(el, '{'+schema.name+'}', '');
		let columns = _.split(realValue, ',');
		columns.forEach(function(col){
			let direction = _.includes(col, '-') ? 'DESC' : 'ASC';
			realValue = _.replace(_.replace(col, '-', ''), '+', '');
			let attribute = schema.attributes[realValue];
			let type = attribute.type;
			if (type.key === 'VIRTUAL'){
				let fields = type.fields;
				if (fields) {
					fields.forEach((attr) => {
						let tmp = [];
						tmp.push(attr);
						tmp.push(direction);
						response.order.push(tmp);
					})
				}
			} else {
				let tmp = [];
				tmp.push(realValue);
				tmp.push(direction);
				response.order.push(tmp);
			}
		});

	});
	return response;
};
