const DB = require('../../../../config/sequelize');
const HandlerHelper = require('../../../../utilities/handler/handler-helper');
const Log = require('../../../../utilities/logging/logging');
const Chalk = require('chalk');
const Sequelize = require('sequelize');
const Boom = require('boom');

const Op = Sequelize.Op;

const User = DB.User;


module.exports = {
	findAll: async (request, h) => {
		// Call listAll async function with await inside handler-helper
		// call LIST Handler for CRUD function valid for all present models
		Log.apiLogger.info(Chalk.cyan('Method: %s - Request: %s', request.method, request.path));
		return await HandlerHelper.list(User, request.query);

	},

	findOne: async (request, h) => {
		// Call an async function with await inside in handler-helper
		// call FIND ONE Handler for CRUD function valid for all present models
		Log.apiLogger.info(Chalk.cyan('Method: %s - Request: %s', request.method, request.path));
		return await HandlerHelper.find(User, request.params.userId, request.query);

	},

	create: async (request, h) => {
		// Call an async function with await inside in handler-helper
		// Only for Admin to Add a new User without free registration
		Log.apiLogger.info(Chalk.cyan('Method: %s - Request: %s', request.method, request.path));
		request.payload.password = await User.hashPassword(request.payload.password);
		// call CREATE Handler for CRUD function valid for all present models
		return await HandlerHelper.create(User, request.payload);

	},

	update: async (request, h) => {
		// Admin and User can update an User, but User can't change his roles and realms
		// Call an async function with await inside in handler-helper

		// call CREATE Handler for CRUD function valid for all present models
		Log.apiLogger.info(Chalk.cyan('Method: %s - Request: %s', request.method, request.path));
		return await HandlerHelper.update(User, request.params.userId, request.payload);
	},

	delete: async (request, h) => {
		// Admin can delete an User
		// Call an async function with await inside in handler-helper

		// call DELETE Handler for CRUD function valid for all present models
		Log.apiLogger.info(Chalk.cyan('Method: %s - Request: %s', request.method, request.path));
		return await HandlerHelper.deleteOne(User, request.params.userId, request.payload);
	},

	deleteMany: async (request, h) => {
		// Admin can delete an User
		// Call an async function with await inside in handler-helper

		// call DELETE MANY Handler for EXTRA CRUD function valid for all present models
		Log.apiLogger.info(Chalk.cyan('Method: %s - Request: %s', request.method, request.path));
		return await HandlerHelper.deleteMany(User, request.payload);
	},

	addOne: async (request, h) => {
		// Admin can add one child model to an User
		// Call an async function with await inside in handler-helper
		Log.apiLogger.info(Chalk.cyan('Method: %s - Request: %s', request.method, request.path));
		let childModel = User.associations[request.params.childModel].target;
		// call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.addOne(User, request.params.userId, childModel, request.params.childId, request.params.childModel);
	},

	removeOne: async (request, h) => {
		// Admin can remove one child model from an User
		// Call an async function with await inside in handler-helper
		Log.apiLogger.info(Chalk.cyan('Method: %s - Request: %s', request.method, request.path));
		let childModel = User.associations[request.params.childModel].target;
		// call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.removeOne(User, request.params.userId, childModel, request.params.childId, request.params.childModel);
	},

	addMany: async (request, h) => {
		// Admin can add one or more child model to an User
		// Call an async function with await inside in handler-helper
		Log.apiLogger.info(Chalk.cyan('Method: %s - Request: %s', request.method, request.path));
		let childModel = User.associations[request.params.childModel].target;
		// call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.addMany(User, request.params.userId, childModel, request.params.childModel, request.payload);
	},

	removeMany: async (request, h) => {
		// Admin can remove one or more child model from an User
		// Call an async function with await inside in handler-helper
		Log.apiLogger.info(Chalk.cyan('Method: %s - Request: %s', request.method, request.path));
		let childModel = User.associations[request.params.childModel].target;
		// call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.removeMany(User, request.params.userId, childModel, request.params.childModel, request.payload);
	},

	getAll: async (request, h) => {
		// Admin can get list of Child model related to User
		// Call an async function with await inside in handler-helper
		Log.apiLogger.info(Chalk.cyan('Method: %s - Request: %s', request.method, request.path));
		let childModel = User.associations[request.params.childModel].target;
		// call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.getAll(User, request.params.userId, childModel, request.params.childModel, request.query);
	},

	// EXTRA Handlers
	checkEmail: async (request, h) => {
		try {
			Log.apiLogger.info(Chalk.cyan('Method: %s - Request: %s', request.method, request.path));
			let condition = {where: {email: {[Op.eq]: request.payload.email}}};
			let user = await User.findOne(condition);
			if (user) {
				return h.response(true);
			}
			else {
				return h.response(false);
			}
		} catch (error) {
			Log.apiLogger.error(Chalk.red(error));
			return Boom.badImplementation('There was an error accessing the database.');
		}
	},

};