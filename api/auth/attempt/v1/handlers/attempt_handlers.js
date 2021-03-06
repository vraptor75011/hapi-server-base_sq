const DB = require('../../../../../config/sequelize');
const HandlerHelper = require('../../../../../utilities/handler/handler-helper');
const { apiLogger } = require('../../../../../utilities/logging/logging');

const AuthAttempt = DB.AuthAttempt;


module.exports = {
	findAll: async (request, h) => {
		// Call listAll async function with await inside handler-helper
		// call LIST Handler for CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let result = await HandlerHelper.list(AuthAttempt, request.query);
		if (!result.isBoom) {
			result.nestedPages = await HandlerHelper.result4Relations(result, request.query, AuthAttempt);
		}
		return result;

	},

	findOne: async (request, h) => {
		// Call an async function with await inside in handler-helper
		// call FIND ONE Handler for CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let result = await HandlerHelper.find(AuthAttempt, request.params.attemptId, request.query);
		if (!result.isBoom) {
			result.nestedPages = await HandlerHelper.result4Relations(result, request.query, AuthAttempt);
		}
		return result;

	},

	create: async (request, h) => {
		// Call an async function with await inside in handler-helper
		// Only for Admin to Add a new AuthUser without free registration

		// call CREATE Handler for CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let result = await HandlerHelper.create(AuthAttempt, request.payload);
		return result;

	},

	update: async (request, h) => {
		// Admin and AuthUser can update an AuthUser, but AuthUser can't change his roles and realms
		// Call an async function with await inside in handler-helper

		// call CREATE Handler for CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let result = await HandlerHelper.update(AuthAttempt, request.params.attemptId, request.payload);
		return result;
	},

	delete: async (request, h) => {
		// Admin can delete an AuthUser
		// Call an async function with await inside in handler-helper

		// call DELETE Handler for CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let result = await HandlerHelper.deleteOne(AuthAttempt, request.params.attemptId, request.payload);
		return result;
	},

	deleteMany: async (request, h) => {
		// Admin can delete an AuthUser
		// Call an async function with await inside in handler-helper

		// call DELETE MANY Handler for EXTRA CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let result = await HandlerHelper.deleteMany(AuthAttempt, request.payload);
		return result;
	},

	addOne: async (request, h) => {
		// Admin can add one child model to an AuthUser
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthAttempt.associations[request.params.childModel].target;
		// call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
		let result = await HandlerHelper.addOne(AuthAttempt, request.params.attemptId, childModel, request.params.childId, request.params.childModel);
		return result;
	},

	removeOne: async (request, h) => {
		// Admin can remove one child model from an AuthUser
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthAttempt.associations[request.params.childModel].target;
		// call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
		let result = await HandlerHelper.removeOne(AuthAttempt, request.params.attemptId, childModel, request.params.childId, request.params.childModel);
		return result;
	},

	addMany: async (request, h) => {
		// Admin can add one or more child model to an AuthUser
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthAttempt.associations[request.params.childModel].target;
		// call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
		let result = await HandlerHelper.addMany(AuthAttempt, request.params.attemptId, childModel, request.params.childModel, request.payload);
		return result;
	},

	removeMany: async (request, h) => {
		// Admin can remove one or more child model from an AuthUser
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthAttempt.associations[request.params.childModel].target;
		// call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
		let result = await HandlerHelper.removeMany(AuthAttempt, request.params.attemptId, childModel, request.params.childModel, request.payload);
		return result;
	},

	getAll: async (request, h) => {
		// Admin can get list of Child model related to AuthUser
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthAttempt.associations[request.params.childModel].target;
		// call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
		let result = await HandlerHelper.getAll(AuthAttempt, request.params.attemptId, childModel, request.params.childModel, request.query);
		return result;
	},

};