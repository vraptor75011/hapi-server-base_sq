const DB = require('../../../../../config/sequelize');
const HandlerHelper = require('../../../../../utilities/handler/handler-helper');
const { apiLogger } = require('../../../../../utilities/logging/logging');

const AuthRealm = DB.AuthRealm;


const Handler =
	{
		findAll: async (request, h) => {
			// Call listAll async function with await inside handler-helper
			// call LIST Handler for CRUD function valid for all present models
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let result = await HandlerHelper.list(AuthRealm, request.query);
			if (!result.isBoom) {
				result.nestedPages = await HandlerHelper.result4Relations(result, request.query, AuthRealm);
			}
			return result;
		},

		findOne: async (request, h) => {
			// Call an async function with await inside in handler-helper
			// call FIND ONE Handler for CRUD function valid for all present models
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let result = await HandlerHelper.find(AuthRealm, request.params.realmId, request.query);
			if (!result.isBoom) {
				result.nestedPages = await HandlerHelper.result4Relations(result, request.query, AuthRealm);
			}
			return result;

		},

		create: async (request, h) => {
			// Call an async function with await inside in handler-helper
			// Only for Admin to Add a new AuthRealm without free registration
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			request.payload.password = AuthRealm.hashPassword(request.payload.password);
			// call CREATE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.create(AuthRealm, request.payload);
			return result;

		},

		update: async (request, h) => {
			// Admin and AuthRealm can update an AuthRealm, but AuthRealm can't change his roles and realms
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call CREATE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.update(AuthRealm, request.params.realmId, request.payload);
			return result;
		},

		delete: async (request, h) => {
			// Admin can delete an AuthRealm
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call DELETE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.deleteOne(AuthRealm, request.params.realmId, request.payload);
			return result;
		},

		deleteMany: async (request, h) => {
			// Admin can delete an AuthRealm
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call DELETE MANY Handler for EXTRA CRUD function valid for all present models
			let result = await HandlerHelper.deleteMany(AuthRealm, request.payload);
			return result;
		},

		addOne: async (request, h) => {
			// Admin can add one child model to an AuthRealm
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = AuthRealm.associations[request.params.childModel].target;
			// call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.addOne(AuthRealm, request.params.realmId, childModel, request.params.childId, request.params.childModel);
			return result;
		},

		removeOne: async (request, h) => {
			// Admin can remove one child model from an AuthRealm
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = AuthRealm.associations[request.params.childModel].target;
			// call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.removeOne(AuthRealm, request.params.realmId, childModel, request.params.childId, request.params.childModel);
			return result;
		},

		addMany: async (request, h) => {
			// Admin can add one or more child model to an AuthRealm
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = AuthRealm.associations[request.params.childModel].target;
			// call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.addMany(AuthRealm, request.params.realmId, childModel, request.params.childModel, request.payload);
			return result;
		},

		removeMany: async (request, h) => {
			// Admin can remove one or more child model from an AuthRealm
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = AuthRealm.associations[request.params.childModel].target;
			// call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.removeMany(AuthRealm, request.params.realmId, childModel, request.params.childModel, request.payload);
			return result;
		},

		getAll: async (request, h) => {
			// Admin can get list of Child model related to AuthRealm
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = AuthRealm.associations[request.params.childModel].target;
			// call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.getAll(AuthRealm, request.params.realmId, childModel, request.params.childModel, request.query);
			return result;
		},
	};

module.exports = Handler;