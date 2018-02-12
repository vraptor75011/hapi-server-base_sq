const Polyglot = require('./../../plugins/hapi-polyglot/polyglot');

let polyglot = Polyglot.getPolyglot();

module.exports = (request) => {
	let response = request.response;
	let statusCode = response.output.payload.statusCode;
	if (statusCode === 401 || statusCode === 500) {
		response.output.payload.error = polyglot.t(response.output.payload.error);
		response.output.payload.message = polyglot.t(response.output.payload.message);
	}

	if (statusCode === 400) {
		let details = response.output.payload.details;
		details.forEach((detail) => {
			if (detail.context.limit) {
				detail.message = polyglot.t(detail.type, {limit: detail.context.limit});
			} else {
				detail.message = polyglot.t(detail.type);
			}

			detail.context.label = polyglot.t(detail.context.label);
		});

	}

	return response
};