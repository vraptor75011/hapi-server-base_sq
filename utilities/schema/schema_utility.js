const DB = require('../../config/sequelize');
const Pluralize = require('pluralize');
const _ = require('lodash');

//HELPER to get array of relations from a schema

const SchemaUtility = {
	relationFromSchema: (schema, level) => {
		let relations = [];

		Object.keys(schema.associations).map((rel) => {
			let relModel = {};
			let localExclusion = [rel];

			if (schema.sequelize.models[Pluralize.singular(rel)]) {
				relModel = schema.sequelize.models[Pluralize.singular(rel)];
			} else if (schema.sequelize.models[rel]) {
				relModel = schema.sequelize.models[rel];
			}

			relations.push({name: rel, model: relModel.name});

			if (level === 2) {
				Object.keys(relModel.associations).map((relOfRel) => {
					if (!_.includes(localExclusion, relOfRel)) {
						if (schema.sequelize.models[Pluralize.singular(relOfRel)]) {
							relModel = schema.sequelize.models[Pluralize.singular(relOfRel)];
						} else if (schema.sequelize.models[relOfRel]) {
							relModel = schema.sequelize.models[relOfRel];
						}

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

		Object.keys(schema.associations).map((rel) => {
			let relModel = {};
			let localExclusion = [rel];

			if (schema.sequelize.models[Pluralize.singular(rel)]) {
				relModel = schema.sequelize.models[Pluralize.singular(rel)];
			} else if (schema.sequelize.models[rel]) {
				relModel = schema.sequelize.models[rel];
			}

			if (startLevel === 1) {
				relationsArray.push(rel);
			}

			if (endLevel === 2) {
				Object.keys(relModel.associations).map((relOfRel) => {
					if (!_.includes(localExclusion, relOfRel)) {
						if (schema.sequelize.models[Pluralize.singular(relOfRel)]) {
							relModel = schema.sequelize.models[Pluralize.singular(relOfRel)];
						} else if (schema.sequelize.models[relOfRel]) {
							relModel = schema.sequelize.models[relOfRel];
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