// const QueryHelper = require('./query-helper');
const Q = require('q');
// var errorHelper = require('./error-helper');
// var extend = require('util')._extend;
// var config = require('../config');
const Boom = require('boom');
const  _ = require('lodash');
const Chalk = require('chalk');
const Sequelize = require('sequelize');
const DB = require('../../config/sequelize');
const ErrorHelper = require('../error/error-helper');
const Log = require('../logging/logging');
const QueryHelper = require('../query/query-helper');
const ModelValidation = require('../validation/model_validations');

const Op = Sequelize.Op;

//TODO: add a "clean" method that clears out all soft-deleted docs
//TODO: add an optional TTL config setting that determines how long soft-deleted docs remain in the system
//TODO: possibly remove "MANY_ONE" association and make it implied
//TODO: possibly remove "ONE_ONE" association and make it implied

module.exports = {

	/**
	 * Finds a list of model documents
	 * @param model: A sequelize model.
	 * @param query: URL query parameters to be converted to a sequelize query.
	 * @param Log: A logging object.
	 * @returns {object} A promise for the resulting model documents.
	 */
	list: _list,

	/**
	 * Finds a model document
	 * @param model: A mongoose model.
	 * @param _id: The document id.
	 * @param query: rest-hapi query parameters to be converted to a mongoose query.
	 * @param Log: A logging object.
	 * @returns {object} A promise for the resulting model document.
	 */
	find: _find,

	/**
	 * Creates a model document
	 * @param model: A mongoose model.
	 * @param payload: Data used to create the model document.
	 * @param Log: A logging object.
	 * @returns {object} A promise for the resulting model document.
	 */
	create: _create,

	/**
	 * Updates a model document
	 * @param model: A mongoose model.
	 * @param _id: The document id.
	 * @param payload: Data used to update the model document.
	 * @param Log: A logging object.
	 * @returns {object} A promise for the resulting model document.
	 */
	update: _update,

	/**
	 * Deletes a model document
	 * @param model: A mongoose model.
	 * @param _id: The document id.
	 * @param payload: Data used to determine a soft or hard delete.
	 * @param Log: A logging object.
	 * @returns {object} A promise returning true if the delete succeeds.
	 */
	deleteOne: _deleteOne,

	/**
	 * Deletes multiple documents
	 * @param model: A mongoose model.
	 * @param payload: Either an array of ids or an array of objects containing an id and a "hardDelete" flag.
	 * @param Log: A logging object.
	 * @returns {object} A promise returning true if the delete succeeds.
	 */
	deleteMany: _deleteMany,


	/**
	 * Adds multiple associations to a document
	 * @param ownerModel: The model that is being added to.
	 * @param ownerId: The id of the owner document.
	 * @param childModel: The model that is being added.
	 * @param associationName: The name of the association from the ownerModel's perspective.
	 * @param payload: Either a list of ids or a list of id's along with extra linking-model fields.
	 * @param Log: A logging object
	 * @returns {object} A promise returning true if the add succeeds.
	 */
	addMany: _addMany,

	/**
	 * Removes multiple associations from a document
	 * @param ownerModel: The model that is being removed from.
	 * @param ownerId: The id of the owner document.
	 * @param childModel: The model that is being removed.
	 * @param associationName: The name of the association from the ownerModel's perspective.
	 * @param payload: A list of ids
	 * @param Log: A logging object
	 * @returns {object} A promise returning true if the remove succeeds.
	 */
	removeMany: _removeMany,

	/**
	 * Get all of the associations for a document
	 * @param ownerModel: The model that is being added to.
	 * @param ownerId: The id of the owner document.
	 * @param childModel: The model that is being added.
	 * @param associationName: The name of the association from the ownerModel's perspective.
	 * @param query: rest-hapi query parameters to be converted to a mongoose query.
	 * @param Log: A logging object
	 * @returns {object} A promise returning true if the add succeeds.
	 * @private
	 */
	getAll: _getAll

};


