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
	 * Adds an association to a document
	 * @param ownerModel: The model that is being added to.
	 * @param ownerId: The id of the owner document.
	 * @param childModel: The model that is being added.
	 * @param childId: The id of the child document.
	 * @param associationName: The name of the association from the ownerModel's perspective.
	 * @param payload: Either an id or an object containing an id and extra linking-model fields.
	 * @param Log: A logging object
	 * @returns {object} A promise returning true if the add succeeds.
	 */
	addOne: _addOne,

	/**
	 * Removes an association object from a document
	 * @param ownerModel: The model that is being removed from.
	 * @param ownerId: The id of the owner document.
	 * @param childModel: The model that is being removed.
	 * @param childId: The id of the child document.
	 * @param associationName: The name of the association from the ownerModel's perspective.
	 * @returns {object} A promise returning true if the remove succeeds.
	 */
	removeOne: _removeOne,

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

		pages.total = Math.ceil(filteredCount / query.$pageSize);
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
 * Adds one persisted association to a document
 * @param ownerModel: The model that is being added to.
 * @param ownerId: The id of the owner document.
 * @param childModel: The model that is being added.
 * @param childId: The Child Model id
 * @param associationName: The name of the association from the ownerModel's perspective.
 * @returns {object} A promise returning true if the add succeeds.
 * @private
 */
