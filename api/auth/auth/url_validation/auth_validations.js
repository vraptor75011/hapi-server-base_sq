const Joi = require('joi');
const UserValidation = require('../../user/url_validation/user_validation_base');
const BaseValidation = require('../../../../utilities/validation/base_validation');

let lang = BaseValidation.lang;


module.exports = {
	queryLang: lang,

	loginPayload: Joi.alternatives().try(
		Joi.object({
			username: Joi.string().min(5).max(64).required(),
			password: Joi.string().required(),
			realm: Joi.string().max(64)
		}),
		Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().required(),
			realm: Joi.string().max(64)
		}),
	),

	logoutPayload: Joi.object().keys({
		sessionKey: Joi.string().max(255).required(),
	}),

	registrationPayload :Joi.object().keys({
		user: Joi.object().keys(UserValidation.registrationPayloadObj).required(),
		// registerType: Joi.string().valid(['Registration', 'Invite']).default('Registration')
	}),

	invitationPayload :Joi.object().keys({
		user: Joi.object().keys(UserValidation.registrationPayloadObj).required(),
	}),

	activationQuery: Joi.object().keys({
		token: Joi.string().required(),
		lang: lang.lang,
	}),

	resetPWDPayload :Joi.object().keys({
		user: Joi.object().keys(UserValidation.registrationResetPWDPayloadObj).required(),
	}),

};