/**
 * Finds a list of model documents
 * @param model: A Sequelize model.
 * @param query: A URL query string to building a Sequelize query.
 * @returns {object} A promise for the resulting model documents (or the count) of the query results.
 * @private
 */
async function _list(model, query) {
	try {
		let sequelizeQuery = {};
		let count = "";
		let result;

		let totalCount;
		let filteredCount;

		// First Query count everything
		totalCount = await model.count(sequelizeQuery);

		// Second Query
		// 2a) QUERY count with $filters and $withFilters
		// Greatest priority!!!
		// Only the right URL query params will use to building the Seq. query string
		if (query.$count) {
			let queryCount = queryFilteredCount(query, model);
			sequelizeQuery = QueryHelper.createSequelizeFilter(model, queryCount, sequelizeQuery);
			filteredCount = await model.count(sequelizeQuery);

			const items = {
				total: totalCount,
				filtered: filteredCount,
			};
			//COUNT response
			return {items: items};
		}

		// 2b) QUERY for Math operation
		// Second priority, with order: min, max, sum.
		// Only the right URL query params will use to building the Seq. query string
		if (query.$min || query.$max || query.$sum) {
			// 2b) Count the with $filters and $withFilters
			let queryCount = queryFilteredCount(query, model);
			sequelizeQuery = QueryHelper.createSequelizeFilter(model, queryCount, sequelizeQuery);
			filteredCount = await model.count(sequelizeQuery);

			// 3a) Query find MIN with all URL query params
			let queryMath = queryFilteredMath(query, model);
			let attr = QueryHelper.createSequelizeFilter(model, queryMath, '');
			if (query.$min) {
				result = await model.min(attr, sequelizeQuery);

				const items = {
					total: totalCount,
					filtered: filteredCount,
					min: result,
				};
				//MIN response
				return {items: items};

			}

			// 3b) Query find MAX with all URL query params
			if (query.$max) {
				result = await model.max(attr, sequelizeQuery);

				const items = {
					total: totalCount,
					filtered: filteredCount,
					max: result,
				};
				//MAX response
				return {items: items};

			}

			// 3c) Query find SUM with all URL query params
			if (query.$sum) {
				result = await model.sum(attr, sequelizeQuery);

				const items = {
					total: totalCount,
					filtered: filteredCount,
					sum: result,
				};
				//SUM response
				return {items: items};

			}
		}

		// 2c) QUERY for all the rest
		// Lower priority, with filter, pagination, sort and relations.
		// Only the right URL query params will use to building the Seq. query string
		let queryCount = queryFilteredCount(query, model);
		sequelizeQuery = QueryHelper.createSequelizeFilter(model, queryCount, sequelizeQuery);
		filteredCount = await model.count(sequelizeQuery);

		// 3) Query findAll record with all URL query params
		let queryPagination = queryFilteredPagination(query, model);
		let querySort = queryFilteredSort(query, model);
		let queryRest = queryFilteredRest(query, model);
		let queryInclude = _.assign({}, queryPagination, querySort, queryRest);
		sequelizeQuery = QueryHelper.createSequelizeFilter(model, queryInclude, sequelizeQuery);
		sequelizeQuery = queryWithDeleted(query, sequelizeQuery, model);
		sequelizeQuery = queryAttributes(query, sequelizeQuery, model);
		result = await model.findAll(sequelizeQuery);

		const pages = {
			current: query.$page || 1,
			prev: 0,
			hasPrev: false,
			next: 0,
			hasNext: false,
			total: 0
		};
		const items = {
			total: totalCount,
			filtered: filteredCount,
			page: query.$page,
			pageSize: query.$pageSize,
		};

		pages.total = Math.ceil(count / query.$pageSize);
		pages.next = pages.current + 1;
		pages.hasNext = pages.next <= pages.total;
		pages.prev = pages.current - 1;
		pages.hasPrev = pages.prev !== 0;
		// FindALL response
		return {items: items, pages: pages, docs: result};

	}	catch(error) {
		Log.apiLogger.error(Chalk.red(error));
		error = {type: ErrorHelper.types.BAD_IMPLEMENTATION };
		return ErrorHelper.formatResponse(error);
	}
}

