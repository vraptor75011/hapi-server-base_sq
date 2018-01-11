const Boom = require('boom');
const Log = require('../../../../utilities/logging/logging');
const Chalk = require('chalk');

const DB = require('../../../../config/sequelize');
const HandlerHelper = require('../../../../utilities/handler/handler-helper');

const User = DB.User;


const Handler =
	{
		findAll: function (request, reply) {

			// call LIST Handler for CRUD function valid for all present models
			HandlerHelper.list(User, request.query)
				.then(function(result){
					return reply(result);
				})
				.catch(function (error) {
					let errorMsg = error.message || 'An error occurred';
					return reply(Boom.gatewayTimeout(errorMsg));
				});
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

		addMany: function (request, reply) {
			// Admin can add one or more child model to an User
			// Call an async function with await inside in handler-helper
			let childModel = User.associations[request.params.childModel].target;
			// call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let response = HandlerHelper.addMany(User, request.params.userId, childModel, request.params.childModel, request.payload);
			return reply(response);
		},

		removeOne: function (request, reply) {
			// Admin can remove one child model from an User
			// Call an async function with await inside in handler-helper
			let childModel = User.associations[request.params.childModel].target;
			// call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let response = HandlerHelper.removeOne(User, request.params.userId, childModel, request.params.childId, request.params.childModel);
			return reply(response);
		},
	};

module.exports = Handler;