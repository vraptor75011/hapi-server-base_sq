const Boom = require('boom');
const { apiLogger, chalk } = require('../logging/logging');
const _ = require('lodash');

module.exports = {

	/**
	 * Error response types.
	 */
	types: {
		BAD_REQUEST: "Bad Request",
		SERVER_TIMEOUT: "Server Timeout",
		NOT_FOUND: "Not Found",
		GATEWAY_TIMEOUT: "Gateway Timeout",
		BAD_IMPLEMENTATION: "Bad Implementation",
	},

	/**
	 * Creates a rest-hapi error with a message and a type or throws if error is already a rest-hapi error.
	 * @param error: The system error/rest-hapi error.
	 * @param message: The error message.
	 * @param type: The response type.
	 */
	handleError: function(error, message, type) {
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
	 * Processes errors based on their response type
	 * @param error: A rest-hapi error.
	 * @returns {object} A Boom response.
	 */
	formatResponse: (error) => {
		try {
			let response = {};
			switch (error.type) {
				case this.types.SERVER_TIMEOUT:
					response = Boom.serverTimeout(error.message);
					break;
				case this.types.GATEWAY_TIMEOUT:
					response = Boom.gatewayTimeout(error.message);
					break;
				case this.types.NOT_FOUND:
					response = Boom.notFound(error.message);
					break;
				case this.types.BAD_REQUEST:
					response = Boom.badRequest(error.message);
					break;
				case this.types.BAD_IMPLEMENTATION:
					response = Boom.badImplementation(error.message);
					break;
				default:
					response = Boom.badRequest(error.message);
			}
			return response;
		}
		catch(error) {
			apiLogger.error(chalk.red(error));
			return error;
		}
	},

	/**
	 * Processes errors based on their response type
	 * @param request: The query request.
   * @param h: The Hapi Response Toolkit.
   * @param err: The error throw during validation.
	 * @returns {object} A Boom response.
	 */
	failAction: async (request, h, err) => {
		let polyglot = request.polyglot;
		let locale = polyglot.locale();
		if (process.env.NODE_ENV === 'production') {
			// In prod, log a limited error message and throw the default Bad Request error.
			apiLogger.warn(chalk.blue('ValidationError:', err.message)); // Better to use an actual logger here.
			throw Boom.badRequest(`Invalid request validation input`);
		} else {
			// During development, log and respond with the full error.
			apiLogger.warn(chalk.blue('ValidationError:', err.message));
			let error = Boom.badRequest(err.message);
			err.details.forEach((detail) => {
				let index = _.indexOf(detail.message, ' ');
				detail.message = detail.message.slice(index+1);
			});
			error.output.payload.details = err.details;
			throw error;
		}
	}
};