/**
 * Finds a model document
 * @param model: A sequelize model.
 * @param id: The document id.
 * @param query: A URL query string to building a Sequelize query.
 * @returns {object} A promise for the resulting model document.
 * @private
 */
async function _find(model, id, query) {
	try {
		let error, result;
		let sequelizeQuery = {where: {id: id}};
		sequelizeQuery = QueryHelper.createSequelizeFilter(model, query, sequelizeQuery);
		sequelizeQuery = queryWithDeleted(query, sequelizeQuery, model);
		sequelizeQuery = queryAttributes(query, sequelizeQuery, model);
		result = await model.findOne(sequelizeQuery);
		if (result){
			return {doc: result}
		} else if (error) {
			// let error = {type: ErrorHelper.types.BAD_REQUEST };
			return ErrorHelper.formatResponse(error);
		} else {
			let error = {type: ErrorHelper.types.NOT_FOUND };
			error.message = model.name + ' id: ' + id + ' not present';
			return ErrorHelper.formatResponse(error);
		}
	}

	catch(error) {
		Log.apiLogger.error(Chalk.red(error));
		error = {type: ErrorHelper.types.BAD_IMPLEMENTATION };
		return ErrorHelper.formatResponse(error);
	}

}

/**
 * Creates a model document in DB
 * @param model: A sequelize model.
 * @param payload: Data (single or array) used to create the document pre validated.
 * @returns {object} A promise for the resulting model document.
 * @private
 */
async function _create(model, payload) {
	try {
		let result;
		let query = {$withRelated: []};
		let payloadOption = {};
		if (!_.isArray(payload)) {
			payload = [payload];
		}

		payload.forEach((instance) => {
			Object.keys(model.associations).map((rel) => {
				if (_.has(instance, rel)) {
					query.$withRelated.push(rel);
				}
			});
			payloadOption = QueryHelper.createSequelizeFilter(model, query, {});
		});

		result = await model.create(payload, payloadOption);
		if (result) {
			return {doc: result};
		} else {
			let error = {type: ErrorHelper.types.SERVER_TIMEOUT};
			error.message = model.name + ' impossible to save';
			return ErrorHelper.formatResponse(error);
		}
	}
	catch(error) {
		Log.apiLogger.error(Chalk.red(error));
		error = {type: ErrorHelper.types.BAD_IMPLEMENTATION };
		return ErrorHelper.formatResponse(error);
	}
}

/**
 * Updates a model document
 * @param model: A sequelize model.
 * @param id: The document id.
 * @param payload: Data used to update the model document.
 * @returns {object} A promise for the resulting model document updated.
 * @private
 */
async function _update(model, id, payload) {
	try {
		let result;
		let sequelizeQuery = {where: {id: id}};

		result = await model.update(payload, sequelizeQuery);
		if (result) {
			return {doc: result};
		} else {
			let error = {type: ErrorHelper.types.SERVER_TIMEOUT};
			error.message = model.name + ' impossible to update';
			return ErrorHelper.formatResponse(error);
		}
	}	catch(error) {
		Log.apiLogger.error(Chalk.red(error));
		error = {type: ErrorHelper.types.BAD_IMPLEMENTATION };
		return ErrorHelper.formatResponse(error);
	}
}

/**
 * Deletes a model document from DB. Default: SoftDeleted
 * @param model: A sequelize model.
 * @param id: The document id.
 * @param payload: Body object with $hardDeleted flag.
 * @returns {object} A promise returning true if the delete succeeds.
 * @private
 */
async function _deleteOne(model, id, payload) {
	try {
		let sequelizeQuery = {where: {id: id}};
		let result;

		sequelizeQuery = queryWithDeleted(payload, sequelizeQuery, model);
		result = await model.destroy(sequelizeQuery);
		if (result){
			return true;
		} else {
			let error = {type: ErrorHelper.types.NOT_FOUND };
			error.message = model.name + ' id: ' + id + ' not present';
			return ErrorHelper.formatResponse(error);
		}

	} catch(error) {
		Log.apiLogger.error(Chalk.red(error));
		error = {type: ErrorHelper.types.BAD_IMPLEMENTATION };
		return ErrorHelper.formatResponse(error);
	}
}

