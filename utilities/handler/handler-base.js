const _ = require('lodash');
const Joi = require('joi');
const SchemaUtility = require('../schema/schema_utility');
const DB = require('../../config/sequelize');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

// Only ONE element follows
const Operators = ['{=}', '{<}', '{<=}', '{>}', '{>=}', '{<>}'];
const SQOperators = {
    '{=}': Op.eq,
    '{<}': Op.lt,
    '{<=}': Op.lte,
    '{>}': Op.gt,
    '{>=}': Op.gte,
    '{<>}': Op.ne,
};

const LikeOperators = ['{like}', '{notlike}', '{like%}', '{notlike%}', '{%like}', '{not%like}'];
const SQLikeOperators = {
    '{like}': Op.like,
    '{%like}': Op.like,
    '{like%}': Op.like,
    '{notlike}': Op.notLike,
    '{not%like}': Op.notLike,
    '{notlike%}': Op.notLike,
};

// Array follows
const InOperators = ['{in}', '{notin}'];
const SQInOperators = {
    '{in}': Op.in,
    '{notin}': Op.notIn,
};
// Array follows ONLY TWO elements
const BtwOperators = ['{btw}', '{notbtw}'];
const SQBtwOperators = {
    '{btw}': Op.between,
    '{notbtw}': Op.notBetween,
};
// End condition
const NullOperators = ['{NULL}', '{notNULL}', '{not}'];
const SQNullOperators = {
    '{NULL}': Op.eq,
    '{notNULL}': Op.ne,
    '{not}': Op.ne,
};
// Changes Where => OR Array with Where elements
const OrOperators = ['{or}'];
const SQOrOperators = {
    '{or}': Op.or,
    // '{and}': Op.and,
};

const ALLOperators = _.union(Operators, LikeOperators, InOperators, BtwOperators, NullOperators, OrOperators);

