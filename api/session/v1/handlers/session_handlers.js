const DB = require('../../../../config/sequelize');
const HandlerHelper = require('../../../../utilities/handler/handler-helper');

const Session = DB.Session;


const Handler =
	{
		findAll: function (request, reply) {
			// Call listAll async function with await inside handler-helper
			// call LIST Handler for CRUD function valid for all present models
			let result = HandlerHelper.list(Session, request.query);
			return reply(result);

		},

		findOne: function (request, reply) {
			// Call an async function with await inside in handler-helper
			// call FIND ONE Handler for CRUD function valid for all present models
			let user = HandlerHelper.find(Session, request.params.sessionId, request.query);
			return reply(user);

		},

		create: function (request, reply) {
			// Call an async function with await inside in handler-helper
			// Only for Admin to Add a new Session without free registration

			request.payload.password = Session.hashPassword(request.payload.password);
			// call CREATE Handler for CRUD function valid for all present models
			let user = HandlerHelper.create(Session, request.payload);
			return reply(user);

		},

		update: function (request, reply) {
			// Admin and Session can update an Session, but Session can't change his roles and realms
			// Call an async function with await inside in handler-helper

			// call CREATE Handler for CRUD function valid for all present models
			let user = HandlerHelper.update(Session, request.params.sessionId, request.payload);
			return reply(user);
		},

		delete: function (request, reply) {
			// Admin can delete an Session
			// Call an async function with await inside in handler-helper

			// call DELETE Handler for CRUD function valid for all present models
			let response = HandlerHelper.deleteOne(Session, request.params.sessionId, request.payload);
					return reply(response);
		},

		deleteMany: function (request, reply) {
			// Admin can delete an Session
			// Call an async function with await inside in handler-helper

			// call DELETE MANY Handler for EXTRA CRUD function valid for all present models
			let response = HandlerHelper.deleteMany(Session, request.payload);
			return reply(response);
		},

		addOne: function (request, reply) {
			// Admin can add one child model to an Session
			// Call an async function with await inside in handler-helper
			let childModel = Session.associations[request.params.childModel].target;
			// call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
			let response = HandlerHelper.addOne(Session, request.params.sessionId, childModel, request.params.childId, request.params.childModel);
			return reply(response);
		},

		removeOne: function (request, reply) {
			// Admin can remove one child model from an Session
			// Call an async function with await inside in handler-helper
			let childModel = Session.associations[request.params.childModel].target;
			// call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
			let response = HandlerHelper.removeOne(Session, request.params.sessionId, childModel, request.params.childId, request.params.childModel);
			return reply(response);
		},

		addMany: function (request, reply) {
			// Admin can add one or more child model to an Session
			// Call an async function with await inside in handler-helper
			let childModel = Session.associations[request.params.childModel].target;
			// call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let response = HandlerHelper.addMany(Session, request.params.sessionId, childModel, request.params.childModel, request.payload);
			return reply(response);
		},

		removeMany: function (request, reply) {
			// Admin can remove one or more child model from an Session
			// Call an async function with await inside in handler-helper
			let childModel = Session.associations[request.params.childModel].target;
			// call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let response = HandlerHelper.removeMany(Session, request.params.sessionId, childModel, request.params.childModel, request.payload);
			return reply(response);
		},

		getAll: function (request, reply) {
			// Admin can get list of Child model related to Session
			// Call an async function with await inside in handler-helper
			let childModel = Session.associations[request.params.childModel].target;
			// call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
			let response = HandlerHelper.getAll(Session, request.params.sessionId, childModel, request.params.childModel, request.query);
			return reply(response);
		},
	};

module.exports = Handler;