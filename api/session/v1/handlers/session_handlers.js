const DB = require('../../../../config/sequelize');
const HandlerHelper = require('../../../../utilities/handler/handler-helper');

const Session = DB.Session;


const Handler =
	{
		findAll: async (request, h) => {
			// Call listAll async function with await inside handler-helper
			// call LIST Handler for CRUD function valid for all present models
			let result = await HandlerHelper.list(Session, request.query);
			return result;

		},

		findOne: async (request, h) => {
			// Call an async function with await inside in handler-helper
			// call FIND ONE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.find(Session, request.params.sessionId, request.query);
			return result;

		},

		create: async (request, h) => {
			// Call an async function with await inside in handler-helper
			// Only for Admin to Add a new Session without free registration

			// call CREATE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.create(Session, request.payload);
			return result;

		},

		update: async (request, h) => {
			// Admin and Session can update an Session, but Session can't change his roles and realms
			// Call an async function with await inside in handler-helper

			// call CREATE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.update(Session, request.params.sessionId, request.payload);
			return result;
		},

		delete: async (request, h) => {
			// Admin can delete an Session
			// Call an async function with await inside in handler-helper

			// call DELETE Handler for CRUD function valid for all present models
			let result = await HandlerHelper.deleteOne(Session, request.params.sessionId, request.payload);
			return result;
		},

		deleteMany: async (request, h) => {
			// Admin can delete an Session
			// Call an async function with await inside in handler-helper

			// call DELETE MANY Handler for EXTRA CRUD function valid for all present models
			let result = await HandlerHelper.deleteMany(Session, request.payload);
			return result;
		},

		addOne: async (request, h) => {
			// Admin can add one child model to an Session
			// Call an async function with await inside in handler-helper
			let childModel = Session.associations[request.params.childModel].target;
			// call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.addOne(Session, request.params.sessionId, childModel, request.params.childId, request.params.childModel);
			return result;
		},

		removeOne: async (request, h) => {
			// Admin can remove one child model from an Session
			// Call an async function with await inside in handler-helper
			let childModel = Session.associations[request.params.childModel].target;
			// call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.removeOne(Session, request.params.sessionId, childModel, request.params.childId, request.params.childModel);
			return result;
		},

		addMany: async (request, h) => {
			// Admin can add one or more child model to an Session
			// Call an async function with await inside in handler-helper
			let childModel = Session.associations[request.params.childModel].target;
			// call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.addMany(Session, request.params.sessionId, childModel, request.params.childModel, request.payload);
			return result;
		},

		removeMany: async (request, h) => {
			// Admin can remove one or more child model from an Session
			// Call an async function with await inside in handler-helper
			let childModel = Session.associations[request.params.childModel].target;
			// call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.removeMany(Session, request.params.sessionId, childModel, request.params.childModel, request.payload);
			return result;
		},

		getAll: async (request, h) => {
			// Admin can get list of Child model related to Session
			// Call an async function with await inside in handler-helper
			let childModel = Session.associations[request.params.childModel].target;
			// call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
			let result = await HandlerHelper.getAll(Session, request.params.sessionId, childModel, request.params.childModel, request.query);
			return result;
		},
	};

module.exports = Handler;