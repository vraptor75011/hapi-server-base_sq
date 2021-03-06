const Boom = require('boom');
const  _ = require('lodash');
const Sequelize = require('sequelize');
const DB = require('../../config/sequelize');
const ErrorHelper = require('../error/error-helper');
const { apiLogger, chalk } = require('../logging/logging');
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
	 * @param model: A Sequelize model.
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
	getAll: _getAll,

	/**
	 * Adding Reletions information for them pagination
	 * @param result: The query result.
	 * @param query: rest-hapi query parameters to be converted to a mongoose query.
	 * @param model: A Sequelize model.
	 * @returns {object} A result with relations pagination information
	 */
	result4Relations: _result4Relations,

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
		let nestedPages;

		let totalCount;
		let filteredCount;

		apiLogger.info('RequestData: ' + JSON.stringify(query));

		// First Query count everything
		let specialFilters = queryFilteredSpecial(query, model);
		sequelizeQuery = QueryHelper.createSequelizeFilter(model, specialFilters, sequelizeQuery);
		sequelizeQuery = queryWithDeleted(query, sequelizeQuery, model);
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
		let queryInclude = _.assign({}, querySort, queryRest);
		sequelizeQuery = QueryHelper.createSequelizeFilter(model, queryInclude, sequelizeQuery);
		sequelizeQuery = queryAttributes(query, sequelizeQuery, model);
		sequelizeQuery = QueryHelper.createSequelizeFilter(model, queryPagination, sequelizeQuery);
		result = await model.findAll(sequelizeQuery);

		// Building response
		const pages = {
			current: Number(query.$page) || 1,
			prev: 0,
			hasPrev: false,
			next: 0,
			hasNext: false,
			total: 0
		};
		const items = {
			total: totalCount,
			filtered: filteredCount,
			page: Number(query.$page),
			pageSize: Number(query.$pageSize),
		};

		pages.total = Math.ceil(filteredCount / Number(query.$pageSize));
		pages.next = pages.current + 1;
		pages.hasNext = pages.next <= pages.total;
		pages.prev = pages.current - 1;
		pages.hasPrev = pages.prev !== 0;


		// FindALL response
		return {items: items, pages: pages, nestedPages: {}, docs: result};

	}	catch(error) {
		apiLogger.error(chalk.red(error));
		let errorMsg = error.message || 'An error occurred';
		return Boom.badImplementation(errorMsg);
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
		apiLogger.info('RequestData: ' + JSON.stringify(query));
		result = await model.findOne(sequelizeQuery);
		if (!result) {
			let message = model.name + ' id: ' + id + ' not present';
			let data = {type: 'model.notFound', context: {model: model.name, value: id}};
			apiLogger.error(chalk.red(message));
			return Boom.notFound(message, data);
		} else if (result.errors) {
			error = Boom.badRequest(result);
			error.output.payload['sql validation'] = {message: error.original.message};
			error.reformat();
			return error;
		} else if (result) {
			return {nestedPages: {}, doc: result}
		}
	}	catch(error) {
		apiLogger.error(chalk.red(error));
		let errorMsg = error.message || 'An error occurred';
		return Boom.badImplementation(errorMsg);
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

		Object.keys(model.associations).map((rel) => {
			if (_.has(payload, rel)) {
				query.$withRelated.push(rel);
			}
		});

		let sequelizeQuery = QueryHelper.createSequelizeFilter(model, query, {});
		sequelizeQuery = queryAttributes({}, sequelizeQuery, model);

		apiLogger.info('Payload: ' + JSON.stringify(payload));
		result = await model.create(payload, sequelizeQuery);
		if (result) {
			//Delete excluded attributes
			Object.keys(model.attributes).map((attr) => {
				let attribute = model.attributes[attr];
				if (attribute.exclude) {
					delete result.dataValues[attr];
				}
			});
			return {doc: result};
		} else {
			let error = {};
			error.message = model.name + ' impossible to save';
			apiLogger.error(chalk.red(error));
			return Boom.badRequest(error);
		}
	}
	catch(error) {
		apiLogger.error(chalk.red(error));
		let errorMsg = error.message || 'An error occurred';
		return Boom.badImplementation(errorMsg);
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

		apiLogger.info('Payload: ' + JSON.stringify(payload));
		apiLogger.info('Id: ' + id);
		result = await model.update(payload, sequelizeQuery);
		if (result) {
			return {doc: result};
		} else {
			let error = {};
			error.message = model.name + ' impossible to update';
			apiLogger.error(chalk.red(error));
			return Boom.badRequest(error);
		}
	}	catch(error) {
		apiLogger.error(chalk.red(error));
		let errorMsg = error.message || 'An error occurred';
		return Boom.badImplementation(errorMsg);
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

		apiLogger.info('Payload: ' + JSON.stringify(payload));
		apiLogger.info('Id: ' + id);
		sequelizeQuery = queryWithDeleted(payload, sequelizeQuery, model);
		result = await model.destroy(sequelizeQuery);
		if (result){
			return true;
		} else {
			let message = model.name + ' id: ' + id + ' not present';
			let data = {type: 'model.notFound', context: {model: model.name, value: id}};
			apiLogger.error(chalk.red(message));
			return Boom.notFound(message, data);
		}

	} catch(error) {
		apiLogger.error(chalk.red(error));
		let errorMsg = error.message || 'An error occurred';
		return Boom.badImplementation(errorMsg);
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

		apiLogger.info('Payload: ' + JSON.stringify(payload));
		sequelizeQuery = queryWithDeleted(payload, sequelizeQuery, model);
		result = await model.destroy(sequelizeQuery);
		if (result){
			return true;
		} else {
			let message = model.name + ' id: ' + id + ' not present';
			let data = {type: 'model.notFound', context: {model: model.name, value: id}};
			apiLogger.error(chalk.red(message));
			return Boom.notFound(message, data);
		}

	} catch(error) {
		apiLogger.error(chalk.red(error));
		let errorMsg = error.message || 'An error occurred';
		return Boom.badImplementation(errorMsg);
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
			let message = ownerModel.name + ' id: ' + id + ' not present';
			let data = {type: 'model.notFound', context: {model: ownerModel.name, value: id}};
			apiLogger.error(chalk.red(message));
			return Boom.notFound(message, data);
		}
	} catch(error) {
		apiLogger.error(chalk.red(error));
		let errorMsg = error.message || 'An error occurred';
		return Boom.badImplementation(errorMsg);
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
			let message = ownerModel.name + ' id: ' + id + ' not present';
			let data = {type: 'model.notFound', context: {model: ownerModel.name, value: id}};
			apiLogger.error(chalk.red(message));
			return Boom.notFound(message, data);
		}
	} catch(error) {
		apiLogger.error(chalk.red(error));
		let errorMsg = error.message || 'An error occurred';
		return Boom.badImplementation(errorMsg);
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
		apiLogger.error(chalk.red(error));
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
			let message = ownerModel.name + ' id: ' + id + ' not present';
			let data = {type: 'model.notFound', context: {model: ownerModel.name, value: id}};
			apiLogger.error(chalk.red(message));
			return Boom.notFound(message, data);
		}
	} catch(error) {
		apiLogger.error(chalk.red(error));
		let errorMsg = error.message || 'An error occurred';
		return Boom.badImplementation(errorMsg);
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

		apiLogger.info('Query: ' + JSON.stringify(query));

		Object.keys(query).map((param) => {
			if (_.includes(param, associationName + '.')) {
				let realParam = param.replace(associationName + '.', '');
				realQuery[realParam] = query[param];
			}
		});

		if (ownerObject) {
			let relation = ownerModel.associations[associationName];
			let model = relation.target;
			if (relation.associationType === 'BelongsTo' || relation.associationType === 'HasOne') {
				let queryRest = queryFilteredRest(realQuery, model);
				sequelizeQuery = QueryHelper.createSequelizeFilter(model, queryRest, {});
				sequelizeQuery = queryWithDeleted(realQuery, sequelizeQuery, model);
				sequelizeQuery = queryAttributes(realQuery, sequelizeQuery, model);
				let action = 'get'+_.upperFirst(associationName);
				result = await ownerObject[action](sequelizeQuery);
			} else if (relation.associationType === 'BelongsToMany' || relation.associationType === 'HasMany') {
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
						current: Number(realQuery.$page) || 1,
						prev: 0,
						hasPrev: false,
						next: 0,
						hasNext: false,
						total: 0
					};
					const items = {
						total: totalCount,
						filtered: filteredCount,
						page: Number(realQuery.$page),
						pageSize: Number(realQuery.$pageSize),
					};

					pages.total = Math.ceil(filteredCount / Number(realQuery.$pageSize));
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
			let message = ownerModel.name + ' id: ' + id + ' not present';
			let data = {type: 'model.notFound', context: {model: ownerModel.name, value: id}};
			apiLogger.error(chalk.red(message));
			return Boom.notFound(message, data);
		}
	} catch(error) {
		apiLogger.error(chalk.red(error));
		let errorMsg = error.message || 'An error occurred';
		return Boom.badImplementation(errorMsg);
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
		apiLogger.info('Add: ' + JSON.stringify(targetModels));
		apiLogger.info('Payload: ' + JSON.stringify(payload));
		result = await ownerObject[action](targetModels, {transaction: t});
		if (result) {
			let action = 'get'+_.upperFirst(associationName);
			let response = await ownerObject[action]({transaction: t});
			await t.commit();
			return response;
		} else {
			await t.rollback();
			let error = {};
			error.message = 'Impossible to add ' + childModel.name + 'for: ' + ownerObject.id;
			apiLogger.error(chalk.red(error));
			return Boom.badRequest(error);
		}
	} catch(error) {
		await t.rollback();
		apiLogger.error(chalk.red(error));
		let errorMsg = error.message || 'An error occurred';
		return Boom.badImplementation(errorMsg);
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

		apiLogger.info('Remove: ' + JSON.stringify(childId));
		apiLogger.info('Payload: ' + JSON.stringify(payload));

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
			apiLogger.error(chalk.red(error));
			return Boom.badRequest(error);
		}
	} catch(error) {
		await t.rollback();
		apiLogger.error(chalk.red(error));
		let errorMsg = error.message || 'An error occurred';
		return Boom.badImplementation(errorMsg);
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
	let fullTextSearch = ModelValidation(model).fullTextSearch;
	let withRelFilters = ModelValidation(model).withRelFilters;
	let withDeleted = ModelValidation(model).softDeleted;
	let hardDelete = ModelValidation(model).hardDelete;
	let queryResponse = {};

	let queryOne = (_.assign({}, filtersList, fullTextSearch, withRelFilters, withDeleted, hardDelete));

	Object.keys(queryOne).map((key) => {
		if (_.has(query, key)) {
			_.set(queryResponse, key, query[key]);
		}
	});

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
function queryFilteredSpecial(query, model) {
	let specialList = ModelValidation(model).extendedFilters;
	let queryResponse = {};

	Object.keys(specialList).map((key) => {
		if (_.has(query['$special'], key)) {
			_.set(queryResponse, key, query['$special'][key]);
		}
	});

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
	let withPaginationList = ModelValidation(model).withPagination;
	let queryResponse = {};

	Object.keys(paginationList).map((key) => {
		if (_.has(query, key)) {
			_.set(queryResponse, key, query[key]);
		}
	});

	Object.keys(withPaginationList).map((key) => {
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
	let relatedList = ModelValidation(model).withRelated;
	let fullTextSearch = ModelValidation(model).fullTextSearch;
	let fieldsList = ModelValidation(model).fields;
	let withRelFields = ModelValidation(model).withRelFields;
	let withRelFilters = ModelValidation(model).withRelFilters;
	let withRelThroughFilters = ModelValidation(model).withRelThroughFilters;
	let withRelCount = ModelValidation(model).withRelCount;
	let withRelSort = ModelValidation(model).withRelSort;
	let fields4Select = ModelValidation(model).fields4Select;

	let queryAll = (_.assign({}, filtersList, fullTextSearch, relatedList, fieldsList, fields4Select,
		withRelFields, withRelFilters, withRelThroughFilters, withRelCount, withRelSort));

	const queryResponse = {};

	Object.keys(queryAll).map((key) => {
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
	let allAttributesList = ModelValidation(model).AllAttributes;
	let associationsArray = ModelValidation(model).RelationsArray;
	let attributesArray = attributesList.split(', ');
	let allAttributesArray = allAttributesList.split(', ');

	// Select Fields to pass in JSON
	if (_.has(query, '$fields') || _.has(query, '$fields4Select')) {
		let tmp = [];
		let queryFields = query['$fields'] || query['$fields4Select'];

		if (!_.isArray(queryFields)) {
			tmp = _.split(queryFields, ',');
		} else {
			tmp = queryFields;
		}

		tmp.forEach((col) => {
			col = _.replace(col, '{'+model.name+'}', '');
			if (query.$withExcludedFields === true && _.includes(allAttributesList, col)) {
				sequelizeQuery['attributes'].push(col);
			} else if (query.$withExcludedFields === false && _.includes(attributesList, col)) {
				sequelizeQuery['attributes'].push(col);
			} else if (_.includes(attributesList, col)) {
				sequelizeQuery['attributes'].push(col);
			}
		});
	} else {
		sequelizeQuery['attributes'] = sequelizeQuery.attributes || [];
		if (query.$withExcludedFields === true) {
			sequelizeQuery['attributes'].concat(allAttributesArray);
		} else {
			sequelizeQuery['attributes'] = _.union(sequelizeQuery['attributes'], attributesArray);
		}
	}

	// Select related fields to pass in JSON
	if (_.has(query, '$withFields')) {
		sequelizeQuery['include'] = sequelizeQuery.include || [];
		let relation = '';
		let prefix = '';

		let tmp = [];

		if (!_.isArray(query['$withFields'])) {
			tmp = _.split(query['$withFields'], ',');
		} else {
			tmp = query['$withFields'];
		}

		tmp.forEach((attr) => {
			associationsArray.forEach(function(rel){
				if (_.includes(attr, rel.name)) {
					relation = rel.name;
					prefix = '{' + relation + '}';
				}
			});

			let realValue = _.replace(attr, prefix, '');

			let includeLevel = sequelizeQuery.include;
			let schemaClone = _.clone(model);
			let relTree = _.split(relation,'.');
			relTree.forEach(function(levelRel, level){
				let targetAssociation = schemaClone.associations[levelRel];
				let targetModel = targetAssociation.target;
				let as = targetAssociation.as;

				if (!_.some(includeLevel, {model: targetModel, as: as}) && !_.some(includeLevel.include, {model: targetModel, as: as})) {
					if (level === 0) {
						let tmp = {};
						tmp.model = targetModel;
						tmp.as = as;
						includeLevel.push(tmp);
						includeLevel = tmp;
					} else if (level > 0) {
						if (!_.has(includeLevel, 'include')) {
							includeLevel['include'] = [];
						}
						if (!_.some(includeLevel['include'], {model: targetModel, as: as})) {
							let tmp = {};
							tmp.model = targetModel;
							tmp.as = as;
							includeLevel['include'].push(tmp);
							includeLevel = tmp;
						}
					}
				} else {
					if (!_.isArray(includeLevel)) {
						includeLevel = includeLevel.include;
					}
					includeLevel.forEach(function(include){
						if (_.includes(include, as)) {
							includeLevel = include;
						}
					});
				}
				schemaClone = targetModel;
			});

			let attributesList = ModelValidation(schemaClone).Attributes;
			let allAttributesList = ModelValidation(schemaClone).AllAttributes;

			let columns = _.split(realValue, ',');

			if (!_.has(includeLevel, 'attributes')) {
				includeLevel['attributes'] = [];
			}
			columns.forEach(function(col){
				if (query.$withRelExcludedFields === true && _.includes(allAttributesList, col)) {
					includeLevel['attributes'].push(col);
				} else if (query.$withExcludedFields === false && _.includes(attributesList, col)) {
					includeLevel['attributes'].push(col);
				}
			});
		});
	}

	if (_.has(query, '$withRelated')) {
		sequelizeQuery['include'] = sequelizeQuery.include || [];
		let tmp = [];

		if (!_.isArray(query['$withRelated'])) {
			tmp = _.split(query['$withRelated'], ',');
		} else {
			tmp = query['$withRelated'];
		}

		tmp.forEach((rel) => {
			let includeLevel = sequelizeQuery.include;
			let schemaClone = _.clone(model);
			let relTree = _.split(rel,'.');
			relTree.forEach(function(levelRel, level){
				let targetAssociation = schemaClone.associations[levelRel];
				let targetModel = targetAssociation.target;
				let as = targetAssociation.as;

				if (!_.some(includeLevel, {model: targetModel, as: as}) && !_.some(includeLevel.include, {model: targetModel, as: as})) {
					if (level === 0) {
						let tmp = {};
						tmp.model = targetModel;
						tmp.as = as;
						includeLevel.push(tmp);
						includeLevel = tmp;
					} else if (level > 0) {
						if (!_.has(includeLevel, 'include')) {
							includeLevel['include'] = [];
						}
						if (!_.some(includeLevel['include'], {model: targetModel, as: as})) {
							let tmp = {};
							tmp.model = targetModel;
							tmp.as = as;
							includeLevel['include'].push(tmp);
							includeLevel = tmp;
						}
					}
				} else {
					if (!_.isArray(includeLevel)) {
						includeLevel = includeLevel.include;
					}
					includeLevel.forEach(function(include){
						if (_.includes(include, as)) {
							includeLevel = include;
						}
					});
				}
				schemaClone = targetModel;

				let attributesList = ModelValidation(schemaClone).Attributes;
				let allAttributesList = ModelValidation(schemaClone).AllAttributes;
				let attributesArray = attributesList.split(', ');
				let allAttributesArray = allAttributesList.split(', ');

				if (!includeLevel['attributes'] || !includeLevel['attributes'].length) {
					includeLevel['attributes'] = [];

					if (query.$withRelExcludedFields === true) {
						includeLevel['attributes'] = allAttributesArray;
					} else {
						includeLevel['attributes'] = attributesArray;
					}

				}
			});
		});

	}

	if (_.has(query, '$withThroughFields')) {
		sequelizeQuery['include'] = sequelizeQuery.include || [];
		let relation = '';
		let throughModel;
		let tmp = [];

		if (!_.isArray(query['$withThroughFields'])) {
			tmp.push(query['$withThroughFields']);
		} else {
			tmp = query['$withThroughFields'];
		}

		tmp.forEach((rel) => {
			let indexFirstBrace = rel.indexOf('{');
			let indexSecondBrace = rel.indexOf('}');
			relation = rel.slice(indexFirstBrace + 1, indexSecondBrace);
			let realValue = rel.slice(indexSecondBrace + 1);

			let includeLevel = sequelizeQuery.include;
			let schemaClone = _.clone(model);
			let relTree = _.split(relation, '.');

			relTree.forEach(function(levelRel, level){
				let targetAssociation = schemaClone.associations[levelRel];
				let targetModel = targetAssociation.target;
				let as = targetAssociation.as;
				throughModel = targetAssociation.through.model;

				if (!_.some(includeLevel, {model: targetModel, as: as}) && !_.some(includeLevel.include, {model: targetModel, as: as})) {
					if (level === 0) {
						let tmp = {};
						tmp.model = targetModel;
						tmp.as = as;
						includeLevel.push(tmp);
						includeLevel = tmp;
					} else if (level > 0) {
						if (!_.has(includeLevel, 'include')) {
							includeLevel['include'] = [];
						}
						if (!_.some(includeLevel['include'], {model: targetModel, as: as})) {
							let tmp = {};
							tmp.model = targetModel;
							tmp.as = as;
							includeLevel['include'].push(tmp);
							includeLevel = tmp;
						}
					}
				} else {
					if (!_.isArray(includeLevel)) {
						includeLevel = includeLevel.include;
					}
					includeLevel.forEach(function(include){
						if (_.includes(include, as)) {
							includeLevel = include;
						}
					});
				}
				schemaClone = targetModel;
			});

			let columns = _.split(realValue, ',');

			if (!_.has(includeLevel, 'through')) {
				includeLevel['through'] = {};
			}
			includeLevel = includeLevel.through;

			if (!_.has(includeLevel, 'attributes')) {
				includeLevel['attributes'] = [];
			}
			columns.forEach(function(col){
				includeLevel['attributes'].push(col);
			});

		});



	}

	return sequelizeQuery;
}



async function _result4Relations(result, query, model) {
	const asyncForEach = async (array, callback) => {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array)
		}
	};

	let nestedPages = {};
	let sequelizeQuery = {};

	let queryPagination = queryFilteredPagination(query, model);
	let querySort = queryFilteredSort(query, model);
	let queryRest = queryFilteredRest(query, model);
	let queryInclude = _.assign({}, querySort, queryRest);
	sequelizeQuery = QueryHelper.createSequelizeFilter(model, queryInclude, sequelizeQuery);
	sequelizeQuery = queryAttributes(query, sequelizeQuery, model);
	sequelizeQuery = QueryHelper.createSequelizeFilter(model, queryPagination, sequelizeQuery);

	if (_.has(sequelizeQuery, 'include') && !_.has(query, '$withCount')) {
		await asyncForEach(sequelizeQuery.include, async (include1L) => {
			let targetAssociation1L = model.associations[include1L.as];
			let targetModel1L = targetAssociation1L.target;

			// Only relation BelongsToMany and HasMany
			if (targetAssociation1L.associationType === 'BelongsToMany' || targetAssociation1L.associationType === 'HasMany') {

				let docs = result.docs || [result.doc];

				await asyncForEach(docs, async (baseModel1L) => {
					let option = {};
					option.where = include1L.where;
					option.through = include1L.through;
					if (option.through) {
						delete option.through.limit;
						delete option.through.offset;
					}
					let action = 'count'+_.upperFirst(include1L.as);
					let filteredCount = await baseModel1L[action](option);
					console.log(filteredCount);

					let pages1L = {
						[model.name]: {
							id: baseModel1L.id,
						},
						current: Number(query.$with1LPage) || 1,
						prev: 0,
						hasPrev: false,
						next: 0,
						hasNext: false,
						total: 0
					};

					let totalCount = await baseModel1L[action]();
					console.log(totalCount);

					let items1L = {
						[model.name]: {
							id: baseModel1L.id,
						},
						total: totalCount,
						filtered: filteredCount,
						page: Number(query.$with1LPage),
						pageSize: Number(query.$with1LPageSize),
					};

					if (include1L.include) {
						await asyncForEach(include1L.include, async (include2L) => {
							let targetAssociation2L = targetModel1L.associations[include2L.as];

							if (targetAssociation2L.associationType === 'BelongsToMany' || targetAssociation2L.associationType === 'HasMany') {

								let docs = baseModel1L[targetAssociation1L.as];

								await asyncForEach(docs, async (baseModel2L) => {
									let option = {};
									option.where = include2L.where;
									option.through = include2L.through;
									if (option.through) {
										delete option.through.limit;
										delete option.through.offset;
									}
									let action = 'count'+_.upperFirst(include2L.as);
									let filteredCount = await baseModel2L[action](option);
									console.log(filteredCount);

									let pages2L = {
										[targetModel1L.name]: {
											id: baseModel2L.id,
										},
										current: Number(query.$with2LPage) || 1,
										prev: 0,
										hasPrev: false,
										next: 0,
										hasNext: false,
										total: 0
									};

									let totalCount = await baseModel2L[action]();
									console.log(totalCount);

									let items2L = {
										[targetModel1L.name]: {
											id: baseModel2L.id,
										},
										total: totalCount,
										filtered: filteredCount,
										page: Number(query.$with2LPage),
										pageSize: Number(query.$with1LPageSize),
									};

									pages2L.total = Math.ceil(filteredCount / Number(query.$with2LPageSize));
									pages2L.next = pages2L.current + 1;
									pages2L.hasNext = pages2L.next <= pages2L.total;
									pages2L.prev = pages2L.current - 1;
									pages2L.hasPrev = pages2L.prev !== 0;

									items1L[include2L.as + 'Items'] = items1L[include2L.as + 'Items'] || [];
									items1L[include2L.as + 'Items'].push(items2L);
									pages1L[include2L.as + 'Pages'] = pages1L[include2L.as + 'Pages'] || [];
									pages1L[include2L.as + 'Pages'].push(pages2L);

								});


							}

						});
					}

					pages1L.total = Math.ceil(filteredCount / Number(query.$with1LPageSize));
					pages1L.next = pages1L.current + 1;
					pages1L.hasNext = pages1L.next <= pages1L.total;
					pages1L.prev = pages1L.current - 1;
					pages1L.hasPrev = pages1L.prev !== 0;

					nestedPages[include1L.as + 'Items'] = nestedPages[include1L.as + 'Items'] || [];
					nestedPages[include1L.as + 'Items'].push(items1L);
					nestedPages[include1L.as + 'Pages'] = nestedPages[include1L.as + 'Pages'] || [];
					nestedPages[include1L.as + 'Pages'].push(pages1L);

				});
			}

			// Only relation BelongsTo and HasOne
			if (targetAssociation1L.associationType === 'BelongsTo' || targetAssociation1L.associationType === 'HasOne') {

				let docs = result.docs || [result.doc];

				await asyncForEach(docs, async (baseModel1L) => {
					let pages1L = {
						[model.name]: {
							id: baseModel1L.id,
						},
					};

					let items1L = {
						[model.name]: {
							id: baseModel1L.id,
						},
					};

					if (include1L.include) {
						await asyncForEach(include1L.include, async (include2L) => {
							let targetAssociation2L = targetModel1L.associations[include2L.as];

							if (targetAssociation2L.associationType === 'BelongsToMany' || targetAssociation2L.associationType === 'HasMany') {

								let docs = [baseModel1L[targetAssociation1L.as]];

								await asyncForEach(docs, async (baseModel2L) => {
									let option = {};
									option.where = include2L.where;
									option.through = include2L.through;
									if (option.through) {
										delete option.through.limit;
										delete option.through.offset;
									}
									let action = 'count'+_.upperFirst(include2L.as);
									let filteredCount = await baseModel2L[action](option);
									console.log(filteredCount);

									let pages2L = {
										[targetModel1L.name]: {
											id: baseModel2L.id,
										},
										current: Number(query.$with2LPage) || 1,
										prev: 0,
										hasPrev: false,
										next: 0,
										hasNext: false,
										total: 0
									};

									let totalCount = await baseModel2L[action]();
									console.log(totalCount);

									let items2L = {
										[targetModel1L.name]: {
											id: baseModel2L.id,
										},
										total: totalCount,
										filtered: filteredCount,
										page: Number(query.$with2LPage),
										pageSize: Number(query.$with1LPageSize),
									};

									pages2L.total = Math.ceil(filteredCount / Number(query.$with2LPageSize));
									pages2L.next = pages2L.current + 1;
									pages2L.hasNext = pages2L.next <= pages2L.total;
									pages2L.prev = pages2L.current - 1;
									pages2L.hasPrev = pages2L.prev !== 0;

									items1L[include2L.as + 'Items'] = items1L[include2L.as + 'Items'] || [];
									items1L[include2L.as + 'Items'].push(items2L);
									pages1L[include2L.as + 'Pages'] = pages1L[include2L.as + 'Pages'] || [];
									pages1L[include2L.as + 'Pages'].push(pages2L);

								});


							}

						});
					}

					nestedPages[include1L.as + 'Items'] = nestedPages[include1L.as + 'Items'] || [];
					nestedPages[include1L.as + 'Items'].push(items1L);
					nestedPages[include1L.as + 'Pages'] = nestedPages[include1L.as + 'Pages'] || [];
					nestedPages[include1L.as + 'Pages'].push(pages1L);

				});
			}

		});

	return nestedPages;
	} else {
		return nestedPages
	}

}
