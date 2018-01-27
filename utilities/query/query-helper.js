const _ = require('lodash');
const Assert = require("assert");
// var validationHelper = require("./validation-helper");
// var qs = require('qs');
const Extend = require('util')._extend;
// let globals = require('../components/globals');
const DB = require('../../config/sequelize');
const SchemaUtility = require('../schema/schema_helper');
const HandlerBase = require('../handler/handler-base');
const Log = require('../logging/logging');
const ModelValidation = require('../validation/model_validations');

//TODO-DONE: mulit-level/multi-priority sorting (i.e. sort first by lastName, then by firstName) implemented via comma seperated sort list
//TODO: sorting through populate fields (Ex: sort users through role.name)
//TODO: support selecting populated fields
//TODO: support $embed for quick embedding and "populate" for detailed, mongoose specific population
//TODO-DONE: $term search
//TODO-DONE: support mongoose $text search
//TODO: support searching populated fields
//TODO: support easy AND and OR operations (i.e. search for "foo" AND "bar" or "foo" OR "bar"
//TODO: possibly support both comma separated values and space separated values
//TODO: define field property options (queryable, exclude, etc).
//TODO-DONE: support "$where" field that allows for raw mongoose queries
//TODO: query validation for $where field
//TODO: enable/disable option for $where field
//TODO: populating "implied" associations through $embed property, EX:
/**
 facilitiesPerFloor: [[{
      type: Types.ObjectId,
      ref: "facility"
    }]]
 */
//TODO: support parallel embeds, Ex: { $embed: ['facilitiesPerFloor.categories','facilitiesPerFloor.items'] } //NOTE: this seems to work for some queries
//TODO: support field queries for "null" and "undefined"

