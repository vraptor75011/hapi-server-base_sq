const DB = require('../../config/sequelize');
const Pluralize = require('pluralize');
const _ = require('lodash');

//HELPER to get array of relations from a schema

const SchemaUtility = {
	relationFromSchema: (schema, level) => {
		let relations = [];
		let exclusion = [schema.name];

		Object.keys(schema.associations).map((rel) => {
			let relation1L = schema.associations[rel];
			let relModel = relation1L.target;

			relations.push({name: rel, model: relModel.name});

			if (level === 2) {
				Object.keys(relation1L.target.associations).map((relOfRel) => {
					if (!_.includes(exclusion, relOfRel)) {
						let relation2L = relation1L.target.associations[relOfRel];
						let relModel = relation2L.target;
						relations.push({name: rel + '.' + relOfRel, model: relModel.name});
					}
				});
			}

		});

		return relations;
	},

	relationsFromSchema: (schema, startLevel, endLevel) => {
		let relationsArray = [];
		let relations = '';
		let exclusion = [schema.name];

		Object.keys(schema.associations).map((rel) => {
			let relation1L = schema.associations[rel];
			let localRelation = rel + ' [' + relation1L.associationType + ']';

			if (startLevel === 1) {
				relationsArray.push(localRelation);
			}

			if (endLevel === 2) {
				Object.keys(relation1L.target.associations).map((relOfRel) => {
					if (!_.includes(exclusion, relOfRel)) {
						let relation2L = relation1L.target.associations[relOfRel];
						let localRelation = relOfRel + ' [' + relation2L.associationType + ']';
						relationsArray.push(rel + '.' + localRelation);
					}
				});
			}

		});

		relationsArray = _.sortedUniq(relationsArray);
		relations += _.join(relationsArray, ', ');

		return relations;
	},

	/**
	 * Create a list of model attributes.
	 * @param model: A mongoose model object.
	 * @returns {string}
	 */
	createAttributesList: (model) => {
		let attributesFilter = [];
		let fields = model.attributes;

		let fieldNames = Object.keys(fields);

		fieldNames.forEach((attr) => {
			let attribute = fields[attr];
			let skip = attribute.exclude || false;
			if (!skip) {
				attributesFilter.push(attr);
			}
		});

		return _.join(attributesFilter, ', ');
	},

	/**
	 * Create a array of model attributes.
	 * @param model: A mongoose model object.
	 * @returns {Array}
	 */
	createAttributesArray: (model) => {
		let attributesFilter = [];
		let fields = model.attributes;

		let fieldNames = Object.keys(fields);

		fieldNames.forEach((attr) => {
			let attribute = fields[attr];
			let skip = attribute.exclude || false;
			if (!skip) {
				attributesFilter.push(attr);
			}
		});

		return attributesFilter;
	}
};

module.exports = SchemaUtility;