const Joi = require('joi');
const _ = require('lodash');
const {lang, stuff, file} = require('../../../../utilities/validation/base_validation');

module.exports = {
	//URL Query
	query: Joi.object().keys(_.assign({}, lang, stuff)),

	params: Joi.object().keys(_.assign({}, lang, file))

};