module.exports = {
	/**
	 * Create a sequelize string for query based off of the request query
	 * @param model: A sequelize model object.
	 * @param query: The incoming request query.
	 * @param sequelizeQuery: A string for sequelize query.
	 * @returns {*}: A modified string for sequelize query.
	 */
	createSequelizeFilter: function (model, query, sequelizeQuery) {
		// validationHelper.validateModel(model, Log);
		//(email == 'test@user.com' && (firstName == 'test2@user.com' || firstName == 'test4@user.com')) && (age < 15 || age > 30)
		//LITERAL
		//{
		//  and: {
		//    email: {
		//      equal: 'test@user.com',
		//    },
		//    or: {
		//      firstName: {
		//        equal: ['test2@user.com', 'test4@user.com']
		//      }
		//    },
		//    age: {
		//      gt: '15',
		//      lt: '30'
		//    }
		//  }
		//{
		// and[email][equal]=test@user.com&and[or][firstName][equal]=test2@user.com&and[or][firstName][equal]=test4@user.com&and[age][gt]=15
		//ABBREVIATED
		//{
		//  email:'test@user.com',
		//  firstName: ['test2@user.com', 'test4@user.com'],
		//  age: {
		//    $or: {
		//      $gt: '15',
		//      $lt: '30'
		//    }
		//  }
		//}
		// [email]=test@user.com&[firstName]=test2@user.com&[firstName]=test4@user.com&[age][gt]=15&[age][lt]=30


		delete query[""]; //EXPL: hack due to bug in hapi-swagger-docs

		delete query.$count;

		// requestData.queryData.fields = ['id'];

		let filtersQuery = ModelValidation(model).filters;
		let sortQuery = ModelValidation(model).sort;
		let mathQuery = ModelValidation(model).math;
		let fieldsQuery = ModelValidation(model).fields;
		let relatedQuery = ModelValidation(model).withRelated;
		let relFieldsQuery = ModelValidation(model).withRelFields;
		let relFiltersQuery = ModelValidation(model).withRelFilters;
		let relCountQuery = ModelValidation(model).withRelCount;
		let relSortQuery = ModelValidation(model).withRelSort;
		let fields4Select = ModelValidation(model).fields4Select;
		let extraQuery = _.assign({}, fieldsQuery, fields4Select, relatedQuery, relFieldsQuery, relFiltersQuery, relCountQuery, relSortQuery);

		Object.keys(query).map((e) => {
			// Filters
			if (_.has(filtersQuery, e)) {
				if (!_.isArray(query[e])) {
					let tmp = [];
					tmp.push(query[e]);
					query[e] = tmp;
				}
				sequelizeQuery = HandlerBase.filterParser(sequelizeQuery, e, query[e], model);
			}

			if (_.has(sortQuery, e)) {
				if (_.isString(query[e])) {
					let tmp = [];
					tmp.push(query[e]);
					query[e] = tmp;
				}
				sequelizeQuery = HandlerBase.sortParser(sequelizeQuery, query[e], model);
			}
			//
			// MATH Operations
			if (_.has(mathQuery, e)) {
				sequelizeQuery = HandlerBase.mathParser(sequelizeQuery, e, query[e], model);
			}
			//
			// Extra
			if (_.has(extraQuery, e)) {
				if (!_.isArray(query[e])) {
					let tmp = [];
					tmp.push(query[e]);
					query[e] = tmp;
				}
				sequelizeQuery = HandlerBase.extraParser(sequelizeQuery, e, query[e], model);
			}
		});

		// let found = false;
		// Object.keys(attributesList).map((attr) => {
		// 	if (_.includes(sequelizeQuery.attributes, attr)) {
		// 		found = true;
		// 	}
		// });
		//
		// if (found === false) {
		// 	sequelizeQuery.attributes = attributesArray;
		// }
		//
		//
		// if (Object.keys(error).length > 0) {
		// 	return reply(Boom.badRequest(requestData.queryData.error.message));
		// } else {
		// 	// Pagination
		if (query.$page && query.$pageSize) {
			let page = parseInt(query['$page']) || 1;
			let pageSize = parseInt(query['$pageSize']) || 10;
			sequelizeQuery.offset = pageSize * (page - 1);
			sequelizeQuery.limit = pageSize;
			Log.apiLogger.info('RequestData: ' + JSON.stringify(sequelizeQuery));
		}

		// }

		return sequelizeQuery;

	},

	/**
	 * Get a list of fields that can be returned as part of a query result.
	 * @param model: A mongoose model object.
	 * @param Log: A logging object.
	 * @returns {Array}: A list of fields.
	 */
	getReadableFields: function (model, Log) {
		validationHelper.validateModel(model, Log);

		var readableFields = [];

		var fields = model.schema.paths;

		for (var fieldName in fields) {
			var field = fields[fieldName].options;
			if (!field.exclude && fieldName !== "__v") {
				readableFields.push(fieldName);
			}
		}

		return readableFields;
	},

	/**
	 * Get a list of valid query sort inputs.
	 * @param model: A mongoose model object.
	 * @param Log: A logging object.
	 * @returns {Array}: A list of fields.
	 */
	getSortableFields: function (model, Log) {
		validationHelper.validateModel(model, Log);

		var sortableFields = this.getReadableFields(model, Log);

		for (var i = sortableFields.length-1; i >= 0; i--) {
			var descendingField = "-" + sortableFields[i];
			sortableFields.splice(i,0,descendingField);
		}

		return sortableFields;
	},

	/**
	 * Get a list of fields that can be queried against.
	 * @param model: A mongoose model object.
	 * @param Log: A logging object.
	 * @returns {Array}: A list of fields.
	 */
	getQueryableFields: function (model, Log) {
		validationHelper.validateModel(model, Log);

		var queryableFields = [];

		var fields = model.schema.paths;
		var fieldNames = Object.keys(fields);

		var associations = model.routeOptions ? model.routeOptions.associations : null;

		for (var i = 0; i < fieldNames.length; i++) {
			var fieldName = fieldNames[i];
			if (fields[fieldName] && fieldName !== "__v" && fieldName !== "__t") {
				var field = fields[fieldName].options;
				var association = associations ? (associations[fields[fieldName].path] || {}) : {};

				//EXPL: by default we don't include MANY_MANY array references
				if (field.queryable !== false && !field.exclude && association.type !== "MANY_MANY") {
					queryableFields.push(fieldName);
				}
			}
		}

		return queryableFields;
	},

	getStringFields: function (model, Log) {
		validationHelper.validateModel(model, Log);

		var stringFields = [];

		var fields = model.schema.paths;

		for (var fieldName in fields) {
			var field = fields[fieldName].options;
			if (field.type.schemaName === "String") {
				stringFields.push(fieldName);
			}
		}

		return stringFields;
	},

	/**
	 * Handle pagination for the query if needed.
	 * @param query: The incoming request query.
	 * @param mongooseQuery: A mongoose query.
	 * @returns {*}: The updated mongoose query.
	 */
	paginate: function(query, mongooseQuery) {
		if (query.$page) {
			mongooseQuery = this.setPage(query, mongooseQuery);
		}
		else {
			mongooseQuery = this.setSkip(query, mongooseQuery);
		}

		mongooseQuery = this.setLimit(query, mongooseQuery);

		return mongooseQuery;
	},

	/**
	 * Set the skip amount for the mongoose query. Typically used for paging.
	 * @param query: The incoming request query.
	 * @param mongooseQuery: A mongoose query.
	 * @param Log: A logging object.
	 * @returns {*}: The updated mongoose query.
	 */
	setSkip: function (query, mongooseQuery) {
		if (query.skip) {
			mongooseQuery.skip(query.$skip);
		}
		return mongooseQuery;
	},

	/**
	 * Set the page for the mongoose query. Typically used for paging.
	 * @param query: The incoming request query.
	 * @param mongooseQuery: A mongoose query.
	 * @returns {*}: The updated mongoose query.
	 */
	setPage: function (query, mongooseQuery) {
		if (query.$page) {
			mongooseQuery.skip((query.$page - 1) * query.$pageSize);
		}
		return mongooseQuery;
	},

	/**
	 * Set the limit amount for the mongoose query. Typically used for paging.
	 * @param query: The incoming request query.
	 * @param mongooseQuery: A mongoose query.
	 * @returns {*}: The updated mongoose query.
	 */
	setLimit: function (query, mongooseQuery) {
		//TODO: possible default limit of 20?
		if (query.$pageSize) {
			mongooseQuery.limit(query.$pageSize);
		}
		return mongooseQuery;
	},

	/**
	 * Set the list of objectIds to exclude.
	 * @param query: The incoming request query.
	 * @param mongooseQuery: A mongoose query.
	 * @returns {*}: The updated mongoose query.
	 */
	setExclude: function (query, mongooseQuery) {
		if (query.$exclude) {

			if (!Array.isArray(query.$exclude)) {
				query.$exclude = query.$exclude.split(",");
			}

			mongooseQuery.where({'_id': { $nin: query.$exclude}});
			delete query.$exclude;
		}
		return mongooseQuery;
	},

	/**
	 * Perform a regex search on the models immediate fields
	 * @param query:The incoming request query.
	 * @param model: A mongoose model object
	 */
	setTermSearch: function(query, model) {
		if (query.$term) {
			query.$or = [];//TODO: allow option to choose ANDing or ORing of searchFields/queryableFields
			var queryableFields = this.getQueryableFields(model, Log);
			var stringFields = this.getStringFields(model, Log);

			//EXPL: we can only search fields that are a string type
			queryableFields = queryableFields.filter(function(field) {
				return stringFields.indexOf(field) > -1;
			});

			//EXPL: search only specified fields if included
			if (query.$searchFields) {
				if (!Array.isArray(query.$searchFields)) {
					query.$searchFields = query.$searchFields.split(",");
				}

				//EXPL: we can only search fields that are a string type
				query.$searchFields = query.$searchFields.filter(function(field) {
					return stringFields.indexOf(field) > -1;
				});

				query.$searchFields.forEach(function(field) {
					var obj = {};
					obj[field] = new RegExp(query.$term, "i");
					query.$or.push(obj);
				});
			}
			else {
				queryableFields.forEach(function(field) {
					var obj = {};
					obj[field] = new RegExp(query.$term, "i");
					query.$or.push(obj);
				});
			}
		}

		delete query.$searchFields;
		delete query.$term;
	},

	/**
	 * Converts the query "$embed" parameter into a mongoose populate object.
	 * Relies heavily on the recursive "nestPopulate" method.
	 * @param query: The incoming request query.
	 * @param mongooseQuery: A mongoose query.
	 * @param attributesFilter: A filter that lists the fields to be returned.
	 * Must be updated to include the newly embedded fields.
	 * @param model: A Mongoose model.
	 * @returns {{mongooseQuery: *, attributesFilter: *}}: The updated mongooseQuery and attributesFilter.
	 */
	populateEmbeddedDocs: function (query, mongooseQuery, attributesFilter, model) {
		if (query.$withRelated) {
			if (!Array.isArray(query.$withRelated)) {
				query.$withRelated = query.$withRelated.split(",");
			}
			query.$withRelated.forEach(function(embed) {
				let embeds = embed.split(".");
				let populate = {};

				populate = nestPopulate(query, populate, 0, embeds, model);

				mongooseQuery.populate(populate);

				attributesFilter = attributesFilter + ' ' + embeds[0];
			});
			delete query.$withRelated;
			delete query.$populateSelect;
		}
		return { mongooseQuery: mongooseQuery, attributesFilter: attributesFilter };
	},

	/**
	 * Set the sort priority for the mongoose query.
	 * @param query: The incoming request query.
	 * @param mongooseQuery: A mongoose query.
	 * @returns {*}: The updated mongoose query.
	 */
	setSort: function (query, mongooseQuery) {
		if (query.$sort) {
			if (Array.isArray(query.$sort)) {
				query.$sort = query.$sort.join(' ');
			}
			mongooseQuery.sort(query.$sort);
			delete query.$sort;
		}
		return mongooseQuery;
	},

	/**
	 * Create a list of selected fields to be returned based on the '$select' query property.
	 * @param query: The incoming request query.
	 * @param model: A mongoose model object.
	 * @returns {string}
	 */
	createAttributesFilter: function (query, model) {
		let attributesFilter = [];
		let fields = model.attributes;
		let fieldNames = [];

		if (query.$select) {
			if (!Array.isArray(query.$select)) {
				query.$select = query.$select.split(",");
			}
			fieldNames = query.$select;
		} else {
			fieldNames = Object.keys(fields)
		}

		fieldNames.forEach((attr) => {
			let attribute = fields[attr];
			let skip = attribute.exclude || false;
			if (!skip) {
				attributesFilter.push(attr);
			}
		});

		// for (let i = 0; i < fieldNames.length; i++) {
		// 	let fieldName = fieldNames[i];
		// 	if (fields[fieldName] && fieldName !== "__v") {
		// 		let field = fields[fieldName];
		// 		let association = _.includes(relations, fieldName);
		//
		// 		//EXPL: by default we don't include MANY_MANY array references
		// 		if (!field.exclude && (!association || query.$select)) {
		// 			attributesFilter.push(fieldName);
		// 		}
		// 	}
		// }

		delete query.$select;
		return attributesFilter.toString().replace(/,/g,' ');
	},

};