//Object to export
const PreHandlerBase = {
    filterParser: (response, key, value, schema) => {

        return filterParser(response, key, value, schema);
    },

    sortParser: (response, value, schema) => {

        return sortParser(response, value, schema);
    },

    mathParser: function(response, op, value, schema) {
        let realValue = _.replace(value, '{'+schema.name+'}', '');

        response = realValue;

        return response;
    },

    extraParser: function(response, op, value, schema) {
        let models = schema.sequelize.models;
        // let group = response.queryData.group;
        // let fields = response.queryData.fields;
        // let include = response.queryData.include;
        // let includeFlag = response.queryData.withCountFlag;
        // let sort = response.queryData.sort;
        // let error = response.queryData.error;
        value.forEach(function(el){
            let responseChanged = false;
            if (op === 'fields') {
                let realValue = _.replace(el, '{'+schema.name+'}', '');

                let tmp = _.split(realValue, ',');
                tmp.forEach(function(col){
                    fields.push(col);
                });
                responseChanged = true;
            }

            if (op === 'withCount' && !responseChanged) {
                if (includeFlag === false) {
                    response.queryData.include = [];
                    include = response.queryData.include;
                    includeFlag = true;
                }
                let includeLevel = include;
                let fieldsLevel = fields;
                group.push(schema.name + '.id');
                response.queryData.includeIgnoreAttributes = false;
                if (!_.some(includeLevel, {association: el})) {
                    let tmp = {};
                    tmp.association = el;
                    tmp.attributes = [];
                    tmp.duplicating = false;
                    fieldsLevel.push([Sequelize.fn('COUNT', Sequelize.col(el + '.' + 'id')), _.camelCase(el) + 'Count']);
                    includeLevel.push(tmp);
                }

                responseChanged = true;
            }

            if (op === '$withRelated' && !responseChanged) {
                response['include'] = response.include || [];
                let includeLevel = response.include;
                let schemaClone = _.clone(schema);
                let relTree = _.split(el,'.');
                relTree.forEach(function(levelRel, level){
                    let firstLevelRelations = SchemaUtility.relationFromSchema(schemaClone, 2);
                    firstLevelRelations.forEach(function(rel){
                        if (levelRel === rel.name) {
                            if (!_.some(includeLevel, {association: rel.name})) {
                                if (level === 0) {
                                    let tmp = {};
                                    tmp.association = rel.name;
                                    includeLevel.push(tmp);
                                    includeLevel = tmp;
                                } else if (level > 0) {
                                    if (!_.has(includeLevel, 'include')) {
                                        includeLevel['include'] = [];
                                    }
                                    if (!_.some(includeLevel['include'], {association: rel.name})) {
                                        let tmp = {};
                                        tmp.association = rel.name;
                                        includeLevel['include'].push(tmp);
                                        includeLevel = tmp;
                                    }
                                }
                            } else {
                                includeLevel.forEach(function(elInclude){
                                    if (_.includes(elInclude.association, rel.name)) {
                                        includeLevel = elInclude;
                                    }
                                });
                            }
                            schemaClone = models[rel.model];
                        }
                    });
                });

                responseChanged = true;
            }

            if (op === '$withFields' && !responseChanged) {
                response['include'] = response.include || [];
                let relation = '';
                let prefix = '';
                let associations = SchemaUtility.relationFromSchema(schema, 2);

                associations.forEach(function(rel){
                    if (_.includes(el, rel.name)) {
                        relation = rel.name;
                        prefix = '{' + relation + '}';
                    }
                });

                let realValue = _.replace(el, prefix, '');

                let includeLevel = include;
                let schemaClone = _.clone(schema);
                let relTree = _.split(relation,'.');
                relTree.forEach(function(levelRel, level){
                    let firstLevelRelations = SchemaUtility.relationFromSchema(schemaClone, 2);
                    firstLevelRelations.forEach(function(rel){
                        if (levelRel === rel.name) {
                            if (!_.some(includeLevel, {association: rel.name})) {
                                if (level === 0) {
                                    let tmp = {};
                                    tmp.association = rel.name;
                                    includeLevel.push(tmp);
                                    includeLevel = tmp;
                                } else if (level > 0) {
                                    if (!_.has(includeLevel, 'include')) {
                                        includeLevel['include'] = [];
                                    }
                                    if (!_.some(includeLevel['include'], {association: rel.name})) {
                                        let tmp = {};
                                        tmp.association = rel.name;
                                        includeLevel['include'].push(tmp);
                                        includeLevel = tmp;
                                    }
                                }
                            } else {
                                includeLevel.forEach(function(elInclude){
                                    if (_.includes(elInclude.association, rel.name)) {
                                        includeLevel = elInclude;
                                    }
                                });
                            }
                            schemaClone = models[rel.model];
                        }
                    });
                });

                let columns = _.split(realValue, ',');

                if (!_.has(includeLevel, 'attributes')) {
                    includeLevel['attributes'] = [];
                }
                columns.forEach(function(col){
                    includeLevel['attributes'].push(col);
                });

                responseChanged = true;
            }

            if (op === 'withSort' && !responseChanged) {
                let relation = '';
                let prefix = '';
                let associations = SchemaUtility.relationFromSchema(schema, 2);

                associations.forEach(function(rel){
                    if (_.includes(el, rel.name)) {
                        relation = rel.name;
                        prefix = '{' + relation + '}';
                    }
                });

                let realValue = _.replace(el, prefix, '');

                let includeLevel = include;
                let schemaClone = _.clone(schema);
                let relTree = _.split(relation,'.');
                relTree.forEach(function(levelRel, level){
                    let firstLevelRelations = SchemaUtility.relationFromSchema(schemaClone, 2);
                    firstLevelRelations.forEach(function(rel){
                        if (levelRel === rel.name) {
                            if (!_.some(includeLevel, {association: rel.name})) {
                                if (level === 0) {
                                    let tmp = {};
                                    tmp.association = rel.name;
                                    includeLevel.push(tmp);
                                    includeLevel = tmp;
                                } else if (level > 0) {
                                    if (!_.has(includeLevel, 'include')) {
                                        includeLevel['include'] = [];
                                    }
                                    if (!_.some(includeLevel['include'], {association: rel.name})) {
                                        let tmp = {};
                                        tmp.association = rel.name;
                                        includeLevel['include'].push(tmp);
                                        includeLevel = tmp;
                                    }
                                }
                            } else {
                                includeLevel.forEach(function(elInclude){
                                    if (_.includes(elInclude.association, rel.name)) {
                                        includeLevel = elInclude;
                                    }
                                });
                            }
                            schemaClone = models[rel.model];
                        }
                    });
                });

                let columns = _.split(realValue, ',');

                columns.forEach(function(col){
                    let direction = _.includes(col, '-') ? 'DESC' : 'ASC';

                    realValue = _.replace(_.replace(col, '-', ''), '+', '');

                    let tmp = [];
                    let relArray = _.split(relation,'.');
                    relArray.forEach(function(rel){
                        tmp.push(rel);
                    });
                    tmp.push(realValue);
                    tmp.push(direction);
                    sort.push(tmp);
                });

                responseChanged = true;
            }

            if (op === '$withFilter' && !responseChanged) {
                response['include'] = response.include || [];

                let relation = '';        // User relation name
                let model = '';           // relation Model
                let attribute = '';       // Relation attribute with condition
                let dbAttribute = '';     // DB Attribute name (Snake Case);
                let prefix = '';
                let suffix = '';
                let realValue = '';       // Final condition value;

                // relation and attribute
                let associations = SchemaUtility.relationFromSchema(schema, 2);

                associations.forEach(function(rel){
                    if (_.includes(el, '{' + rel.name + '}')) {
                        relation = rel.name;
                        model = models[rel.model];
                        prefix = '{' + rel.name + '}';
                        Object.keys(model.attributes).map((attr) => {
                            if (_.includes(el, '{' + attr + '}')) {
                                attribute = attr;
                                dbAttribute = attribute;
                                suffix = '{' + attribute + '}';
                            }
                        });
                    }
                });

                realValue = _.replace(_.replace(el, prefix, ''), suffix, '');

                let includeLevel = response.include;
                let schemaClone = schema;
                let relTree = _.split(relation,'.');
                relTree.forEach(function(levelRel, level){
                    let firstLevelRelations = SchemaUtility.relationFromSchema(schemaClone, 2);
                    firstLevelRelations.forEach(function(rel){
                        if (levelRel === rel.name) {
                            if (!_.some(includeLevel, {model: models[rel.model]})) {
                                if (level === 0) {
                                    let tmp = {};
                                    tmp.model = models[rel.model];
                                    includeLevel.push(tmp);
                                    includeLevel = tmp;
                                } else if (level > 0) {
                                    if (!_.has(includeLevel, 'include')) {
                                        includeLevel['include'] = [];
                                    }
                                    if (!_.some(includeLevel['include'], {model: rel.model})) {
                                        let tmp = {};
                                        tmp.model = models[rel.model];
                                        includeLevel['include'].push(tmp);
                                        includeLevel = tmp;
                                    }
                                }
                            } else {
                                includeLevel.forEach(function(elInclude){
                                    if (_.includes(elInclude.association, rel.name)) {
                                        includeLevel = elInclude;
                                    }
                                });
                            }
                            schemaClone = models[rel.model];
                        }
                    });
                });

                includeLevel = filterParser(includeLevel, dbAttribute, [realValue], schemaClone);

            }


        });
        return response;
    },
};