/**
 * Deletes multiple documents from DB. hardDeleted default: false
 * @param model: A sequelize model.
 * @param payload: an array of ids and a "hardDelete" flag.
 * @returns {object} A promise returning true if the delete succeeds.
 * @private
 */
async function _deleteMany(model, payload) {
	try {
		let sequelizeQuery = {where: {id: {[Op.in]: payload.$ids}}};
		let result;

		sequelizeQuery = queryWithDeleted(payload, sequelizeQuery, model);
		result = await model.destroy(sequelizeQuery);
		if (result){
			return true;
		} else {
			let error = {type: ErrorHelper.types.NOT_FOUND };
			error.message = model.name + ' ids: ' + payload.$ids + ' not deleted';
			return ErrorHelper.formatResponse(error);
		}

	} catch(error) {
		Log.apiLogger.error(Chalk.red(error));
		error = {type: ErrorHelper.types.BAD_IMPLEMENTATION };
		return ErrorHelper.formatResponse(error);
	}
}

/**
 * Adds one or more association (new object childModel) to an persisted owner document
 * @param ownerModel: The model that is being added to.
 * @param ownerId: The id of the owner document.
 * @param childModel: The model that is being added.
 * @param associationName: The name of the association from the ownerModel's perspective.
 * @param payload: An object containing an extra linking-model fields. Only for belongsToMany.
 * @returns {object} A promise returning the child object just added if the add succeeds.
 * @private
 */
async function _addMany(ownerModel, ownerId, childModel, associationName, payload) {
	try {
		let ownerObject;
		let result;
		ownerObject = await ownerModel.findOne({
			where: {'id': ownerId },
			include: [{
				model: childModel,
			}]
		});
		if (ownerObject) {
			if (!payload) {
				payload = {};
			}
			result = await _setAssociation(ownerObject, childModel, associationName, payload);
			if (result.errors) {
				let error = Boom.badRequest(result);
				error.output.payload['sql validation'] = {message: error.original.message};
				error.reformat();
				return error;
			} else {
				return {doc: result};
			}
		}	else {
			let error = {type: ErrorHelper.types.NOT_FOUND };
			error.message = ownerModel.name + ' id: ' + ownerId + ' not found';
			return ErrorHelper.formatResponse(error);
		}
	} catch(error) {
		Log.apiLogger.error(Chalk.red(error));
		error = {type: ErrorHelper.types.BAD_IMPLEMENTATION};
		return ErrorHelper.formatResponse(error);
	}
}


/**
 * Removes multiple associations from a document
 * @param ownerModel: The model that is being removed from.
 * @param ownerId: The id of the owner document.
 * @param childModel: The model that is being removed.
 * @param associationName: The name of the association from the ownerModel's perspective.
 * @param payload: A list of ids
 * @returns {object} A promise returning true if the remove succeeds.
 * @private
 */
async function _removeMany(ownerModel, ownerId, childModel, associationName, payload) {
	try {
        let ownerObject;
        let result;
        ownerObject = await ownerModel.findOne({
            where: {'id': ownerId },
            include: [{
                model: childModel,
            }]
        });

        if (ownerObject) {
            if (!payload) {
                payload = {};
            }
            result = await _removeAssociation(ownerObject, childModel, associationName, payload);
            if (result.errors) {
                let error = Boom.badRequest(result);
                error.output.payload['sql validation'] = {message: error.original.message};
                error.reformat();
                return error;
            } else {
                return {doc: result};
            }
        } else {
            let error = {type: ErrorHelper.types.NOT_FOUND };
            error.message = ownerModel.name + ' id: ' + ownerId + ' not found';
            return ErrorHelper.formatResponse(error);
        }
    } catch(error) {
        Log.apiLogger.error(Chalk.red(error));
        error = {type: ErrorHelper.types.BAD_IMPLEMENTATION};
        return ErrorHelper.formatResponse(error);
    }
}

