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

			if (DB.sequelize.models[Pluralize.singular(rel)]) {
				relModel = DB.sequelize.models[Pluralize.singular(rel)];
			} else if (DB.sequelize.models[rel]) {
				relModel = DB.sequelize.models[rel];
			}

			relations.push({name: rel, model: relModel.name});

			if (level === 2) {
				Object.keys(relModel.associations).map((relOfRel) => {
					if (!_.includes(localExclusion, relOfRel)) {
						if (DB.sequelize.models[Pluralize.singular(relOfRel)]) {
							relModel = DB.sequelize.models[Pluralize.singular(relOfRel)];
						} else if (DB.sequelize.models[relOfRel]) {
							relModel = DB.sequelize.models[relOfRel];
						}

						relations.push({name: rel + '.' + relOfRel, model: relModel.name});
					}
				});
			}

		});

		return relations;
	},
};

module.exports = SchemaUtility;