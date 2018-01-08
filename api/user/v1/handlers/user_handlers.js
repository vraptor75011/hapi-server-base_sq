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

			// call CREATE Handler for CRUD function valid for all present models
			let user = HandlerHelper.update(User, request.params.userId, request.payload);
			return reply(user);
		},

		delete: function (request, reply) {
			// Admin adn User can update an User, but User can't change his roles and realms

			// call CREATE Handler for CRUD function valid for all present models
			HandlerHelper.deleteOne(User, request.params.userId, request.query)
				.then(function(result){
					return reply(result);
				})
				.catch(function (error) {
					let errorMsg = error.message || 'An error occurred';
					return reply(Boom.gatewayTimeout(errorMsg));
				});
		},
	};

module.exports = Handler;