/**
 * Get all of the associations for a document
 * @param ownerModel: The model that is being added to.
 * @param ownerId: The id of the owner document.
 * @param childModel: The model that is being added.
 * @param associationName: The name of the association from the ownerModel's perspective.
 * @param query: rest-hapi query parameters to be converted to a mongoose query.
 * @param Log: A logging object
 * @returns {object} A promise for the resulting model documents or the count of the query results.
 * @private
 */
function _getAll(ownerModel, ownerId, childModel, associationName, query, Log) {
	try {

		var association = ownerModel.routeOptions.associations[associationName];
		var foreignField = association.foreignField;

		var ownerRequest = { query: {} };
		ownerRequest.query.$embed = associationName;
		ownerRequest.query.populateSelect = "_id";
		if (foreignField) {
			ownerRequest.query.populateSelect = ownerRequest.query.populateSelect + "," + foreignField;
		}

		//EXPL: In order to allow for fully querying against the association data, we first embed the
		//associations to get a list of _ids and extra fields. We then leverage _list
		//to perform the full query.  Finally the extra fields (if they exist) are added to the final result
		var mongooseQuery = ownerModel.findOne({ '_id': ownerId });
		mongooseQuery = QueryHelper.createMongooseQuery(ownerModel, ownerRequest.query, mongooseQuery, Log);
		return mongooseQuery.exec()
			.then(function (result) {
				result = result[associationName];
				var childIds = [];
				var many_many = false;
				if (association.type === "MANY_MANY") {
					childIds = result.map(function(object) {
						return object[association.model]._id;
					});
					many_many = true;
				}
				else {
					childIds = result.map(function(object) {
						return object._id;
					});
				}

				query.$where = extend({'_id': { $in: childIds }}, query.$where);

				var promise = _list(childModel, query, Log);

				if (many_many && association.linkingModel) {//EXPL: we have to manually insert the extra fields into the result
					var extraFieldData = result;
					return promise
						.then(function(result) {
							if (_.isArray(result.docs)) {
								result.docs.forEach(function(object) {
									var data = extraFieldData.find(function(data) {
										return data[association.model]._id.toString() === object._id
									});
									var fields = data.toJSON();
									delete fields._id;
									delete fields[association.model];
									object[association.linkingModel] = fields;
								});
							}

							return result;
						})
						.catch(function (error) {
							const message = "There was an error processing the request.";
							errorHelper.handleError(error, message, errorHelper.types.BAD_REQUEST, Log);
						});
				}
				else {
					return promise
						.then(function(result) {
							return result;
						})
						.catch(function (error) {
							const message = "There was an error processing the request.";
							errorHelper.handleError(error, message, errorHelper.types.BAD_REQUEST, Log);
						});
				}
			});
	}
	catch(error) {
		const message = "There was an error processing the request.";
		try {
			errorHelper.handleError(error, message, errorHelper.types.BAD_REQUEST, Log)
		}
		catch(error) {
			return Q.reject(error);
		}
	}
}

/**
 * Create an association instance between ownerObject Model instance and array Children Model
 * @param ownerObject
 * @param childModel
 * @param associationName
 * @param payload
 * @returns {*|promise}
 * @private
 */
async function _setAssociation(ownerObject, childModel, associationName, payload) {
	//Transaction
	const t = await DB.sequelize.transaction();

	try {
		let result;
		let targetModels = await childModel.bulkCreate(payload.childModel, {transaction: t});

		let action = 'add'+_.upperFirst(associationName);
		result = await ownerObject[action](targetModels, {transaction: t});
		if (result) {
			let action = 'get'+_.upperFirst(associationName);
			let response = await ownerObject[action]({transaction: t});
			await t.commit();
			return response;
		} else {
			await t.rollback();
			let error = {type: ErrorHelper.types.BAD_REQUEST };
			error.message = 'Impossible to add ' + childModel.name + 'for: ' + ownerObject.id;
			return ErrorHelper.formatResponse(error);
		}
	} catch(error) {
		await t.rollback();
		Log.apiLogger.error(Chalk.red(error));
		return error;
	}

}

