const _ = require('lodash');
const DB = require('../../config/sequelize');
const SchemaUtility = require('../schema/schema_helper');
const Pluralize = require('pluralize');


// Operation permitted in query URL
// Everyone can do with prefix {not} or {or}
const numberOperators = ['{=}', '{<}', '{<=}', '{>}', '{>=}', '{<>}'];
const stringOperators = ['{=}', '{like}'];
const nestedOperators = ['{=}', '{<}', '{<=}', '{>}', '{>=}', '{<>}'];
const likeOperators = ['{like}', '{notlike}', '{like%}', '{notlike%}', '{%like}', '{not%like}'];
const inOperator = ['{in}', '{notin}'];
const btwOperator = ['{btw}', '{notbtw}'];
const nullOperator = ['{NULL}', '{notNULL}', '{not}'];

// For the RegExp
const OrOrNot = '(?:{not}|{or})?';
const Or = '(?:{or})?';
let intNumber = "[1-9]{1}[0-9]{0,6}";                                // From 1 to 9.999.999
let floatNumber = "[-+]?([0]|[1-9]{1}[0-9]{0,6})(\.[0-9]{1,6})?";    // From -9,999,999.999,999 to [+]9,999,999.999,999
let username = "([a-zA-Z0-9]+[_.-]?)*[a-zA-Z0-9]";                   // alt(a-zA-Z0-9||_.-) always ends with a-zA-Z0-9 no max length
let password = "^[a-zA-Z0-9àèéìòù\*\.\,\;\:\-\_\|@&%\$]{3,}$";
let pwdRegExp = new RegExp(password);
let email = '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"' +
	'(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")' +
	'@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|' +
	'\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|' +
	'[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]' +
	'|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])';                        // Email
let datetime = '([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?'; // Datetime for DB ex: 2017-08-15 10:00:00


