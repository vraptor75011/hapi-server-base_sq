const Joi = require('joi');
const _ = require('lodash');
const {lang, stuff} = require('../../../utilities/validation/base_validation');

module.exports = {
	//URL Query
	query: Joi.object().keys(_.assign({}, lang, stuff)),

};