/**
 * Remove related association instances from an owner object
 * @param ownerObject
 * @param childModel
 * @param associationName
 * @param payload: the Ids array to remove
 * @returns {*|promise}
 * @private
 */
async function _removeAssociation(ownerObject, childModel, associationName, payload) {
    //Transaction
    const t = await DB.sequelize.transaction();

    try {
        let action = 'remove'+_.upperFirst(associationName);
        let result = await ownerObject[action](payload.childModelIds, {transaction: t});
        if (result) {
            await t.commit();
            return true;
        } else {
            await t.rollback();
            let error = {type: ErrorHelper.types.BAD_REQUEST };
            error.message = 'Impossible to remove ' + childModel.name + 'for: ' + ownerObject.id;
            return ErrorHelper.formatResponse(error);
        }
    } catch(error) {
        await t.rollback();
        Log.apiLogger.error(Chalk.red(error));
        return error;
    }
}

/**
 * This function is called after embedded associations have been populated so that any associations
 * that have been soft deleted are removed.
 * @param result: the object that is being inspected
 * @param parent: the parent of the result object
 * @param parentkey: the parents key for the result object
 * @param depth: the current recursion depth
 * @param Log: a logging object
 * @returns {boolean}: returns false if the result object should be removed from the parent
 * @private
 */
function filterDeletedEmbeds(result, parent, parentkey, depth, Log) {
	if (_.isArray(result)) {
		result = result.filter(function(obj) {
			var keep = filterDeletedEmbeds(obj, result, parentkey, depth + 1, Log);
			// Log.log("KEEP:", keep);
			return keep;
		});
		// Log.log("UPDATED:", parentkey);
		// Log.note("AFTER:", result);
		parent[parentkey] = result;
	}
	else {
		for (var key in result) {
			// Log.debug("KEY:", key);
			// Log.debug("VALUE:", result[key]);
			if (_.isArray(result[key])) {
				// Log.log("JUMPING IN ARRAY");
				filterDeletedEmbeds(result[key], result, key, depth + 1, Log);
			}
			else if (_.isObject(result[key]) && result[key]._id) {
				// Log.log("JUMPING IN OBJECT");
				var keep = filterDeletedEmbeds(result[key], result, key, depth + 1, Log);
				if (!keep) {
					return false;
				}
			}
			else if (key === 'isDeleted' && result[key] === true && depth > 0) {
				// Log.log("DELETED", depth);
				return false;
			}
		}
		// Log.log("JUMPING OUT");
		return true;
	}
}

/**
 * This function is called from handler helper to clean the query URL preparing it to
 * the sequelizeQuery for count (SQL query) with filter and relations filter
 * @param query: the query URL from the request
 * @param model: the model to build the filter list
 * @returns {string}: managed query URL to Sequelize query
 * @private
 */
function queryFilteredCount(query, model) {
	let filtersList = ModelValidation(model).filters;
	let queryResponse = {};

	Object.keys(filtersList).map((key) => {
		if (_.has(query, key)) {
			_.set(queryResponse, key, query[key]);
		}
	});
	if (_.has(query, '$withFilter')) {
		_.set(queryResponse, '$withFilter', query['$withFilter']);
	}

	return queryResponse;
}

/**
 * This function is called from handler helper to clean the query URL preparing it to
 * the sequelizeQuery for math operations (SQL query) with math operators
 * @param query: the query URL from the request
 * @param model: the model to build the filter list
 * @returns {string}: managed query URL to Sequelize query
 * @private
 */
function queryFilteredMath(query, model) {
	let mathList = ModelValidation(model).math;
	let queryResponse = {};

	Object.keys(mathList).map((key) => {
		if (_.has(query, key)) {
			_.set(queryResponse, key, query[key]);
		}
	});

	return queryResponse;
}

