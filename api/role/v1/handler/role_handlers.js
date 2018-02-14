const DB = require('../../../../config/sequelize');
const HandlerHelper = require('../../../../utilities/handler/handler-helper');
const Log = require('../../../../utilities/logging/logging');
const Chalk = require('chalk');

const Role = DB.Role;


const Handler =
	{
		findAll: async (request, h) => {
			// Call listAll async function with await inside handler-helper
			// call LIST Handler for CRUD function valid for all present models
			Log.apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let result = await HandlerHelper.list(Role, request.query);
			return result;

		},

		findOne: async (request, h) => {
			// Call an async function with await inside in handler-helper
			// call FIND ONE Handler for CRUD function valid for all present models
			Log.apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let result = await HandlerHelper.find(Role, request.params.roleId, request.query);
			return result;

		},

		create: async (request, h) => {
			// Call an async function with await inside in handler-helper
			// Only for Admin to Add a new Role without free registration
			Log.apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call CREATE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.create(Role, request.payload);
			return result;

		},

		update: async (request, h) => {
			// Admin and Role can update an Role, but Role can't change his roles and realms
			// Call an async function with await inside in handler-helper
			Log.apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call CREATE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.update(Role, request.params.roleId, request.payload);
			return result;
		},

		delete: async (request, h) => {
			// Admin can delete an Role
			// Call an async function with await inside in handler-helper
			Log.apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call DELETE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.deleteOne(Role, request.params.roleId, request.payload);
			return result;
		},

		deleteMany: async (request, h) => {
			// Admin can delete an Role
			// Call an async function with await inside in handler-helper
			Log.apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			// call DELETE MANY Handler for EXTRA CRUD function valid for all present models
			let result = await HandlerHelper.deleteMany(Role, request.payload);
			return result;
		},

		addOne: async (request, h) => {
			// Admin can add one child model to an Role
			// Call an async function with await inside in handler-helper
			Log.apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = Role.associations[request.params.childModel].target;
			// call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.addOne(Role, request.params.roleId, childModel, request.params.childId, request.params.childModel);
			return result;
		},

		removeOne: async (request, h) => {
			// Admin can remove one child model from an Role
			// Call an async function with await inside in handler-helper
			Log.apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = Role.associations[request.params.childModel].target;
			// call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.removeOne(Role, request.params.roleId, childModel, request.params.childId, request.params.childModel);
			return result;
		},

		addMany: async (request, h) => {
			// Admin can add one or more child model to an Role
			// Call an async function with await inside in handler-helper
			Log.apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = Role.associations[request.params.childModel].target;
			// call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.addMany(Role, request.params.roleId, childModel, request.params.childModel, request.payload);
			return result;
		},

		removeMany: async (request, h) => {
			// Admin can remove one or more child model from an Role
			// Call an async function with await inside in handler-helper
			Log.apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = Role.associations[request.params.childModel].target;
			// call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.removeMany(Role, request.params.roleId, childModel, request.params.childModel, request.payload);
			return result;
		},

		getAll: async (request, h) => {
			// Admin can get list of Child model related to Role
			// Call an async function with await inside in handler-helper
			Log.apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let childModel = Role.associations[request.params.childModel].target;
			// call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.getAll(Role, request.params.roleId, childModel, request.params.childModel, request.query);
			return result;
		},
	};

module.exports = Handler;