const DB = require('../../../../../config/sequelize');
const HandlerHelper = require('../../../../../utilities/handler/handler-helper');
const { apiLogger, chalk } = require('../../../../../utilities/logging/logging');
const Sequelize = require('sequelize');
const Polyglot = require('./../../../../../plugins/hapi-polyglot/polyglot');

const Op = Sequelize.Op;

const AuthAvatar = DB.AuthAvatar;

let polyglot = Polyglot.getPolyglot();

module.exports = {
	findAll: async (request, h) => {
		// Call listAll async function with await inside handler-helper
		// call LIST Handler for CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let result = await HandlerHelper.list(AuthAvatar, request.query);
		if (!result.isBoom) {
			result.nestedPages = await HandlerHelper.result4Relations(result, request.query, AuthAvatar);
		}
		return result

	},

	findOne: async (request, h) => {
		// Call an async function with await inside in handler-helper
		// call FIND ONE Handler for CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let result = await HandlerHelper.find(AuthAvatar, request.params.avatarId, request.query);
		if (!result.isBoom) {
			result.nestedPages = await HandlerHelper.result4Relations(result, request.query, AuthAvatar);
		}
		return result
	},

	create: async (request, h) => {
		// Call an async function with await inside in handler-helper
		// Only for Admin to Add a new AuthAvatar without free registration
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		request.payload.password = await AuthAvatar.hashPassword(request.payload.password);
		// call CREATE Handler for CRUD function valid for all present models
		return await HandlerHelper.create(AuthAvatar, request.payload);

	},

	update: async (request, h) => {
		// Admin and AuthAvatar can update an AuthAvatar, but AuthAvatar can't change his roles and realms
		// Call an async function with await inside in handler-helper

		// call CREATE Handler for CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		return await HandlerHelper.update(AuthAvatar, request.params.avatarId, request.payload);
	},

	delete: async (request, h) => {
		// Admin can delete an AuthAvatar
		// Call an async function with await inside in handler-helper

		// call DELETE Handler for CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		return await HandlerHelper.deleteOne(AuthAvatar, request.params.avatarId, request.payload);
	},

	deleteMany: async (request, h) => {
		// Admin can delete an AuthAvatar
		// Call an async function with await inside in handler-helper

		// call DELETE MANY Handler for EXTRA CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		return await HandlerHelper.deleteMany(AuthAvatar, request.payload);
	},

	addOne: async (request, h) => {
		// Admin can add one child model to an AuthAvatar
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthAvatar.associations[request.params.childModel].target;
		// call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.addOne(AuthAvatar, request.params.avatarId, childModel, request.params.childId, request.params.childModel);
	},

	removeOne: async (request, h) => {
		// Admin can remove one child model from an AuthAvatar
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthAvatar.associations[request.params.childModel].target;
		// call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.removeOne(AuthAvatar, request.params.avatarId, childModel, request.params.childId, request.params.childModel);
	},

	addMany: async (request, h) => {
		// Admin can add one or more child model to an AuthAvatar
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthAvatar.associations[request.params.childModel].target;
		// call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.addMany(AuthAvatar, request.params.avatarId, childModel, request.params.childModel, request.payload);
	},

	removeMany: async (request, h) => {
		// Admin can remove one or more child model from an AuthAvatar
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthAvatar.associations[request.params.childModel].target;
		// call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.removeMany(AuthAvatar, request.params.avatarId, childModel, request.params.childModel, request.payload);
	},

	getAll: async (request, h) => {
		// Admin can get list of Child model related to AuthAvatar
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthAvatar.associations[request.params.childModel].target;
		// call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.getAll(AuthAvatar, request.params.avatarId, childModel, request.params.childModel, request.query);
	},

};