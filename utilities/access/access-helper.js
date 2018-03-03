const Boom = require('boom');
const { apiLogger, chalk } = require('../logging/logging');
const _ = require('lodash');

const ModelValidation = require('../validation/model_validations');

module.exports = {
	/**
	 * response with authorization to update a model the is owned by the userID.
	 * @param model: The model to update.
	 * @param modelId: The model object ID to update.
	 * @param userId: The current userID that try to update the model.
	 * @param payload: the model attributes to update.
	 */
	putSameObject: (model, modelId, userId, payload) => {
		if (error.type) {
			apiLogger.error(chalk.red(error));
			throw error;
		}
		else {
			apiLogger.error(chalk.red(error));
			message = message || error;
			throw { message: message, type: type };
		}
	},

	/**
	 * response with authorization to update a model the is owned by the userID.
	 * @param model: The model to update.
	 * @param userId: The current userID that try to update the model.
	 * @param query: the query URL to modify depending by current User Role and current userId.
	 */
	getPublic: (model, userId, query) => {
		const Validation = ModelValidation(model);
		let attributes = Validation.Attributes;

		if (_.includes(attributes, 'public')) {
			query['$special'] = query['$special'] || {};
			query['$special']['public'] = '{or}{=}true';
		}
		if (_.includes(attributes, 'userId')) {
			query['$special'] = query['$special'] || {};
			query['$special']['userId'] = '{or}{=}'+userId;
		}

		return query
	},


};