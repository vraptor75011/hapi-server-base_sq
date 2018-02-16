const DB = require('../../../../../config/sequelize');
const HandlerHelper = require('../../../../../utilities/handler/handler-helper');
const { apiLogger, chalk } = require('../../../../../utilities/logging/logging');
const Sequelize = require('sequelize');
const Boom = require('boom');
const Polyglot = require('./../../../../../plugins/hapi-polyglot/polyglot');

const Op = Sequelize.Op;

const AuthUser = DB.AuthUser;

let polyglot = Polyglot.getPolyglot();

module.exports = {
	findAll: async (request, h) => {
		// Call listAll async function with await inside handler-helper
		// call LIST Handler for CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		return await HandlerHelper.list(AuthUser, request.query);

	},

	findOne: async (request, h) => {
		// Call an async function with await inside in handler-helper
		// call FIND ONE Handler for CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		return await HandlerHelper.find(AuthUser, request.params.userId, request.query);

	},

	create: async (request, h) => {
		// Call an async function with await inside in handler-helper
		// Only for Admin to Add a new AuthUser without free registration
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		request.payload.password = await AuthUser.hashPassword(request.payload.password);
		// call CREATE Handler for CRUD function valid for all present models
		return await HandlerHelper.create(AuthUser, request.payload);

	},

	update: async (request, h) => {
		// Admin and AuthUser can update an AuthUser, but AuthUser can't change his roles and realms
		// Call an async function with await inside in handler-helper

		// call CREATE Handler for CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		return await HandlerHelper.update(AuthUser, request.params.userId, request.payload);
	},

	delete: async (request, h) => {
		// Admin can delete an AuthUser
		// Call an async function with await inside in handler-helper

		// call DELETE Handler for CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		return await HandlerHelper.deleteOne(AuthUser, request.params.userId, request.payload);
	},

	deleteMany: async (request, h) => {
		// Admin can delete an AuthUser
		// Call an async function with await inside in handler-helper

		// call DELETE MANY Handler for EXTRA CRUD function valid for all present models
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		return await HandlerHelper.deleteMany(AuthUser, request.payload);
	},

	addOne: async (request, h) => {
		// Admin can add one child model to an AuthUser
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthUser.associations[request.params.childModel].target;
		// call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.addOne(AuthUser, request.params.userId, childModel, request.params.childId, request.params.childModel);
	},

	removeOne: async (request, h) => {
		// Admin can remove one child model from an AuthUser
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthUser.associations[request.params.childModel].target;
		// call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.removeOne(AuthUser, request.params.userId, childModel, request.params.childId, request.params.childModel);
	},

	addMany: async (request, h) => {
		// Admin can add one or more child model to an AuthUser
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthUser.associations[request.params.childModel].target;
		// call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.addMany(AuthUser, request.params.userId, childModel, request.params.childModel, request.payload);
	},

	removeMany: async (request, h) => {
		// Admin can remove one or more child model from an AuthUser
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthUser.associations[request.params.childModel].target;
		// call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.removeMany(AuthUser, request.params.userId, childModel, request.params.childModel, request.payload);
	},

	getAll: async (request, h) => {
		// Admin can get list of Child model related to AuthUser
		// Call an async function with await inside in handler-helper
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let childModel = AuthUser.associations[request.params.childModel].target;
		// call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
		return await HandlerHelper.getAll(AuthUser, request.params.userId, childModel, request.params.childModel, request.query);
	},

	// TRANSLATIONS - for AuthUser model
	translation: async (request, h) => {
		apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let modelName = AuthUser.name;
		let translation = require('../../../../locales/'+ polyglot.locale()+'/model/model');
		//translation[modelName] = _.extend(translation[modelName], translation.common);
		// Logged user can get list of AuthUser model translation
		const Translation = {
			translation: {
				[modelName]: translation[modelName],
				common: translation.common,
				relation: translation.relation,
			}
		};
		return Translation;
	},

	// EXTRA Handlers
	checkEmail: async (request, h) => {
		try {
			apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let condition = {where: {email: {[Op.eq]: request.payload.email}}};
			let user = await AuthUser.findOne(condition);
			if (user) {
				return h.response(true);
			}
			else {
				return h.response(false);
			}
		} catch (error) {
			apiLogger.error(chalk.red(error));
			return Boom.badImplementation('There was an error accessing the database.');
		}
	},

};