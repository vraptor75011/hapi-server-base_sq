const DB = require('../../../../config/sequelize');
const HandlerHelper = require('../../../../utilities/handler/handler-helper');
const Log = require('../../../../utilities/logging/logging');
const Chalk = require('chalk');
const Sequelize = require('sequelize');
const Boom = require('boom');

const Op = Sequelize.Op;

const User = DB.User;


module.exports = {
	findAll: function (request, reply) {
		// Call listAll async function with await inside handler-helper
		// call LIST Handler for CRUD function valid for all present models
		let result = HandlerHelper.list(User, request.query);
		return reply(result);

	},

	findOne: function (request, reply) {
		// Call an async function with await inside in handler-helper
		// call FIND ONE Handler for CRUD function valid for all present models
		let user = HandlerHelper.find(User, request.params.userId, request.query);
		return reply(user);

	},

	create: function (request, reply) {
		// Call an async function with await inside in handler-helper
		// Only for Admin to Add a new User without free registration

		request.payload.password = User.hashPassword(request.payload.password);
		// call CREATE Handler for CRUD function valid for all present models
		let user = HandlerHelper.create(User, request.payload);
		return reply(user);

	},

	update: function (request, reply) {
		// Admin and User can update an User, but User can't change his roles and realms
		// Call an async function with await inside in handler-helper

		// call CREATE Handler for CRUD function valid for all present models
		let user = HandlerHelper.update(User, request.params.userId, request.payload);
		return reply(user);
	},

	delete: function (request, reply) {
		// Admin can delete an User
		// Call an async function with await inside in handler-helper

		// call DELETE Handler for CRUD function valid for all present models
		let response = HandlerHelper.deleteOne(User, request.params.userId, request.payload);
		return reply(response);
	},

	deleteMany: function (request, reply) {
		// Admin can delete an User
		// Call an async function with await inside in handler-helper

		// call DELETE MANY Handler for EXTRA CRUD function valid for all present models
		let response = HandlerHelper.deleteMany(User, request.payload);
		return reply(response);
	},

	addOne: function (request, reply) {
		// Admin can add one child model to an User
		// Call an async function with await inside in handler-helper
		let childModel = User.associations[request.params.childModel].target;
		// call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
		let response = HandlerHelper.addOne(User, request.params.userId, childModel, request.params.childId, request.params.childModel);
		return reply(response);
	},

	removeOne: function (request, reply) {
		// Admin can remove one child model from an User
		// Call an async function with await inside in handler-helper
		let childModel = User.associations[request.params.childModel].target;
		// call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
		let response = HandlerHelper.removeOne(User, request.params.userId, childModel, request.params.childId, request.params.childModel);
		return reply(response);
	},

	addMany: function (request, reply) {
		// Admin can add one or more child model to an User
		// Call an async function with await inside in handler-helper
		let childModel = User.associations[request.params.childModel].target;
		// call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
		let response = HandlerHelper.addMany(User, request.params.userId, childModel, request.params.childModel, request.payload);
		return reply(response);
	},

	removeMany: function (request, reply) {
		// Admin can remove one or more child model from an User
		// Call an async function with await inside in handler-helper
		let childModel = User.associations[request.params.childModel].target;
		// call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
		let response = HandlerHelper.removeMany(User, request.params.userId, childModel, request.params.childModel, request.payload);
		return reply(response);
	},

	getAll: function (request, reply) {
		// Admin can get list of Child model related to User
		// Call an async function with await inside in handler-helper
		let childModel = User.associations[request.params.childModel].target;
		// call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
		let response = HandlerHelper.getAll(User, request.params.userId, childModel, request.params.childModel, request.query);
		return reply(response);
	},

	// EXTRA Handlers
	checkEmail: async (request, reply) => {
		try {
			let condition = {where: {email: {[Op.eq]: request.payload.email}}};
			let user = await User.findOne(condition);
			if (user) {
				return reply(true);
			}
			else {
				return reply(false);
			}
		} catch (error) {
			Log.apiLogger.error(Chalk.red(error));
			return reply(Boom.badImplementation('There was an error accessing the database.'));
		}
	},

};