const _ = require('lodash');


// Operation permitted in query URL
// Everyone can do with prefix {not} or {or}
const numberOperators = ['{=}', '{<}', '{<=}', '{>}', '{>=}', '{<>}'];
const stringOperators = ['{=}', '{like}'];
const nestedOperators = ['{=}', '{<}', '{<=}', '{>}', '{>=}', '{<>}', '{like}'];
const inOperator = ['{in}'];
const btwOperator = ['{btw}'];
const nullOperator = ['{null}'];

// For the RegExp
const OrOrNot = '(?:{not}|{or})?';
let intNumber = "[1-9]{1}[0-9]{0,6}";                                // From 1 to 9.999.999
let floatNumber = "[-+]?([0]|[1-9]{1}[0-9]{0,6})(\.[0-9]{1,6})?";    // From -9,999,999.999,999 to [+]9,999,999.999,999
let username = "([a-zA-Z0-9]+[_.-]?)*[a-zA-Z0-9]";                   // alt(a-zA-Z0-9||_.-) always ends with a-zA-Z0-9 no max length
let password = "^[a-zA-Z0-9àèéìòù\.\,\;\:\-\_\|@&%$]{3,}$";
let pwdRegExp = new RegExp(password);
let email = '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"' +
	'(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")' +
	'@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|' +
	'\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|' +
	'[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]' +
	'|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])';                        // Email
let datetime = '([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?'; // Datetime for DB ex: 2017-08-15 10:00:00


const ValidationBase = {
	// STRING admitted in Filter types Integer, String, Date
	filterRegExp: (type) => {
		let result = '';

		nestedOperators.forEach(function(operator, index){
			if (index > 0) {
				result += '|';
			}
			if (operator === '{=}') {
				result += "^" + OrOrNot + "(?:" + operator + ")?.+$";
			} else {
				result += "^" + OrOrNot + operator + ".+$";
			}
		});

		inOperator.forEach(function(operator){
			result += '|';
			result += "^" + OrOrNot + operator + ".+$";
		});

		btwOperator.forEach(function(operator){
			result += '|';
			result += "^" + OrOrNot + operator + ".+$";
		});

		nullOperator.forEach(function(operator){
			result += '|';
			result += "^" + OrOrNot + operator + "$";
		});

		return new RegExp(result);
	},

	// STRING admitted in withRelated for relations
	withRelatedRegExp: (schema) => {
		let result = '';
		let relations = '(';
		schema.relations.forEach(function(rel, index){
			if (index > 0) {
				relations += '|';
			}
			relations += rel.name;
			rel.relations().forEach(function(relOfReal){
				relations += '|';
				relations += rel.name+'.'+relOfReal.name;
			});
		});
		relations += ')';

		result += "^" + relations + "$";

		return new RegExp(result);
	},

	// STRING admitted in Field for all Attributes
	fieldRegExp: (schema) => {
		let result = '';
		let columns = '(';

		schema.attributes.forEach(function(attr, index){
			if (index > 0) {
				columns += '|';
			}
			columns += attr.name;
		});
		columns += ')';

		let prefix = '(?:{' + schema.name + '})?';

		result += "^" + prefix + columns + "(," + columns + ")*$";

		return new RegExp(result);
	},

	// STRING admitted in with Related Field for all Relationships
	withRelatedFieldRegExp: (schema) => {
		let result = '';

		schema.relations.forEach(function(rel, index){
			let columns = '(';
			rel.attributes().forEach(function(attr, index){
				if (index > 0) {
					columns += '|';
				}
				columns += attr.name;
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

	// STRING admitted in Sort Attributes
	sortRegExp: (schema) => {
		let result = '';
		let columns = '(';

		schema.attributes.forEach(function(attr, index){
			if (index > 0) {
				columns += '|';
			}
			columns += attr.name;
		});
		columns += ')';

		let prefix = '(?:{' + schema.name + '})?';
		let direction = '(?:(\\+|\\-))?';

		result += "^" + prefix + direction + columns + "(," + direction + columns + ")*$";

		return new RegExp(result);
	},

	// STRING for with SORT
	withSortRegExp: (schema) => {
		let result = '';

		schema.relations.forEach(function(rel, index){
			let columns = '(';
			rel.attributes().forEach(function(attr, index){
				if (index > 0) {
					columns += '|';
				}
				columns += attr.name;
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
		let result = '';
		let attributes = '';
		schema.relations.forEach(function(rel, index){
			let relation = '{' + rel.name + '}';
			rel.attributes().forEach(function(attr, index){
				if (index > 0) {
					attributes += '|'
				}
				attributes += '{' + attr.name + '}';
			});

			if (index > 0) {
				result += '|';
			}
			nestedOperators.forEach(function(operator, index){
				if (index > 0) {
					result += '|';
				}
				result += "^" + relation + OrOrNot + "(" + attributes + ")" + operator + ".+$";
			});

			inOperator.forEach(function(operator){
				result += '|';
				result += "^" + relation + OrOrNot + "(" + attributes + ")" + operator + ".+$";
			});

			btwOperator.forEach(function(operator){
				result += '|';
				result += "^" + relation + OrOrNot + "(" + attributes + ")" + operator + ".+$";
			});

			nullOperator.forEach(function(operator){
				result += '|';
				result += "^" + relation + OrOrNot + "(" + attributes + ")" + operator + "$";
			});
		});

		return new RegExp(result);
	},
};



module.exports = ValidationBase;