module.exports = PreHandlerBase;


/**
 * Given a set of parameters, the function builds the string (or upgrade it)
 * to include in the Sequelize query string the model attributes conditions filters
 * @param response: A string with the building Sequelize query.
 * @param key: The URL Query object key to one attribute.
 * @param value: The URL Query object key value to one attribute.
 * @param schema: The model is building for Sequelize query string.
 * @returns {string} The building Sequelize query string.
 * @private
 */
let filterParser = (response, key, value, schema) => {
    response['where'] = response.where || {};
    let actualLevel = response.where;
    value.forEach(function(el){
        actualLevel = response.where;
        let dbAttribute = key;     // DB Attribute name (Camel Case);
        let realValue = el;       // Final condition value;
        let or = false;

        //Least one operator. Always
        let addEQ = true;
        ALLOperators.forEach( (op) => {
            if (_.includes(realValue, op)) {
                addEQ = false;
            }
        });
        if (addEQ) {
            realValue = '{=}'+realValue;
        }

        // OR operator
        OrOperators.forEach( (op) => {
            if (_.includes(realValue, op) && op === '{or}') {
                or = true;
                realValue = _.replace(realValue, op, '');
                if (!_.has(actualLevel, SQOrOperators[op])) {
                    _.set(actualLevel, SQOrOperators[op], []);
                }
                actualLevel = actualLevel[SQOrOperators[op]];
            }
        });

        // BETWEEN operator
        BtwOperators.forEach( (op) => {
            if (_.includes(realValue, op)) {
                if (or) {
                    let btw = {};
                    _.set(btw, key, {});
                    _.set(btw[key], SQBtwOperators[op], _.split(_.replace(realValue, op, ''), ','));
                    actualLevel.push(btw);
                } else {
                    if (!_.has(actualLevel, dbAttribute)) {
                        _.set(actualLevel, dbAttribute, {});
                    }
                    actualLevel = actualLevel[dbAttribute];

                    let tmp = _.split(_.replace(realValue, op, ''), ',');
                    if (!_.has(actualLevel, SQBtwOperators[op])) {
                        _.set(actualLevel, SQBtwOperators[op], tmp);
                    }
                }
            }
        });

        // IN operator
        InOperators.forEach( (op) => {
            if (_.includes(realValue, op)) {
                if (or) {
                    let btw = {};
                    _.set(btw, key, {});
                    _.set(btw[key], SQInOperators[op], _.split(_.replace(realValue, op, ''), ','));
                    actualLevel.push(btw);
                } else {
                    if (!_.has(actualLevel, dbAttribute)) {
                        _.set(actualLevel, dbAttribute, {});
                    }
                    actualLevel = actualLevel[dbAttribute];

                    let tmp = _.split(_.replace(realValue, op, ''), ',');
                    if (!_.has(actualLevel, SQInOperators[op])) {
                        _.set(actualLevel, SQInOperators[op], tmp);
                    }
                }
            }
        });

        // NULL operator
        NullOperators.forEach( (op) => {
            if (_.includes(realValue, op)) {
                if (or) {
                    let btw = {};
                    _.set(btw, key, {});
                    _.set(btw[key], SQNullOperators[op], _.split(_.replace(realValue, op, ''), ','));
                    actualLevel.push(btw);
                } else {
                    if (!_.has(actualLevel, dbAttribute)) {
                        _.set(actualLevel, dbAttribute, {});
                    }
                    actualLevel = actualLevel[dbAttribute];

                    let tmp = null;
                    if (op === '{not}') {
                        tmp = _.replace(realValue, op, '');
                    }
                    if (!_.has(actualLevel, SQNullOperators[op])) {
                        _.set(actualLevel, SQNullOperators[op], tmp);
                    }
                }
            }
        });

        // NULL operator
        LikeOperators.forEach( (op) => {
            if (_.includes(realValue, op)) {
                if (or) {
                    let btw = {};
                    _.set(btw, key, {});
                    _.set(btw[key], SQLikeOperators[op], _.split(_.replace(realValue, op, ''), ','));
                    actualLevel.push(btw);
                } else {
                    if (!_.has(actualLevel, dbAttribute)) {
                        _.set(actualLevel, dbAttribute, {});
                    }
                    actualLevel = actualLevel[dbAttribute];

                    let tmp = '';
                    switch (op) {
                        case '{%like}': {
                            tmp = '%' + _.replace(realValue, op, '');
                            break
                        }
                        case '{like}': {
                            tmp = '%' + _.replace(realValue, op, '') +'%';
                            break;
                        }
                        case '{like%}': {
                            tmp = _.replace(realValue, op, '') + '%';
                            break;
                        }
                    }

                    if (!_.has(actualLevel, SQLikeOperators[op])) {
                        _.set(actualLevel, SQLikeOperators[op], tmp);
                    }
                }
            }
        });


        // LOGICAL operator
        Operators.forEach( (op) => {
            if (_.includes(realValue, op)) {
                realValue = _.replace(realValue, op, '');
                const result = Joi.validate({[dbAttribute]: realValue}, schema.joiValid);
                if (result.error) {
                    throw result.error.message;
                }

                let attr = schema.attributes[dbAttribute];

                if (attr.type.key === 'BOOLEAN') {
                    if (realValue === 'true' || realValue === '1' || realValue === 1) {
                        realValue = true;
                    } else {
                        realValue = false;
                    }

                }

                if (or) {
                    let btw = {};
                    _.set(btw, key, {});
                    _.set(btw[key], SQOperators[op], realValue);
                    actualLevel.push(btw);
                } else {

                    if (!_.has(actualLevel, dbAttribute)) {
                        _.set(actualLevel, dbAttribute, {});
                    }
                    actualLevel = actualLevel[dbAttribute];

                    if (!_.has(actualLevel, SQOperators[op])) {
                        _.set(actualLevel, SQOperators[op], realValue);
                    }
                }
            }
        });


    });
    return response;
};

/**
 * Given a set of parameters, the function builds the string (or upgrade it)
 * to include in the Sequelize query string the model attributes conditions to sort
 * @param response: A string with the building Sequelize query.
 * @param value: The URL Query object key value to one attribute.
 * @param schema: The model is building for Sequelize query string.
 * @returns {string} The building Sequelize query string.
 * @private
 */
let sortParser = (response, value, schema) => {
    response['order'] = response.order || [];
    value.forEach(function(el){
        let realValue = _.replace(el, '{'+schema.name+'}', '');
        let columns = _.split(realValue, ',');
        columns.forEach(function(col){
            let direction = _.includes(col, '-') ? 'DESC' : 'ASC';

            realValue = _.replace(_.replace(col, '-', ''), '+', '');

            let tmp = [];
            tmp.push(realValue);
            tmp.push(direction);
            response.order.push(tmp);
        });

    });
    return response;
};