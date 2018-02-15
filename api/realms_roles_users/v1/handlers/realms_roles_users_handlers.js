const DB = require('../../../../config/sequelize');
const HandlerHelper = require('../../../../utilities/handler/handler-helper');
const Log = require('../../../../utilities/logging/logging');

const RealmsRolesUsers = DB.RealmsRolesUsers;


const Handler =
	{
		findAll: async (request, h) => {
			// Call listAll async function with await inside handler-helper
			// call LIST Handler for CRUD function valid for all present models
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let result = await HandlerHelper.list(RealmsRolesUsers, request.query);
			return result;

		},

		findOne: async (request, h) => {
			// Call an async function with await inside in handler-helper
			// call FIND ONE Handler for CRUD function valid for all present models
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let result = await HandlerHelper.find(RealmsRolesUsers, request.params.realmsRolesUsersId, request.query);
			return result;

		},

		create: async (request, h) => {
			// Call an async function with await inside in handler-helper
			// Only for Admin to Add a new RealmsRolesUsers without free registration
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call CREATE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.create(RealmsRolesUsers, request.payload);
			return result;

		},

		update: async (request, h) => {
			// Admin and RealmsRolesUsers can update an RealmsRolesUsers, but RealmsRolesUsers can't change his roles and realms
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call CREATE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.update(RealmsRolesUsers, request.params.realmsRolesUsersId, request.payload);
			return result;
		},

		delete: async (request, h) => {
			// Admin can delete an RealmsRolesUsers
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call DELETE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.deleteOne(RealmsRolesUsers, request.params.realmsRolesUsersId, request.payload);
					return result;
		},

		deleteMany: async (request, h) => {
			// Admin can delete an RealmsRolesUsers
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call DELETE MANY Handler for EXTRA CRUD function valid for all present models
			let result = await HandlerHelper.deleteMany(RealmsRolesUsers, request.payload);
			return result;
		},

		addOne: async (request, h) => {
			// Admin can add one child model to an RealmsRolesUsers
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = RealmsRolesUsers.associations[request.params.childModel].target;
			// call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.addOne(RealmsRolesUsers, request.params.realmsRolesUsersId, childModel, request.params.childId, request.params.childModel);
			return result;
		},

		removeOne: async (request, h) => {
			// Admin can remove one child model from an RealmsRolesUsers
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = RealmsRolesUsers.associations[request.params.childModel].target;
			// call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.removeOne(RealmsRolesUsers, request.params.realmsRolesUsersId, childModel, request.params.childId, request.params.childModel);
			return result;
		},

		addMany: async (request, h) => {
			// Admin can add one or more child model to an RealmsRolesUsers
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = RealmsRolesUsers.associations[request.params.childModel].target;
			// call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.addMany(RealmsRolesUsers, request.params.realmsRolesUsersId, childModel, request.params.childModel, request.payload);
			return result;
		},

		removeMany: async (request, h) => {
			// Admin can remove one or more child model from an RealmsRolesUsers
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = RealmsRolesUsers.associations[request.params.childModel].target;
			// call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.removeMany(RealmsRolesUsers, request.params.realmsRolesUsersId, childModel, request.params.childModel, request.payload);
			return result;
		},

		getAll: async (request, h) => {
			// Admin can get list of Child model related to RealmsRolesUsers
			// Call an async function with await inside in handler-helper
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = RealmsRolesUsers.associations[request.params.childModel].target;
			// call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.getAll(RealmsRolesUsers, request.params.realmsRolesUsersId, childModel, request.params.childModel, request.query);
			return result;
		},
	};

module.exports = Handler;