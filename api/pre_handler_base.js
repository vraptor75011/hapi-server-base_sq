const _ = require('lodash');
const Joi = require('joi');
const SchemaUtility = require('../utilities/schema/schema_utility');
const DB = require('../config/sequelize');

// Only ONE element follows
const Operator = ['{=}', '{<}', '{<=}', '{>}', '{>=}', '{<>}', '{like}', '{%like}', '{like%}'];
const SQOperators = {
	'{=}': '$eq',
	'{<}': '$lt',
	'{<=}': '$lte',
	'{>}': '$gt',
	'{>=}': '$gte',
	'{<>}': '$ne',
	'{like}': '$like',
	'{%like}': '$like',
	'{like%}': '$like',
	'{not}{like}': '$notLike',
	'{not}{%like}': '$notLike',
	'{not}{like%}': '$notLike',
};


// Array follows
const InOperator = '{in}';
const SQInOperator = {
	'{in}': '$in',
	'{not}{in}': '$notIn'
};
// Array follows ONLY TWO elements
const BtwOperator = '{btw}';
const SQBtwOperator = {
	'{btw}': '$between',
	'{not}{btw}': '$notBetween',
};
// End condition
const NullOperator = '{null}';
const SQNullOperator = {
	'{null}': '$eq',
	'{not}{null}': '$ne',
};
// Changes Where => OR Array with Where elements
const OrOperator = '{or}';
const SQOrOperator = {
	'{or}': '$or',
};
// Changes Like, In, Between => notLike, notIn, notBetween
const NotOperator = '{not}';
const SQNotOperator = {
	'{not}': '$not',
};


