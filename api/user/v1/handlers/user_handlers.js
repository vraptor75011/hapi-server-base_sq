const Boom = require('boom');
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

			// call FIND ONE Handler for CRUD function valid for all present models
			HandlerHelper.find(User, request.params.userId, request.query)
				.then(function(result){
					return reply(result);
				})
				.catch(function (error) {
					let errorMsg = error.message || 'An error occurred';
					return reply(Boom.gatewayTimeout(errorMsg));
				});
		},

		create: function (request, reply) {

			// Only for Admin to Add a new User without free registration

			request.payload.password = User.hashPassword(request.payload.password);
			// call CREATE Handler for CRUD function valid for all present models
			HandlerHelper.create(User, request.payload)
				.then(function(result){
					return reply(result);
				})
				.catch(function (error) {
					let errorMsg = error.message || 'An error occurred';
					return reply(Boom.gatewayTimeout(errorMsg));
				});
		}
	};

module.exports = Handler;