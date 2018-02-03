const DB = require('../../../../config/sequelize');
const HandlerHelper = require('../../../../utilities/handler/handler-helper');

const RealmsRolesUsers = DB.RealmsRolesUsers;


const Handler =
	{
		findAll: async (request, h) => {
			// Call listAll async function with await inside handler-helper
			// call LIST Handler for CRUD function valid for all present models
			let result = await HandlerHelper.list(RealmsRolesUsers, request.query);
			return h.response(result);

		},

		findOne: async (request, h) => {
			// Call an async function with await inside in handler-helper
			// call FIND ONE Handler for CRUD function valid for all present models
			let user = await HandlerHelper.find(RealmsRolesUsers, request.params.realmsRolesUsersId, request.query);
			return h.response(user);

		},

		create: async (request, h) => {
			// Call an async function with await inside in handler-helper
			// Only for Admin to Add a new RealmsRolesUsers without free registration

			// call CREATE Handler for CRUD function valid for all present models
			let user = await HandlerHelper.create(RealmsRolesUsers, request.payload);
			return h.response(user);

		},

		update: async (request, h) => {
			// Admin and RealmsRolesUsers can update an RealmsRolesUsers, but RealmsRolesUsers can't change his roles and realms
			// Call an async function with await inside in handler-helper

			// call CREATE Handler for CRUD function valid for all present models
			let user = await HandlerHelper.update(RealmsRolesUsers, request.params.realmsRolesUsersId, request.payload);
			return h.response(user);
		},

		delete: async (request, h) => {
			// Admin can delete an RealmsRolesUsers
			// Call an async function with await inside in handler-helper

			// call DELETE Handler for CRUD function valid for all present models
			let response = await HandlerHelper.deleteOne(RealmsRolesUsers, request.params.realmsRolesUsersId, request.payload);
					return h.response(response);
		},

		deleteMany: async (request, h) => {
			// Admin can delete an RealmsRolesUsers
			// Call an async function with await inside in handler-helper

			// call DELETE MANY Handler for EXTRA CRUD function valid for all present models
			let response = await HandlerHelper.deleteMany(RealmsRolesUsers, request.payload);
			return h.response(response);
		},

		addOne: async (request, h) => {
			// Admin can add one child model to an RealmsRolesUsers
			// Call an async function with await inside in handler-helper
			let childModel = RealmsRolesUsers.associations[request.params.childModel].target;
			// call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
			let response = await HandlerHelper.addOne(RealmsRolesUsers, request.params.realmsRolesUsersId, childModel, request.params.childId, request.params.childModel);
			return h.response(response);
		},

		removeOne: async (request, h) => {
			// Admin can remove one child model from an RealmsRolesUsers
			// Call an async function with await inside in handler-helper
			let childModel = RealmsRolesUsers.associations[request.params.childModel].target;
			// call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
			let response = await HandlerHelper.removeOne(RealmsRolesUsers, request.params.realmsRolesUsersId, childModel, request.params.childId, request.params.childModel);
			return h.response(response);
		},

		addMany: async (request, h) => {
			// Admin can add one or more child model to an RealmsRolesUsers
			// Call an async function with await inside in handler-helper
			let childModel = RealmsRolesUsers.associations[request.params.childModel].target;
			// call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let response = await HandlerHelper.addMany(RealmsRolesUsers, request.params.realmsRolesUsersId, childModel, request.params.childModel, request.payload);
			return h.response(response);
		},

		removeMany: async (request, h) => {
			// Admin can remove one or more child model from an RealmsRolesUsers
			// Call an async function with await inside in handler-helper
			let childModel = RealmsRolesUsers.associations[request.params.childModel].target;
			// call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
			let response = await HandlerHelper.removeMany(RealmsRolesUsers, request.params.realmsRolesUsersId, childModel, request.params.childModel, request.payload);
			return h.response(response);
		},

		getAll: async (request, h) => {
			// Admin can get list of Child model related to RealmsRolesUsers
			// Call an async function with await inside in handler-helper
			let childModel = RealmsRolesUsers.associations[request.params.childModel].target;
			// call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
			let response = await HandlerHelper.getAll(RealmsRolesUsers, request.params.realmsRolesUsersId, childModel, request.params.childModel, request.query);
			return h.response(response);
		},
	};

module.exports = Handler;