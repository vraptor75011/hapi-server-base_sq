const DB = require('../../../../config/sequelize');
const HandlerHelper = require('../../../../utilities/handler/handler-helper');
const Log = require('../../../../utilities/logging/logging');
const Chalk = require('chalk');
const Sequelize = require('sequelize');
const Boom = require('boom');
const _ = require('lodash');
const Polyglot = require('./../../../../plugins/hapi-polyglot/polyglot');

const Op = Sequelize.Op;

const User = DB.User;

let polyglot = Polyglot.getPolyglot();

module.exports = {
	// TRANSLATIONS - One endpoints for all translation
	translation: async (request, h) => {
		Log.apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
		let modelName = User.name;
		let translation = require('../../../../locales/'+ polyglot.locale()+'/model/model');
		//translation[modelName] = _.extend(translation[modelName], translation.common);
		// Logged user can get list of User model translation
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
			Log.apiLogger.info('Method: ' + request.method.toUpperCase() + ' Request: ' + request.path);
			let condition = {where: {email: {[Op.eq]: request.payload.email}}};
			let user = await User.findOne(condition);
			if (user) {
				return h.response(true);
			}
			else {
				return h.response(false);
			}
		} catch (error) {
			Log.apiLogger.error(Chalk.red(error));
			return Boom.badImplementation('There was an error accessing the database.');
		}
	},

};