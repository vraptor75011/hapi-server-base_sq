const DB = require('../../../../../config/sequelize');
const { apiLogger, chalk } = require('../../../../../utilities/logging/logging');
const Sequelize = require('sequelize');
const Boom = require('boom');

const HandlerHelper = require('../../../../../utilities/handler/handler-helper');
const AccessHelper = require('../../../../../utilities/access/access-helper');

const Polyglot = require('./../../../../../plugins/hapi-polyglot/polyglot');

const Op = Sequelize.Op;

const AuthProfile = DB.AuthProfile;

let polyglot = Polyglot.getPolyglot();

module.exports = {
	findAll: async (request, h) => {
		// Call listAll async function with await inside handler-helper
		// call LIST Handler for CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		request.query = AccessHelper.getNoHerachy(AuthProfile, request.auth.credentials.user.id, request.query);
		return await HandlerHelper.list(AuthProfile, request.query);

	},

	findOne: async (request, h) => {
		// Call an async function with await inside in handler-helper
		// call FIND ONE Handler for CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		request.query = AccessHelper.getNoHerachy(AuthProfile, request.auth.credentials.user.id, request.query);
		let result = await HandlerHelper.find(AuthProfile, request.params.profileId, request.query);
		if (result.isBoom) {
			return result;
		}
		return result;
	},

	create: async (request, h) => {
		// Call an async function with await inside in handler-helper
		// Only for Admin to Add a new AuthProfile without free registration
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		request.payload.password = await AuthProfile.hashPassword(request.payload.password);
		// call CREATE Handler for CRUD function valid for all present models
		return await HandlerHelper.create(AuthProfile, request.payload);

	},

	update: async (request, h) => {
		// Admin and AuthProfile can update an AuthProfile, but AuthProfile can't change his roles and realms
		// Call an async function with await inside in handler-helper

		// call CREATE Handler for CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		return await HandlerHelper.update(AuthProfile, request.params.profileId, request.payload);
	},

	delete: async (request, h) => {
		// Admin can delete an AuthProfile
		// Call an async function with await inside in handler-helper

		// call DELETE Handler for CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		return await HandlerHelper.deleteOne(AuthProfile, request.params.profileId, request.payload);
	},

	deleteMany: async (request, h) => {
		// Admin can delete an AuthProfile
		// Call an async function with await inside in handler-helper

		// call DELETE MANY Handler for EXTRA CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		return await HandlerHelper.deleteMany(AuthProfile, request.payload);
	},

	addOne: async (request, h) => {
		// Admin can add one child model to an AuthProfile
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthProfile.associations[request.params.childModel].target;
		// call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.addOne(AuthProfile, request.params.profileId, childModel, request.params.childId, request.params.childModel);
	},

	removeOne: async (request, h) => {
		// Admin can remove one child model from an AuthProfile
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthProfile.associations[request.params.childModel].target;
		// call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.removeOne(AuthProfile, request.params.profileId, childModel, request.params.childId, request.params.childModel);
	},

	addMany: async (request, h) => {
		// Admin can add one or more child model to an AuthProfile
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthProfile.associations[request.params.childModel].target;
		// call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.addMany(AuthProfile, request.params.profileId, childModel, request.params.childModel, request.payload);
	},

	removeMany: async (request, h) => {
		// Admin can remove one or more child model from an AuthProfile
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthProfile.associations[request.params.childModel].target;
		// call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.removeMany(AuthProfile, request.params.profileId, childModel, request.params.childModel, request.payload);
	},

	getAll: async (request, h) => {
		// Admin can get list of Child model related to AuthProfile
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthProfile.associations[request.params.childModel].target;
		// call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.getAll(AuthProfile, request.params.profileId, childModel, request.params.childModel, request.query);
	},

};