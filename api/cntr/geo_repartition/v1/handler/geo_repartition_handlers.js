const DB = require('../../../../../config/sequelize');
const HandlerHelper = require('../../../../../utilities/handler/handler-helper');
const { apiLogger } = require('../../../../../utilities/logging/logging');

const CntrGeoRepartition = DB.CntrGeoRepartition;


const Handler =
	{
		findAll: async (request, h) => {
			// Call listAll async function with await inside handler-helper
			// call LIST Handler for CRUD function valid for all present models
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let result = await HandlerHelper.list(CntrGeoRepartition, request.query);
			if (!result.isBoom) {
				result.nestedPages = await HandlerHelper.result4Relations(result, request.query, CntrGeoRepartition);
			}
			return result

		},

		findOne: async (request, h) => {
			// Call an async function with await inside in handler-helper
			// call FIND ONE Handler for CRUD function valid for all present models
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let result = await HandlerHelper.find(CntrGeoRepartition, request.params.roleId, request.query);
			if (!result.isBoom) {
				result.nestedPages = await HandlerHelper.result4Relations(result, request.query, CntrGeoRepartition);
			}
			return result

		},

		create: async (request, h) => {
			// Call an async function with await inside in handler-helper
			// Only for Admin to Add a new CntrGeoRepartition without free registration
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call CREATE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.create(CntrGeoRepartition, request.payload);
			return result;

		},

		update: async (request, h) => {
			// Admin and CntrGeoRepartition can update an CntrGeoRepartition, but CntrGeoRepartition can't change his roles and realms
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call CREATE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.update(CntrGeoRepartition, request.params.roleId, request.payload);
			return result;
		},

		delete: async (request, h) => {
			// Admin can delete an CntrGeoRepartition
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call DELETE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.deleteOne(CntrGeoRepartition, request.params.roleId, request.payload);
			return result;
		},

		deleteMany: async (request, h) => {
			// Admin can delete an CntrGeoRepartition
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call DELETE MANY Handler for EXTRA CRUD function valid for all present models
			let result = await HandlerHelper.deleteMany(CntrGeoRepartition, request.payload);
			return result;
		},

		addOne: async (request, h) => {
			// Admin can add one child model to an CntrGeoRepartition
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = CntrGeoRepartition.associations[request.params.childModel].target;
			// call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.addOne(CntrGeoRepartition, request.params.roleId, childModel, request.params.childId, request.params.childModel);
			return result;
		},

		removeOne: async (request, h) => {
			// Admin can remove one child model from an CntrGeoRepartition
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = CntrGeoRepartition.associations[request.params.childModel].target;
			// call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.removeOne(CntrGeoRepartition, request.params.roleId, childModel, request.params.childId, request.params.childModel);
			return result;
		},

		addMany: async (request, h) => {
			// Admin can add one or more child model to an CntrGeoRepartition
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = CntrGeoRepartition.associations[request.params.childModel].target;
			// call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.addMany(CntrGeoRepartition, request.params.roleId, childModel, request.params.childModel, request.payload);
			return result;
		},

		removeMany: async (request, h) => {
			// Admin can remove one or more child model from an CntrGeoRepartition
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = CntrGeoRepartition.associations[request.params.childModel].target;
			// call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.removeMany(CntrGeoRepartition, request.params.roleId, childModel, request.params.childModel, request.payload);
			return result;
		},

		getAll: async (request, h) => {
			// Admin can get list of Child model related to CntrGeoRepartition
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = CntrGeoRepartition.associations[request.params.childModel].target;
			// call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.getAll(CntrGeoRepartition, request.params.roleId, childModel, request.params.childModel, request.query);
			return result;
		},
	};

module.exports = Handler;