const DB = require('../../../../../config/sequelize');
const HandlerHelper = require('../../../../../utilities/handler/handler-helper');
const Log = require('../../../../../utilities/logging/logging');

const AuthRealmsRolesUsers = DB.AuthRealmsRolesUsers;


const Handler =
	{
		findAll: async (request, h) => {
			// Call listAll async function with await inside handler-helper
			// call LIST Handler for CRUD function valid for all present models
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let result = await HandlerHelper.list(AuthRealmsRolesUsers, request.query);
			return result;

		},

		findOne: async (request, h) => {
			// Call an async function with await inside in handler-helper
			// call FIND ONE Handler for CRUD function valid for all present models
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let result = await HandlerHelper.find(AuthRealmsRolesUsers, request.params.realmsRolesUsersId, request.query);
			return result;

		},

		create: async (request, h) => {
			// Call an async function with await inside in handler-helper
			// Only for Admin to Add a new AuthRealmsRolesUsers without free registration
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call CREATE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.create(AuthRealmsRolesUsers, request.payload);
			return result;

		},

		update: async (request, h) => {
			// Admin and AuthRealmsRolesUsers can update an AuthRealmsRolesUsers, but AuthRealmsRolesUsers can't change his roles and realms
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call CREATE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.update(AuthRealmsRolesUsers, request.params.realmsRolesUsersId, request.payload);
			return result;
		},

		delete: async (request, h) => {
			// Admin can delete an AuthRealmsRolesUsers
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call DELETE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.deleteOne(AuthRealmsRolesUsers, request.params.realmsRolesUsersId, request.payload);
					return result;
		},

		deleteMany: async (request, h) => {
			// Admin can delete an AuthRealmsRolesUsers
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call DELETE MANY Handler for EXTRA CRUD function valid for all present models
			let result = await HandlerHelper.deleteMany(AuthRealmsRolesUsers, request.payload);
			return result;
		},

		addOne: async (request, h) => {
			// Admin can add one child model to an AuthRealmsRolesUsers
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = AuthRealmsRolesUsers.associations[request.params.childModel].target;
			// call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.addOne(AuthRealmsRolesUsers, request.params.realmsRolesUsersId, childModel, request.params.childId, request.params.childModel);
			return result;
		},

		removeOne: async (request, h) => {
			// Admin can remove one child model from an AuthRealmsRolesUsers
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = AuthRealmsRolesUsers.associations[request.params.childModel].target;
			// call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.removeOne(AuthRealmsRolesUsers, request.params.realmsRolesUsersId, childModel, request.params.childId, request.params.childModel);
			return result;
		},

		addMany: async (request, h) => {
			// Admin can add one or more child model to an AuthRealmsRolesUsers
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = AuthRealmsRolesUsers.associations[request.params.childModel].target;
			// call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.addMany(AuthRealmsRolesUsers, request.params.realmsRolesUsersId, childModel, request.params.childModel, request.payload);
			return result;
		},

		removeMany: async (request, h) => {
			// Admin can remove one or more child model from an AuthRealmsRolesUsers
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = AuthRealmsRolesUsers.associations[request.params.childModel].target;
			// call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.removeMany(AuthRealmsRolesUsers, request.params.realmsRolesUsersId, childModel, request.params.childModel, request.payload);
			return result;
		},

		getAll: async (request, h) => {
			// Admin can get list of Child model related to AuthRealmsRolesUsers
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = AuthRealmsRolesUsers.associations[request.params.childModel].target;
			// call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.getAll(AuthRealmsRolesUsers, request.params.realmsRolesUsersId, childModel, request.params.childModel, request.query);
			return result;
		},
	};

module.exports = Handler;