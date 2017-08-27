const _ = require('lodash');
const Joi = require('joi');

// Only ONE element follows
const Operator = ['{=}', '{<}', '{<=}', '{>}', '{>=}', '{<>}', '{like}'];

// Array follows
const InOperator = '{in}';
// Array follows ONLY TWO elements
const BtwOperator = '{btw}';
// End condition
const NullOperator = '{null}';
// Change Where => whereNot, orWhere, orWhereNot, orWhereNotLike
const OrOperator = '{or}';
const NotOperator = '{not}';


const PreHandlerBase = {
	filterParser: function(response, key, value, schema) {
		value.forEach(function(el){
			let actualLevel = response.queryData.filter;
			let error = response.queryData.error;
			let dbAttribute = _.snakeCase(key);     // DB Attribute name (Snake Case);
			let orPresent = '';
			let notPresent = '';
			let realValue = el;       // Final condition value;
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
				if (!_.has(actualLevel, [[dbAttribute],[orPresent],[notPresent]])) {
					_.set(actualLevel, [[dbAttribute],[orPresent],[notPresent]], {});
				}
				actualLevel = actualLevel[dbAttribute][orPresent][notPresent];
			} else if (orPresent) {
				if (!_.has(actualLevel, [[dbAttribute],[orPresent]])) {
					_.set(actualLevel, [[dbAttribute],[orPresent]], {});
				}
				actualLevel = actualLevel[dbAttribute][orPresent];
			} else if (notPresent) {
				if (!_.has(actualLevel, [[dbAttribute],[notPresent]])) {
					_.set(actualLevel, [[dbAttribute],[notPresent]], {});
				}
				actualLevel = actualLevel[dbAttribute][notPresent];
			} else {
				if (!_.has(actualLevel, [dbAttribute])) {
					_.set(actualLevel, [dbAttribute], {});
				}
				actualLevel = actualLevel[dbAttribute];
			}

			// NULL operator
			if (_.includes(realValue, NullOperator)) {
				realValue = _.replace(realValue, NullOperator, '');
				if (!_.has(actualLevel, NullOperator)) {
					actualLevel[NullOperator] = [];
				}
			} else if (_.includes(realValue, BtwOperator)) {
				// BETWEEN operator
				realValue = _.replace(realValue, BtwOperator, '');
				let tmp = _.split(realValue, ',');
				tmp.forEach(function(value){
					const result = Joi.validate({ [dbAttribute]: value }, schema.schemaQuery());
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
			} else if (_.includes(realValue, InOperator)) {
				// IN operator
				realValue = _.replace(realValue, InOperator, '');
				let tmp = _.split(realValue, ',');
				tmp.forEach(function(value){
					const result = Joi.validate({ [dbAttribute]: value }, schema.schemaQuery());
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
						const result = Joi.validate({[dbAttribute]: realValue}, schema.schemaQuery());
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

				if (!_.has(fields, [schema.name])) {
					fields[schema.name] = [];
				}

				fields[schema.name].push(realValue);
				responseChanged = true;
			}
			if (op === 'withRelated' && !responseChanged) {
				if (_.indexOf(withRelated, el) === -1) {
					withRelated.push(el);
				}
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