const ValidationBase = {
	// STRING admitted in Filter. Filter is an Operation on Model Attributes
	filterRegExp: () => {
		let result = '';

		nestedOperators.forEach(function(operator, index){
			if (index > 0) {
				result += '|';
			}
			if (operator === '{=}') {
				result += "^" + Or + "(?:" + operator + ")?.+$";
			} else {
				result += "^" + Or + operator + ".+$";
			}
		});

		likeOperators.forEach(function(operator){
			result += '|';
			result += "^" + Or + operator + ".+$";
		});

		inOperator.forEach(function(operator){
			result += '|';
			result += "^" + Or + operator + ".+$";
		});

		btwOperator.forEach(function(operator){
			result += '|';
			result += "^" + Or + operator + ".+$";
		});

		nullOperator.forEach(function(operator){
			result += '|';
			result += "^" + Or + operator + "$";
		});

		return new RegExp(result);
	},

	// STRING admitted in Field for all Attributes not Excluded. Model Fields to select
	fieldRegExp: (schema) => {
		let result = '';
		let columns = '(';

		Object.keys(schema.attributes).map((attr, index) => {
			if (index > 0) {
				columns += '|';
			} else {
				columns += '|'
			}
			columns += attr;
		});
		columns += ')';

		let prefix = '(?:{' + schema.name + '})?';

		result += "^" + prefix + columns + "(," + columns + ")*$";

		return new RegExp(result);
	},

	// STRING admitted in Full Text Search. Full Text Search is an Operation on Model String Attributes
	fullTextSearchRegExp: () => {
		let result = '';

		likeOperators.forEach(function(operator, index){
			if (index > 0) {
				result += '|';
			}
			result += "^" + operator + ".+$";
		});

		return new RegExp(result);
	},

	// STRING admitted in Field for all Attributes not Excluded. Model Fields to select
	field4SelectRegExp: (schema) => {
		let result = '';
		let columns = '(';

		Object.keys(schema.attributes).map((attr, index) => {
			let attribute = schema.attributes[attr];
			if (!attribute.exclude && !attribute._autoGenerated) {
				if (index > 0) {
					columns += '|';
				} else {
					columns += '|'
				}
				columns += attr;
			}
		});
		columns += ')';

		let prefix = '(?:{' + schema.name + '})?';

		result += "^" + prefix + columns + "(," + columns + ")*$";

		return new RegExp(result);
	},

	// STRING admitted in Field for all Attributes not Excluded. Model Fields to select
	fieldDefault4Select: (schema) => {
		let result = [];

		Object.keys(schema.attributes).map((attr) => {
			let attribute = schema.attributes[attr];
			if (attribute.default4Select || attribute.primaryKey) {
				result.push(attr);
			}
		});

		if (result.length === 1) {
			result[1] = result[0];
		}

		return result;
	},

	// Fields to apply sum, min & max. Model Fields to select
	mathFieldRegExp: (schema) => {
		let result = '';
		let columns = '(';

		Object.keys(schema.attributes).map((attr, index) => {
			let attribute = schema.attributes[attr];
			let type = attribute.type.key;

			if (attribute.type.key === 'INTEGER' || attribute.type.key === 'FLOAT' ||
				attribute.type.key === 'REAL' || attribute.type.key === 'DOUBLE' ||
				attribute.type.key === 'DECIMAL' || attribute.type.key === 'DATE') {

				if (columns !== '(') {
					columns += '|';
				}
				columns += attr;
			}

		});
		columns += ')';

		let prefix = '(?:{' + schema.name + '})?';

		result += "^" + prefix + columns + "$";

		return new RegExp(result);
	},

	// STRING admitted in withRelated for relations. Possible Relations to include
	withRelatedRegExp: (schema) => {
		let result = '';
		let relations = '(';
		let exclusion = [schema.name];

		let schemaRelations = schema.associations;

		Object.keys(schemaRelations).map((rel, index) => {
			let relModel = schemaRelations[rel].target;
			let localExclusion = [rel];
			if (index > 0) {
				relations += '|';
			}
			relations += rel;

			if (Object.keys(rel).length > 0) {
				Object.keys(relModel.associations).map((relOfRel) => {
					if (!_.includes(exclusion, relOfRel)) {
						relations += '|';
						relations += rel + '.' + relOfRel;
					}
				});
			}
		});
		relations += ')';

		result += "^" + relations + "$";

		return new RegExp(result);
	},

	// STRING admitted in withCount for relations. Possible Relations to include (only ONE level)
	withCountRegExp: (schema) => {
		let result = '';
		let relations = '(';

		let schemaRelations = schema.associations;

		Object.keys(schemaRelations).map((rel, index) => {
			if (index > 0) {
				relations += '|';
			} else {
				result = '';
			}

			relations += rel;

		});
		relations += ')';

		result += "^" + relations + "$";

		return new RegExp(result);
	},

	// STRING admitted in with Related Field (related tables attributes) for all possible Relationships
	withRelatedFieldRegExp: (schema) => {
		let models = schema.sequelize.models;
		let result = '';
		let relations = SchemaUtility.relationFromSchema(schema, 2);

		relations.forEach(function(rel, index){
			let columns = '(';

			let model = models[rel.model];

			Object.keys(model.attributes).map((attr, index) => {
				if (index > 0) {
					columns += '|';
				}
				columns += attr;
			});

			columns += ')';

			let prefix = '{' + rel.name + '}';
			if (index > 0) {
				result += '|';
			}
			result += "^" + prefix + columns + "(," + columns + ")*$";
		});

		return new RegExp(result);
	},

	// STRING admitted in with Related Through Field (related through tables attributes) for BelongsToMany Relationships
	withRelatedThroughFieldRegExp: (schema) => {
		let result = '/[]/';

		Object.keys(schema.associations).map((rel) => {
			let relation = schema.associations[rel];
			let targetModel = relation.target;

			if (relation.associationType === 'BelongsToMany'){
				if (result === '/[]/') {
					result = '';
				} else {
					result += '|';
				}

				let columns = '(';

				let model = relation.throughModel;

				Object.keys(model.attributes).map((attr, index) => {
					if (index > 0) {
						columns += '|';
					}
					columns += attr;
				});

				columns += ')';

				let prefix = '{' + rel + '}';

				result += "^" + prefix + columns + "(," + columns + ")*$";
			}

			// Second Level!!
			Object.keys(targetModel.associations).map((rel2Level, index) => {
				let relation = targetModel.associations[rel2Level];

				if (relation.associationType === 'BelongsToMany'){
					if (result === '/[]/') {
						result = '';
					} else {
						result += '|';
					}
					let columns = '(';

					let model = relation.throughModel;

					Object.keys(model.attributes).map((attr, index) => {
						if (index > 0) {
							columns += '|';
						}
						columns += attr;
					});

					columns += ')';

					let prefix = '{' + rel + '.' + rel2Level + '}';
					result += "^" + prefix + columns + "(," + columns + ")*$";
				}

			});

		});

		return new RegExp(result);
	},

	// STRING admitted in Sort Attributes
	sortRegExp: (schema) => {
		let result = '';
		let columns = '(';

		Object.keys(schema.attributes).map((attr, index) => {
			if (index > 0) {
				columns += '|';
			}
			columns += attr;
		});
		columns += ')';

		let prefix = '(?:{' + schema.name + '})?';
		let direction = '(?:(\\+|\\-))?';

		result += "^" + prefix + direction + columns + "(," + direction + columns + ")*$";

		return new RegExp(result);
	},

	// STRING for with SORT
	withSortRegExp: (schema) => {
		let models = schema.sequelize.models;
		let result = '';
		let relations = SchemaUtility.relationFromSchema(schema, 2);

		relations.forEach(function(rel, index){
			let columns = '(';
			let model = models[rel.model];

			Object.keys(model.attributes).map((attr, index) => {
				if (index > 0) {
					columns += '|';
				}
				columns += attr;
			});

			columns += ')';

			let prefix = '{' + rel.name + '}';
			let direction = '(?:(\\+|\\-))?';
			if (index > 0) {
				result += '|';
			}
			result += "^" + prefix + direction + columns + "(," + direction + columns + ")*$";
		});

		return new RegExp(result);
	},

	// STRING admitted in with FILTER Reletion Attributes filter
	withFilterRegExp: (schema) => {
		let models = schema.sequelize.models;
		let result = '';
		let attributes = '';
		let relations = SchemaUtility.relationFromSchema(schema, 2);

		relations.forEach(function(rel, index){
			let relation = '{' + rel.name + '}';
			let model = models[rel.model];

			Object.keys(model.attributes).map((attr, index) => {
				if (index > 0) {
					attributes += '|'
				}
				attributes += '{' + attr + '}';
			});

			if (index > 0) {
				result += '|';
			}
			nestedOperators.forEach(function(operator, index){
				if (index > 0) {
					result += '|';
				}
				result += "^" + relation + Or + "(" + attributes + ")" + operator + ".+$";
			});

			likeOperators.forEach(function(operator){
				result += '|';
				result += "^" + relation + Or + "(" + attributes + ")" + operator + ".+$";
			});

			inOperator.forEach(function(operator){
				result += '|';
				result += "^" + relation + Or + "(" + attributes + ")" + operator + ".+$";
			});

			btwOperator.forEach(function(operator){
				result += '|';
				result += "^" + relation + Or + "(" + attributes + ")" + operator + ".+$";
			});

			nullOperator.forEach(function(operator){
				result += '|';
				result += "^" + relation + Or + "(" + attributes + ")" + operator + "$";
			});
		});

		return new RegExp(result);
	},

// STRING admitted in with FILTER Through Table Attributes filter
	withThroughFilterRegExp: (schema) => {
		let result = '/[]/';
		let attributes = '';

		Object.keys(schema.associations).map((rel) => {
			let relation = schema.associations[rel];
			let targetModel = relation.target;

			if (relation.associationType === 'BelongsToMany') {

				if (result === '/[]/') {
					result = '';
				} else {
					result += '|';
				}

				let model = relation.throughModel;
				let sourceModelName = '{' + rel + '}';

				Object.keys(model.attributes).map((attr, index) => {
					if (index > 0) {
						attributes += '|'
					}
					attributes += '{' + attr + '}';
				});

				nestedOperators.forEach(function (operator, index) {
					if (index > 0) {
						result += '|';
					}
					result += "^" + sourceModelName + Or + "(" + attributes + ")" + operator + ".+$";
				});

				likeOperators.forEach(function (operator) {
					result += '|';
					result += "^" + sourceModelName + Or + "(" + attributes + ")" + operator + ".+$";
				});

				inOperator.forEach(function (operator) {
					result += '|';
					result += "^" + sourceModelName + Or + "(" + attributes + ")" + operator + ".+$";
				});

				btwOperator.forEach(function (operator) {
					result += '|';
					result += "^" + sourceModelName + Or + "(" + attributes + ")" + operator + ".+$";
				});

				nullOperator.forEach(function (operator) {
					result += '|';
					result += "^" + sourceModelName + Or + "(" + attributes + ")" + operator + "$";
				});
			}

			// Second Level!!
			Object.keys(targetModel.associations).map((rel2Level) => {
				let relation = targetModel.associations[rel2Level];

				if (relation.associationType === 'BelongsToMany') {

					if (result === '/[]/') {
						result = '';
					} else {
						result += '|';
					}

					let model = relation.throughModel;
					let sourceModelName = '{' + rel + '.' + rel2Level + '}';

					Object.keys(model.attributes).map((attr, index) => {
						if (index > 0) {
							attributes += '|'
						}
						attributes += '{' + attr + '}';
					});

					nestedOperators.forEach(function (operator, index) {
						if (index > 0) {
							result += '|';
						}
						result += "^" + sourceModelName + Or + "(" + attributes + ")" + operator + ".+$";
					});

					likeOperators.forEach(function (operator) {
						result += '|';
						result += "^" + sourceModelName + Or + "(" + attributes + ")" + operator + ".+$";
					});

					inOperator.forEach(function (operator) {
						result += '|';
						result += "^" + sourceModelName + Or + "(" + attributes + ")" + operator + ".+$";
					});

					btwOperator.forEach(function (operator) {
						result += '|';
						result += "^" + sourceModelName + Or + "(" + attributes + ")" + operator + ".+$";
					});

					nullOperator.forEach(function (operator) {
						result += '|';
						result += "^" + sourceModelName + Or + "(" + attributes + ")" + operator + "$";
					});
				}
			});
		});

		return new RegExp(result);
	},
};


module.exports = ValidationBase;