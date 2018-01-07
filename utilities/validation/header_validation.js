const Joi = require('joi');


const auth = {
	authorization: Joi.string().required(),
};

const authOptional = {
	authorization: Joi.string(),
};

const HeaderValidations = {
	headerRequired: Joi.object().keys(Object.assign({}, auth)).options({ allowUnknown: true }),
	headerOptional: Joi.object().keys(Object.assign({}, authOptional)).options({ allowUnknown: true }),
};




module.exports = HeaderValidations;