/**
 * Takes an embed string and recursively constructs a mongoose populate object.
 * @param query: The incoming request query.
 * @param populate: The populate object to be constructed/extended.
 * @param index: The current index of the "embeds" array.
 * @param embeds: An array of strings representing nested fields to be populated.
 * @param associations: The current model associations.
 * @param model: A Mongoose model.
 * @returns {*}: The updated populate object.
 */
function nestPopulate(query, populate, index, embeds, model) {
	let embed = embeds[index];
	let associations = SchemaUtility.relationFromSchema(model, 2);
	let association = {};

	associations.forEach(function(rel){
		if (rel.name === embed) {
			association = rel;
		}
	});


	if (!association) {
		association = getReference(model, embed);
		if (!association) {
			throw "Association not found.";
		}
	}

	let populatePath = "";
	let select = "";
	if (query.$populateSelect) {
		select = query.$populateSelect.replace(/,/g,' ') + " _id";
	}
	else {
		select = module.exports.createAttributesFilter({}, DB.models[association.model]);
	}

	if (association.type === "MANY_MANY") {
		populatePath = embed + '.' + association.model;
	}
	else {
		populatePath = embed;
	}

	if (index < embeds.length - 1) {

		// associations = association.include.model.routeOptions.associations;
		populate = nestPopulate(query, populate, index + 1, embeds, DB.models[association.model]);
		populate.populate = Extend({}, populate);//EXPL: prevent circular reference
		populate.path = populatePath;

		if (associations[embeds[index + 1]] && associations[embeds[index + 1]].type === "MANY_MANY") {
			populate.select = select + " " + populate.populate.path + ' ' + embeds[index + 1];//EXPL: have to add the path and the next embed to the select to include nested MANY_MANY embeds
		}
		else {
			populate.select = select + " " + populate.populate.path;//EXPL: have to add the path to the select to include nested ONE_MANY embeds
		}

		populate.model = association.model;

		return populate;
	}
	else {

		populate.path = populatePath;
		populate.select = select;
		populate.model = association.model;

		return populate;
	}
}

/**
 * Creates an association object from a model property if the property is a reference id
 * @param model
 * @param embed
 * @param Log
 * @returns {*} The association object or null if no reference is found
 */
function getReference(model, embed, Log) {
	let property = model.schema.obj[embed];
	while (_.isArray(property)) {
		property = property[0];
	}
	if (property && property.ref) {
		return { model: property.ref, include: { model: globals.mongoose.model(property.ref), as: embed }  }
	}
	else {
		return null;
	}
}

function tryParseJSON(jsonString) {
	try {
		var o = JSON.parse(jsonString);

		if (o && typeof o === "object") {
			return o;
		}
	}
	catch (e) { }

	return false;
}