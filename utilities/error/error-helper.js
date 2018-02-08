const Boom = require('boom');
const Log = require('../logging/logging');
const Chalk = require('chalk');

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
			Log.apiLogger.error(Chalk.red(error));
			throw error;
		}
		else {
			Log.apiLogger.error(Chalk.red(error));
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
			Log.apiLogger.error(Chalk.red(error));
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
		if (process.env.NODE_ENV === 'production') {
			// In prod, log a limited error message and throw the default Bad Request error.
			Log.apiLogger.error(Chalk.blue('ValidationError:', err.message)); // Better to use an actual logger here.
			throw Boom.badRequest(`Invalid request validation input`);
		} else {
			// During development, log and respond with the full error.
			Log.apiLogger.error(Chalk.blue('ValidationError:', err.message));
			let error = Boom.badRequest(err.message);
			error.output.payload.details = err.details;
			throw error;
		}
	}
};