async function _addOne(ownerModel, ownerId, childModel, childId, associationName) {
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
			let payload = {};
			payload['ids'] = [childId];
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
 * Removes an association from a document
 * @param ownerModel: The model that is being removed from.
 * @param ownerId: The id of the owner document.
 * @param childModel: The model that is being removed.
 * @param childId: The id of the child document.
 * @param associationName: The name of the association from the ownerModel's perspective.
 * @param payload: The payload request
 * @returns {object} A promise returning true if the remove succeeds.
 * @private
 */
async function _removeOne(ownerModel, ownerId, childModel, childId, associationName, payload) {
	try {
		let sequelizeQuery = {where: {id: ownerId}};
		let ownerObject = await ownerModel.findOne(sequelizeQuery);
		let result;
		if (!payload) {
			payload = {};
		}

		if (ownerObject) {
			result = await _removeAssociation(ownerModel, ownerId, childModel, childId, associationName, payload);
			if (result.errors) {
				let error = Boom.badRequest(result);
				error.output.payload['sql validation'] = {message: error.original.message};
				error.reformat();
				return error;
			} else {
				return true;
			}
		}	else {
			let error = {type: ErrorHelper.types.NOT_FOUND};
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
		let sequelizeQuery = {where: {id: ownerId}};
		let ownerObject = await ownerModel.findOne(sequelizeQuery);
		let ids;
		let result;

		if (!payload) {
			payload = {};
		} else {
			ids = payload.$ids
		}

		if (ownerObject) {
			result = await _removeAssociation(ownerModel, ownerId, childModel, ids, associationName, payload);
			if (result.errors) {
				let error = Boom.badRequest(result);
				error.output.payload['sql validation'] = {message: error.original.message};
				error.reformat();
				return error;
			} else {
				return true;
			}
		}	else {
			let error = {type: ErrorHelper.types.NOT_FOUND};
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
 * @returns {object} A promise for the resulting model documents or the count of the query results.
 * @private
 */
async function _getAll(ownerModel, ownerId, childModel, associationName, query) {
	try {
		let sequelizeQuery = {where: {id: ownerId}};
		sequelizeQuery = queryWithDeleted({}, sequelizeQuery, ownerModel);
		sequelizeQuery = queryAttributes({}, sequelizeQuery, ownerModel);
		let ownerObject = await ownerModel.findOne(sequelizeQuery);
		let realQuery = {};
		let result;

		Object.keys(query).map((param) => {
			if (_.includes(param, associationName + '.')) {
				let realParam = param.replace(associationName + '.', '');
				realQuery[realParam] = query[param];
			}
		});

		if (ownerObject) {
			let relation = ownerModel.associations[associationName];
			let model = relation.target;
			if (relation.associationType === 'BelongsTo' || relation.associationType === 'hasOne') {
				let queryRest = queryFilteredRest(realQuery, model);
				sequelizeQuery = QueryHelper.createSequelizeFilter(model, queryRest, {});
				sequelizeQuery = queryWithDeleted(realQuery, sequelizeQuery, model);
				sequelizeQuery = queryAttributes(realQuery, sequelizeQuery, model);
				let action = 'get'+_.upperFirst(associationName);
				result = await ownerObject[action](sequelizeQuery);
			} else if (relation.associationType === 'BelongsToMany' || relation.associationType === 'hasMany') {
				sequelizeQuery = {};
				let totalCount;
				let filteredCount;
				totalCount = await model.count(sequelizeQuery);

				if (realQuery.$count) {
					let queryCount = queryFilteredCount(realQuery, model);
					sequelizeQuery = QueryHelper.createSequelizeFilter(model, queryCount, sequelizeQuery);
					filteredCount = await model.count(sequelizeQuery);

					result = {
						total: totalCount,
						filtered: filteredCount,
					};
				} else if (realQuery.$min || realQuery.$max || realQuery.$sum) {
					let queryCount = queryFilteredCount(realQuery, model);
					sequelizeQuery = QueryHelper.createSequelizeFilter(model, queryCount, sequelizeQuery);
					filteredCount = await model.count(sequelizeQuery);

					let queryMath = queryFilteredMath(realQuery, model);
					let attr = QueryHelper.createSequelizeFilter(model, queryMath, '');

					if (realQuery.$min) {
						let min = await model.min(attr, sequelizeQuery);

						result = {
							total: totalCount,
							filtered: filteredCount,
							min: min,
						};
					}

					if (realQuery.$max) {
						let max = await model.max(attr, sequelizeQuery);

						result = {
							total: totalCount,
							filtered: filteredCount,
							max: max,
						};
					}

					if (realQuery.$sum) {
						let sum = await model.sum(attr, sequelizeQuery);

						result = {
							total: totalCount,
							filtered: filteredCount,
							sum: sum,
						};
					}
				} else {
					let queryCount = queryFilteredCount(realQuery, model);
					sequelizeQuery = QueryHelper.createSequelizeFilter(model, queryCount, sequelizeQuery);
					filteredCount = await model.count(sequelizeQuery);

					// 3) Query findAll record with all URL query params
					let queryPagination = queryFilteredPagination(realQuery, model);
					let querySort = queryFilteredSort(realQuery, model);
					let queryRest = queryFilteredRest(realQuery, model);
					let queryInclude = _.assign({}, queryPagination, querySort, queryRest);
					sequelizeQuery = QueryHelper.createSequelizeFilter(model, queryInclude, sequelizeQuery);
					sequelizeQuery = queryWithDeleted(realQuery, sequelizeQuery, model);
					sequelizeQuery = queryAttributes(realQuery, sequelizeQuery, model);

					let action = 'get'+_.upperFirst(associationName);
					let childDocs = await ownerObject[action](sequelizeQuery);

					const pages = {
						current: realQuery.$page || 1,
						prev: 0,
						hasPrev: false,
						next: 0,
						hasNext: false,
						total: 0
					};
					const items = {
						total: totalCount,
						filtered: filteredCount,
						page: realQuery.$page,
						pageSize: realQuery.$pageSize,
					};

					pages.total = Math.ceil(filteredCount / realQuery.$pageSize);
					pages.next = pages.current + 1;
					pages.hasNext = pages.next <= pages.total;
					pages.prev = pages.current - 1;
					pages.hasPrev = pages.prev !== 0;
					// FindALL response
					result = {items: items, pages: pages, docs: childDocs};
				}


			}

			if (result.errors) {
				let error = Boom.badRequest(result);
				error.output.payload['sql validation'] = {message: error.original.message};
				error.reformat();
				return error;
			} else {
				return {doc: ownerObject, [associationName]: result};
			}
		}	else {
			let error = {type: ErrorHelper.types.NOT_FOUND};
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
		let targetModels;
		if (payload.ids) {
			targetModels = payload.ids;
		} else if (payload[associationName]) {
			if (!_.isArray(payload[associationName])) {
				payload[associationName] = [payload[associationName]];
			}
			targetModels = await childModel.bulkCreate(payload.childModel, {transaction: t});
		}

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
 * Remove an association instance between two resources
 * @param ownerModel
 * @param ownerId
 * @param childModel
 * @param childId
 * @param associationName
 * @param payload
 * @returns {*|promise}
 * @private
 */
async function _removeAssociation(ownerModel, ownerId, childModel, childId, associationName, payload) {
	//Transaction
	const t = await DB.sequelize.transaction();

	try {
		let result;
		let ownerObject = await ownerModel.findById(ownerId);
		if (!_.isArray(childId)) {
			childId = [childId];
		}
		let relation = ownerModel.associations[associationName];
		let foreignKey = relation.foreignKey;

		if (relation.associationType === 'HasMany') {
			// Destroy all hasMany side objects: 1 -> N, Destroy all N objects
			let sequelizeQuery = {where: {id: {[Op.in]: childId}, [foreignKey]: {[Op.eq]: ownerId}}};
			sequelizeQuery = queryWithDeleted(payload, sequelizeQuery, childModel);
			result = await childModel.destroy(sequelizeQuery);
		} else if (relation.associationType === 'BelongsToMany') {
			// Destroy all through table instances of belongsToMany: 1 -> N <- 1, Destroy all N row in the table.
			let action = 'remove'+_.upperFirst(associationName);
			result = await ownerObject[action](childId, {transaction: t});
		}

		if (result) {
			await t.commit();
			return true;
		} else {
			await t.rollback();
			let error = {type: ErrorHelper.types.BAD_REQUEST };
			error.message = 'Impossible to remove ' + childModel.name + 'from: ' + ownerObject.id;
			return ErrorHelper.formatResponse(error);
		}
	} catch(error) {
		await t.rollback();
		Log.apiLogger.error(Chalk.red(error));
		return error;
	}
}

/**
 * This function is called from handler helper to clean the query URL preparing it to
 * the sequelizeQuery for count (SQL query) with filter and relations filter
 * @param query: the query URL from the request
 * @param model: the model to build the filter list
 * @returns {{}}: managed query URL to Sequelize query
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
 * @returns {{}}: managed query URL to Sequelize query
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
 * @returns {{}}: managed query URL to Sequelize query
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
 * @returns {{}}: managed query URL to Sequelize query
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
 * @returns {{}}: managed query URL to Sequelize query
 * @private
 */
function queryFilteredRest(query, model) {
	let filtersList = ModelValidation(model).filters;
	let extraList = ModelValidation(model).extra;
	let relatedList = ModelValidation(model).related;
	let fieldsList = ModelValidation(model).fields;

	const queryResponse = {};

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
 * @returns {{}}: managed sequelize query string
 * @private
 */
function queryWithDeleted(query, sequelizeQuery, model) {
	if (query.$withDeleted === true || query.$hardDelete === true) {
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
 * @returns {{}}: managed sequelize query string
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