const PreHandlerBase = {
	filterParser: function(response, key, value, schema) {
		value.forEach(function(el){
			let actualLevel = response.queryData.filter;
			let error = response.queryData.error;
			let dbAttribute = key;     // DB Attribute name (Camel Case);
			let orPresent = '';
			let notPresent = '';
			let realValue = el;       // Final condition value;
			// OR operator
			if (_.includes(realValue, OrOperator)) {
				orPresent = SQOrOperator[OrOperator];
				realValue = _.replace(realValue, OrOperator, '');
			}
			// NOT operator
			if (_.includes(realValue, NotOperator)) {
				notPresent = '{not}';
				realValue = _.replace(realValue, NotOperator, '');
			}
			if (orPresent) {
				if (!_.has(actualLevel, [orPresent])) {
					_.set(actualLevel, [orPresent], []);
				}
				let tmp = {};
				tmp[dbAttribute] = {};
				actualLevel[orPresent].push(tmp);
				actualLevel = tmp[dbAttribute];
			} else {
				if (!_.has(actualLevel, [dbAttribute])) {
					_.set(actualLevel, [dbAttribute], {});
				}
				actualLevel = actualLevel[dbAttribute];
			}

			// NULL operator
			if (_.includes(realValue, NullOperator)) {
				realValue = _.replace(realValue, NullOperator, '');
				if (!_.has(actualLevel, SQNullOperator[notPresent + NullOperator])) {
					actualLevel[SQNullOperator[notPresent + NullOperator]] = null;
				}
			} else if (_.includes(realValue, BtwOperator)) {
				// BETWEEN operator
				realValue = _.replace(realValue, BtwOperator, '');
				let tmp = _.split(realValue, ',');
				tmp.forEach(function(value){
					const result = Joi.validate({ [dbAttribute]: value }, schema.joiValid);
					if (result.error) {
						error['message'] = result.error.message;
						return response;
					}
				});
				if (!_.has(actualLevel, SQBtwOperator[notPresent + BtwOperator])) {
					actualLevel[SQBtwOperator[notPresent + BtwOperator]] = {};
					actualLevel[SQBtwOperator[notPresent + BtwOperator]] = tmp;
				} else {
					let found = false;
					actualLevel[SQBtwOperator[notPresent + BtwOperator]].forEach(function(cond){
						if (_.isEqual(cond.sort(), tmp.sort())) {
							found = true;
						}
					});
					if (!found) {
						actualLevel[SQBtwOperator[notPresent + BtwOperator]] = tmp;
					}
				}
			} else if (_.includes(realValue, InOperator)) {
				// IN operator
				realValue = _.replace(realValue, InOperator, '');
				let tmp = _.split(realValue, ',');
				tmp.forEach(function(value){
					const result = Joi.validate({ [dbAttribute]: value }, schema.joiValid);
					if (result.error) {
						error['message'] = result.error.message;
						return response;
					}
				});
				if (!_.has(actualLevel, SQInOperator[notPresent + InOperator])) {
					actualLevel[SQInOperator[notPresent + InOperator]] = [];
					actualLevel[SQInOperator[notPresent + InOperator]].push(tmp);
				} else {
					let found = false;
					actualLevel[SQInOperator[notPresent + InOperator]].forEach(function(cond){
						if (_.isEqual(cond.sort(), tmp.sort())) {
							found = true;
						}
					});
					if (!found) {
						actualLevel[SQInOperator[notPresent + InOperator]].push(tmp);
					}
				}
			} else {
				// LOGICAL operator
				let found = false;
				Operator.some(function(op){
					if (_.includes(realValue, op)){
						found = true;
						return true;
					}
				});
				if (!found) {
					realValue = '{=}'+realValue;
				}
				Operator.some(function (op) {
					if (_.includes(realValue, op)) {
						realValue = _.replace(realValue, op, '');
						const result = Joi.validate({[dbAttribute]: realValue}, schema.joiValid);
						if (result.error) {
							error['message'] = result.error.message;
							return response;
						}
						if (op === '{like}') {
							realValue = '%' + realValue + '%'
						} else if (op === '{%like}') {
							realValue = '%' + realValue
						} else if (op === '{like%}') {
							realValue = realValue + '%'
						}

						if (!_.has(actualLevel, SQOperators[notPresent + op])) {
							actualLevel[SQOperators[notPresent + op]] = [];
							actualLevel[SQOperators[notPresent + op]].push(realValue);
						} else {
							if (!_.includes(actualLevel[SQOperators[notPresent + op]], realValue)) {
								actualLevel[SQOperators[notPresent + op]].push(realValue);
							}
						}
						return true;
					}
				});
			}

		});
		return response;
	},

	sortParser: function(response, value, schema) {
		let sort = response.queryData.sort;
		value.forEach(function(el){
			let realValue = _.replace(el, '{'+schema.name+'}', '');
			let columns = _.split(realValue, ',');
			columns.forEach(function(col){
				let direction = _.includes(col, '-') ? 'DESC' : 'ASC';

				realValue = _.replace(_.replace(col, '-', ''), '+', '');

				let tmp = [];
				tmp.push(realValue);
				tmp.push(direction);
				sort.push(tmp);
			});

		});
		return response;
	},

	extraParser: function(response, op, value, schema) {
		let fields = response.queryData.fields;
		let include = response.queryData.include;
		let withRelated = response.queryData.withRelated;
		let withCount = response.queryData.withCount;
		let withFields = response.queryData.withFields;
		let withSort = response.queryData.withSort;
		let withFilter = response.queryData.withFilter;
		let relatedQuery = response.queryData.relatedQuery;
		value.forEach(function(el){
			let responseChanged = false;
			if (op === 'fields') {
				let realValue = _.replace(el, '{'+schema.name+'}', '');

				let tmp = _.split(realValue, ',');
				tmp.forEach(function(col){
					fields.push(col);
				});
				responseChanged = true;
			}
			if (op === 'withRelated' && !responseChanged) {
				let includeLevel = include;
				let schemaClone = _.clone(schema);
				let relTree = _.split(el,'.');
				relTree.forEach(function(levelRel, level){
					let firstLevelRelations = SchemaUtility.relationFromSchema(schemaClone);
					firstLevelRelations.forEach(function(rel){
						if (levelRel === rel.name) {
							if (!_.some(includeLevel, {model: DB[rel.model]})) {
								if (level === 0) {
									let tmp = {};
									tmp.model = DB[rel.model];
									includeLevel.push(tmp);
									includeLevel = tmp;
								} else if (level > 0) {
									if (!_.has(includeLevel, 'include')) {
										includeLevel['include'] = [];
									}
									let tmp = {};
									tmp.model = DB[rel.model];
									includeLevel['include'].push(tmp);
									includeLevel = tmp;
								}
							} else {
								includeLevel.forEach(function(elInclude){
									if (_.includes(elInclude, DB[rel.model])) {
										includeLevel = elInclude;
									}
								});
							}
							schemaClone = DB[rel.model];
						}
					});
				});

				responseChanged = true;
			}
			if (op === 'withCount' && !responseChanged) {
				if (_.indexOf(withCount, el) === -1) {
					withCount.push(el);
				}
				if (_.indexOf(withRelated, el) === -1) {
					withRelated.push(el);
				}
				responseChanged = true;
			}
			if (op === 'withFields' && !responseChanged) {
				let relation = '';
				let prefix = '';
				schema.relations.forEach(function(rel){
					if (_.includes(el, rel.name)) {
						relation = rel.name;
						prefix = '{' + relation + '}';
					}
				});
				let realValue = _.replace(el, prefix, '');
				if (!_.has(withFields, relation)) {
					withFields[relation] = [];
				}
				let tmp = _.split(realValue, ',');
				tmp.forEach(function(col){
					withFields[relation].push(_.snakeCase(col));
				});
				// withFields[relation].push(realValue);
				if (_.indexOf(withRelated, relation) === -1) {
					withRelated.push(relation);
				}
				responseChanged = true;
			}
			if (op === 'withSort' && !responseChanged) {
				let relation = '';
				let prefix = '';
				schema.relations.forEach(function(rel){
					if (_.includes(el, rel.name)) {
						relation = rel.name;
						prefix = '{' + relation + '}';
					}
				});
				let realValue = _.replace(el, '{' + relation + '}', '');
				let columns = _.split(realValue, ',');
				if (!_.has(relatedQuery, relation)) {
					relatedQuery[relation] = {};
				}
				columns.forEach(function(col){
					let direction = _.includes(col, '-') ? 'DESC' : 'ASC';

					realValue = _.replace(_.replace(col, '-', ''), '+', '');
					if (!_.has(withSort, relation)) {
						withSort[relation] = [];
					}
					if (!_.has(relatedQuery[relation], '{sort}')) {
						relatedQuery[relation]['{sort}'] = [];
					}
					let tmp = [];
					tmp.push(realValue);
					tmp.push(direction);
					withSort[relation].push(tmp);
					relatedQuery[relation]['{sort}'].push(tmp);
					if (_.indexOf(withRelated, relation) === -1) {
						withRelated.push(relation);
					}
				});
				responseChanged = true;
			}
			if (op === 'withFilter' && !responseChanged) {
				let actualLevel = withFilter;
				let newLevel = relatedQuery;
				let relation = '';        // User relation name
				let attribute = '';       // Relation attribute with condition
				let dbAttribute = '';     // DB Attribute name (Snake Case);
				let prefix = '';
				let suffix = '';
				let orPresent = '';
				let notPresent = '';
				let realValue = '';       // Final condition value;
				// relation and attribute
				schema.relations.forEach(function(rel){
					if (_.includes(el, rel.name)) {
						relation = rel;
						prefix = '{' + relation.name + '}';
						rel.attributes().forEach(function(attr){
							if (_.includes(el, attr.name)) {
								attribute = attr;
								dbAttribute = _.snakeCase(attribute.name);
								suffix = '{' + attribute.name + '}';
							}
						});
					}
				});
				if (_.indexOf(withRelated, relation.name) === -1) {
					withRelated.push(relation.name);
				}
				realValue = _.replace(_.replace(el, prefix, ''), suffix, '');
				// OR operator
				if (_.includes(realValue, OrOperator)) {
					orPresent = OrOperator;
					realValue = _.replace(realValue, OrOperator, '');
				}
				// NOT operator
				if (_.includes(realValue, NotOperator)) {
					notPresent = NotOperator;
					realValue = _.replace(realValue, NotOperator, '');
				}
				if (orPresent && notPresent) {
					if (!_.has(withFilter, [[relation.name],[dbAttribute],[orPresent],[notPresent]])) {
						_.set(withFilter, [[relation.name],[dbAttribute],[orPresent],[notPresent]], {});
					}
					if (!_.has(relatedQuery, [[relation.name],[dbAttribute],[orPresent],[notPresent]])) {
						_.set(relatedQuery, [[relation.name],[dbAttribute],[orPresent],[notPresent]], {});
					}
					actualLevel = actualLevel[relation.name][dbAttribute][orPresent][notPresent];
					newLevel = newLevel[relation.name][dbAttribute][orPresent][notPresent];
				} else if (orPresent) {
					if (!_.has(withFilter, [[relation.name],[dbAttribute],[orPresent]])) {
						_.set(withFilter, [[relation.name],[dbAttribute],[orPresent]], {});
					}
					if (!_.has(relatedQuery, [[relation.name],[dbAttribute],[orPresent]])) {
						_.set(relatedQuery, [[relation.name],[dbAttribute],[orPresent]], {});
					}
					actualLevel = actualLevel[relation.name][dbAttribute][orPresent];
					newLevel = newLevel[relation.name][dbAttribute][orPresent];
				} else if (notPresent) {
					if (!_.has(withFilter, [[relation.name],[dbAttribute],[notPresent]])) {
						_.set(withFilter, [[relation.name],[dbAttribute],[notPresent]], {});
					}
					if (!_.has(relatedQuery, [[relation.name],[dbAttribute],[notPresent]])) {
						_.set(relatedQuery, [[relation.name],[dbAttribute],[notPresent]], {});
					}
					actualLevel = actualLevel[relation.name][dbAttribute][notPresent];
					newLevel = newLevel[relation.name][dbAttribute][notPresent];
				} else {
					if (!_.has(withFilter, [[relation.name],[dbAttribute]])) {
						_.set(withFilter, [[relation.name],[dbAttribute]], {});
					}
					if (!_.has(relatedQuery, [[relation.name],[dbAttribute]])) {
						_.set(relatedQuery, [[relation.name],[dbAttribute]], {});
					}
					actualLevel = actualLevel[relation.name][dbAttribute];
					newLevel = newLevel[relation.name][dbAttribute];
				}

				// NULL operator
				if (_.includes(realValue, NullOperator)) {
					realValue = _.replace(realValue, NullOperator, '');
					if (!_.has(actualLevel, NullOperator)) {
						actualLevel[NullOperator] = [];
					}
					if (!_.has(newLevel, NullOperator)) {
						newLevel[NullOperator] = [];
					}
				} else if (_.includes(realValue, BtwOperator)) {
					// BETWEEN operator
					realValue = _.replace(realValue, BtwOperator, '');
					let tmp = _.split(realValue, ',');
					tmp.forEach(function(value){
						let relatedModel = relation.modelSchema();
						const result = Joi.validate({ [dbAttribute]: value }, relatedModel.schemaQuery());
						if (result.error) {
							error['message'] = result.error.message;
							return response;
						}
					});
					if (!_.has(actualLevel, BtwOperator)) {
						actualLevel[BtwOperator] = [];
						actualLevel[BtwOperator].push(tmp);
					} else {
						let found = false;
						actualLevel[BtwOperator].forEach(function(cond){
							if (_.isEqual(cond.sort(), tmp.sort())) {
								found = true;
							}
						});
						if (!found) {
							actualLevel[BtwOperator].push(tmp);
						}
					}
					if (!_.has(newLevel, BtwOperator)) {
						newLevel[BtwOperator] = [];
						newLevel[BtwOperator].push(tmp);
					} else {
						let found = false;
						newLevel[BtwOperator].forEach(function(cond){
							if (_.isEqual(cond.sort(), tmp.sort())) {
								found = true;
							}
						});
						if (!found) {
							newLevel[BtwOperator].push(tmp);
						}
					}
				} else if (_.includes(realValue, InOperator)) {
					// IN operator
					realValue = _.replace(realValue, InOperator, '');
					let tmp = _.split(realValue, ',');
					tmp.forEach(function(value){
						let relatedModel = relation.modelSchema();
						const result = Joi.validate({ [dbAttribute]: value }, relatedModel.schemaQuery());
						if (result.error) {
							error['message'] = result.error.message;
							return response;
						}
					});
					if (!_.has(actualLevel, InOperator)) {
						actualLevel[InOperator] = [];
						actualLevel[InOperator].push(tmp);
					} else {
						let found = false;
						actualLevel[InOperator].forEach(function(cond){
							if (_.isEqual(cond.sort(), tmp.sort())) {
								found = true;
							}
						});
						if (!found) {
							actualLevel[InOperator].push(tmp);
						}
					}
					if (!_.has(newLevel, InOperator)) {
						newLevel[InOperator] = [];
						newLevel[InOperator].push(tmp);
					} else {
						let found = false;
						newLevel[InOperator].forEach(function(cond){
							if (_.isEqual(cond.sort(), tmp.sort())) {
								found = true;
							}
						});
						if (!found) {
							newLevel[InOperator].push(tmp);
						}
					}
				} else {
					// LOGICAL operator
					Operator.some(function(op){
						if (_.includes(realValue, op)) {
							realValue = _.replace(realValue, op, '');

							let relatedModel = relation.modelSchema();
							const result = Joi.validate({ [dbAttribute]: realValue }, relatedModel.schemaQuery());
							if (result.error) {
								error['message'] = result.error.message;
								return response;
							}
							if (op === '{like}') {
								realValue = '%' + realValue + '%'
							}
							if (!_.has(actualLevel, op)) {
								actualLevel[op] = [];
								actualLevel[op].push(realValue);
							} else {
								if (!_.includes(actualLevel[op], realValue)) {
									actualLevel[op].push(realValue);
								}
							}
							if (!_.has(newLevel, op)) {
								newLevel[op] = [];
								newLevel[op].push(realValue);
							} else {
								if (!_.includes(newLevel[op], realValue)) {
									newLevel[op].push(realValue);
								}
							}
						}
					});

				}

			}
		});
		return response;
	},
};



module.exports = PreHandlerBase;