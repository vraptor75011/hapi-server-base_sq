const Joi = require('joi');
const _ = require('lodash');
const DB = require('../../../config/sequelize');
const ModelValidation = require('../../../utilities/validation/model_validations');
const ModelRelationValidation = require('../../../utilities/validation/model_relation_validations');
const BaseValidation = require('../../../utilities/validation/base_validation');

const TModel = require('../../../locales/it_IT/model/model');
const TWeb = require('../../../locales/it_IT/web_app/scaffold');


// Base Validation
let lang = BaseValidation.lang;

module.exports = {
	//URL Query
	queryLang: Joi.object().keys(_.assign({}, lang)),

};