/**
 * This function is called from handler helper to clean the query URL preparing it to
 * the sequelizeQuery for pagination operations (SQL query) with limit e offset
 * @param query: the query URL from the request
 * @param model: the model to build the filter list
 * @returns {string}: managed query URL to Sequelize query
 * @private
 */
function queryFilteredPagination(query, model) {
	let paginationList = ModelValidation(model).pagination;
	let queryResponse = {};

	Object.keys(paginationList).map((key) => {
		if (_.has(query, key)) {
			_.set(queryResponse, key, query[key]);
		}
	});

	return queryResponse;
}

/**
 * This function is called from handler helper to clean the query URL preparing it to
 * the sequelizeQuery for sorting documents (SQL query
 * @param query: the query URL from the request
 * @param model: the model to build the filter list
 * @returns {string}: managed query URL to Sequelize query
 * @private
 */
function queryFilteredSort(query, model) {
	let sortList = ModelValidation(model).sort;
	let queryResponse = {};

	Object.keys(sortList).map((key) => {
		if (_.has(query, key)) {
			_.set(queryResponse, key, query[key]);
		}
	});

	return queryResponse;
}

/**
 * This function is called from handler helper to clean the query URL preparing it to
 * the sequelizeQuery for math operations (SQL query) with sort
 * @param query: the query URL from the request
 * @param model: the model to build the filter list
 * @returns {string}: managed query URL to Sequelize query
 * @private
 */
function queryFilteredRest(query, model) {
	let filtersList = ModelValidation(model).filters;
	let extraList = ModelValidation(model).extra;
	let relatedList = ModelValidation(model).related;
	let fieldsList = ModelValidation(model).fields;

	let queryResponse = {};

	Object.keys(filtersList).map((key) => {
		if (_.has(query, key)) {
			_.set(queryResponse, key, query[key]);
		}
	});
	Object.keys(extraList).map((key) => {
		if (_.has(query, key)) {
			_.set(queryResponse, key, query[key]);
		}
	});
	Object.keys(relatedList).map((key) => {
		if (_.has(query, key)) {
			_.set(queryResponse, key, query[key]);
		}
	});
	Object.keys(fieldsList).map((key) => {
		if (_.has(query, key)) {
			_.set(queryResponse, key, query[key]);
		}
	});

	return queryResponse;
}

/**
 * This function is called from handler helper include the soft deleted records,
 * add paranoid option if required
 * @param query: the query URL from the request
 * @param sequelizeQuery: the sequelize query string
 * @param model: the model to build the filter list
 * @returns {string}: managed sequelize query string
 * @private
 */
function queryWithDeleted(query, sequelizeQuery, model) {
	if (query.$withDeleted === true || query.$hardDeleted === true) {
		sequelizeQuery['paranoid'] = false;
	}

	return sequelizeQuery;
}

/**
 * This function is called from handler helper include to manage the attributes return by query
 * add attributes if none is selected or added the excluded fields if request by query
 * @param query: the query URL from the request
 * @param sequelizeQuery: the sequelize query string
 * @param model: the model to build the filter list
 * @returns {string}: managed sequelize query string
 * @private
 */
function queryAttributes(query, sequelizeQuery, model) {
	let attributesList = ModelValidation(model).Attributes;
	let attributesArray = attributesList.split(', ');
	let excludedArray = [];

	if (!_.has(sequelizeQuery, 'attributes') ||
		(_.isArray(sequelizeQuery['attributes']) && sequelizeQuery['attributes'].length === 0)) {
		sequelizeQuery['attributes'] = attributesArray;
	} else if (sequelizeQuery['attributes'].length === 1 && _.isArray(sequelizeQuery['attributes'][0])) {
		sequelizeQuery['attributes'] = _.concat(attributesArray, sequelizeQuery['attributes']);
	}

	if (query.$withExcludedFields === true) {
		let fields = model.attributes;
		Object.keys(fields).map((attr) => {
			let attribute = fields[attr];
			if (attribute.exclude === true) {
				excludedArray.push(attr);
			}
		});
		sequelizeQuery.attributes = _.concat(sequelizeQuery.attributes, excludedArray);
	}

	return sequelizeQuery;
}