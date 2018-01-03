const DB = require('../../config/sequelize');
const Pluralize = require('pluralize');
const _ = require('lodash');

//HELPER to get array of relations from a schema

const SchemaUtility = {
	relationFromSchema: (schema, level) => {
		let models = schema.sequelize.models;
		let relations = [];

		Object.keys(schema.associations).map((rel) => {
			let relModel = {};
			let localExclusion = [rel];

			if (models[Pluralize.singular(rel)]) {
				relModel = models[Pluralize.singular(rel)];
			} else if (models[rel]) {
				relModel = models[rel];
			}

			relations.push({name: rel, model: relModel.name});

			if (level === 2) {
				Object.keys(relModel.associations).map((relOfRel) => {
					if (!_.includes(localExclusion, relOfRel)) {
						if (models[Pluralize.singular(relOfRel)]) {
							relModel = models[Pluralize.singular(relOfRel)];
						} else if (models[relOfRel]) {
							relModel = models[relOfRel];
						}

						relations.push({name: rel + '.' + relOfRel, model: relModel.name});
					}
				});
			}

		});

		return relations;
	},

	relationsFromSchema: (schema, startLevel, endLevel) => {
		let models = schema.sequelize.models;
		let relationsArray = [];
		let relations = '';

		Object.keys(schema.associations).map((rel) => {
			let relModel = {};
			let localExclusion = [rel];

			if (models[Pluralize.singular(rel)]) {
				relModel = models[Pluralize.singular(rel)];
			} else if (models[rel]) {
				relModel = models[rel];
			}

			if (startLevel === 1) {
				relationsArray.push(rel);
			}

			if (endLevel === 2) {
				Object.keys(relModel.associations).map((relOfRel) => {
					if (!_.includes(localExclusion, relOfRel)) {
						if (models[Pluralize.singular(relOfRel)]) {
							relModel = models[Pluralize.singular(relOfRel)];
						} else if (models[relOfRel]) {
							relModel = models[relOfRel];
						}

						relationsArray.push(rel + '.' + relOfRel);

					}
				});
			}

		});

		relationsArray = _.sortedUniq(relationsArray);
		relations += _.join(relationsArray, ', ');

		return relations;
	},
};

module.exports = SchemaUtility;