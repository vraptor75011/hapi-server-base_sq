const Joi = require('joi');
const DB = require('../../config/sequelize');
const ValidationBase = require('../validation/validation_utility');
const SchemaUtility = require('../schema/schema_utility');
const QueryHelper = require('../query/query-helper');
const Sequelize = require('sequelize');

let joiCompile = (key, element) => {
    if (key === 'array') {
        let joiArray = [];
        Object.keys(element.items).map((el, index) => {
            joiArray.push(joiCompile(el, element.items[el]));
        });
    }
};

let getFilters = (model) => {
    Object.keys(model.attributes).map((attr, index) => {
        let attribute = model.attributes[attr];
        let type = attribute.type.key;
        let p = Sequelize.INTEGER().key;
        if (type === p) {
            let joi1 = [];
            Object.keys(attribute.query).map((el, index) => {
                let element = attribute.query[el];
                joi1.push(joiCompile(el, element));

                let c = el;
            })
        }
        if (attribute.type === Sequelize.STRING) {
            let a = 3;
        }

    });
};


module.exports = function(model) {
    const FLRelations = SchemaUtility.relationsFromSchema(model, 1, 1);
    const SLRelations = SchemaUtility.relationsFromSchema(model, 2, 2);
    const ALLRelations = SchemaUtility.relationsFromSchema(model, 1, 2);
    const Attributes = QueryHelper.createAttributesList(model);

    const pippo = getFilters(model);

    const filters = {
        id: Joi.alternatives().try(
            Joi.array().items(
                Joi.string().regex(ValidationBase.filterRegExp())
                    .example('{<=}35'),
                Joi.number().integer().min(1)
                    .example(35)
            ).description('the user ID PK increment: [{=}]1 vs [{>}1,{<>}20,{<=}100]')
                .example(['{>}35', '{<}50']),
            Joi.string().regex(ValidationBase.filterRegExp())
                .example('{in}35,40'),
            Joi.number().integer().min(1)
                .example(40),
        ),
        username: Joi.alternatives().try(
            Joi.array().items(
                Joi.string().min(3).regex(ValidationBase.filterRegExp())
                    .example('{like}luigi.rossi'),
            ).description('the username: name vs [{=}pippo1,{<>}pippo3,{like}pip]')
                .example(['{like}rossi', '{like}bianchi']),
            Joi.string().min(3).regex(ValidationBase.filterRegExp())
                .example('{<>}luigi.rossi,marco.tardelli-gobbo'),
        ),
        email: Joi.alternatives().try(
            Joi.array().items(
                Joi.string().max(255).regex(ValidationBase.filterRegExp())
                    .example('{=}luigi.rossi@eataly.it'),
                Joi.string().max(255)
                    .example('{like}eataly.it'),
            ).description('the user email: name vs [{=}pippo1@lol.it,{<>}pippo3@lol.it,{like}pip]')
                .example(['{like}rossi.it', '{like}verdi.it']),
            Joi.string().max(255).regex(ValidationBase.filterRegExp())
                .example('{<>}luigi.rossi@eataly.it'),
            Joi.string().email(),
        ),
        isActive: Joi.alternatives().try(
            Joi.array().description('the user active: true, [true, false]')
                .items(Joi.boolean().valid(true, false)),
            Joi.boolean().description('the user active: true, [true, false]').valid(true, false)
        ),
        firstName: Joi.alternatives().try(
            Joi.array().items(
                Joi.string().min(3).regex(ValidationBase.filterRegExp())
                    .example('{like}luigi.rossi'),
            ).description('the username: name vs [{=}pippo1,{<>}pippo3,{like}pip]')
                .example(['{like}rossi', '{like}bianchi']),
            Joi.string().min(3).regex(ValidationBase.filterRegExp())
                .example('{<>}luigi.rossi,marco.tardelli-gobbo'),
        ),
        lastName: Joi.alternatives().try(
            Joi.array().items(
                Joi.string().min(3).regex(ValidationBase.filterRegExp())
                    .example('{like}luigi.rossi'),
            ).description('the username: name vs [{=}pippo1,{<>}pippo3,{like}pip]')
                .example(['{like}rossi', '{like}bianchi']),
            Joi.string().min(3).regex(ValidationBase.filterRegExp())
                .example('{<>}luigi.rossi,marco.tardelli-gobbo'),
        ),
        createdAt: Joi.alternatives().try(
            Joi.array().description('the creation date: 2017-08-15[ 09:00:00] vs [{btw}2017-08-17 09:00:00,2017-08-17 23:30:00]')
                .items(Joi.string().max(255)
                    .regex(ValidationBase.filterRegExp('date')))
                .example(['{>=}2017-08-01', '{<}2017-09-01']),
            Joi.string().max(255).regex(ValidationBase.filterRegExp())
                .example('{=}2017-08-17 10:00:00'),
        ),
        updatedAt: Joi.alternatives().try(
            Joi.array().items(
                Joi.string().max(255).regex(ValidationBase.filterRegExp())
                    .example('{=}2017-08-17 10:00:00'),
            ).description('the update date: [{=}]2017-08-15[ 09:00:00] vs [{btw}2017-08-17 09:00:00,2017-08-17 23:30:00]')
                .example(['{>=}2017-08-01', '{<}2017-09-01']),
            Joi.string().max(255).regex(ValidationBase.filterRegExp('date'))
                .example('2017-08-17 10:00:00'),
        ),
        deletedAt: Joi.alternatives().try(
            Joi.array().items(
                Joi.string().max(255).regex(ValidationBase.filterRegExp())
                    .example('{=}2017-08-17 10:00:00'),
            ).description('the delete date: 2017-08-15 09:00:00 vs [{btw}2017-08-17 09:00:00,2017-08-17 23:30:00]')
                .example(['{>}2017-08-17 10:00:00', '{<}2017-08-31 10:00:00']),
            Joi.string().max(255).regex(ValidationBase.filterRegExp())
                .example('2017-08-17 10:00:00'),
        ),
    };

    const pagination = {
        $page: Joi.number().integer().min(1).description('page number')
            .default(1),
        $pageSize: Joi.number().integer().min(5).max(100).description('rows per page')
            .default(10),
    };

    const sort = {
        $sort: Joi.alternatives().try(
            Joi.array().description('sort column: [{model}][+,-]id,[{model}][+,-]username vs [-id, -username]')
                .items(
                    Joi.string().max(255)
                        .regex(ValidationBase.sortRegExp(model))
                        .example('-createdAt'))
                .example(['{model}-email','-username']),
            Joi.string().max(255)
                .regex(ValidationBase.sortRegExp(model))
                .example('{model}-email'),
        ),
    };

    const math = {
        $min:
            Joi.string().description('selected attribute MIN: {model}id vs updatedAt]').max(255)
                .regex(ValidationBase.mathFieldRegExp(model))
                .example('{model}id'),
        $max:
            Joi.string().description('selected attribute MAX: {model}id vs updatedAt]').max(255)
                .regex(ValidationBase.mathFieldRegExp(model))
                .example('{model}id'),
        $sum:
            Joi.string().description('selected attribute SUM: {model}id vs updatedAt]').max(255)
                .regex(ValidationBase.mathFieldRegExp(model))
                .example('{model}id'),
    };

    const extra = {
        $count: Joi.boolean().description('only number of records found'),
        $fields: Joi.alternatives().try(
            Joi.array().description('selected attributes: [{model}id, [id, username, {model}email]')
                .items(
                    Joi.string().max(255)
                        .regex(ValidationBase.fieldRegExp(model)))
                .example(['{model}id','{model}username']),
            Joi.string().max(255)
                .regex(ValidationBase.fieldRegExp(model))
                .example('{model}id')
        ),
        $withFilter: Joi.alternatives().try(
            Joi.array().description('filter by relationships fields: {Roles}[{or|not}]{name}[{=}], [{Realms}{not}{name}{like}]')
                .items(Joi.string().max(255)
                    .regex(ValidationBase.withFilterRegExp(model)))
                .example(['{Roles}{id}{=}3','{Realms}{name}{like}App']),
            Joi.string().max(255)
                .regex(ValidationBase.withFilterRegExp(model))
                .example('{Roles.models}{not}{username}{null}')
        ),
        $withCount: Joi.alternatives().try(
            Joi.array().description('count relationships occurrences: Roles, [Roles, Realms]')
                .items(
                    Joi.string().max(255)
                        .regex(ValidationBase.withCountRegExp(model)))
                .example(['Realms','Roles']),
            Joi.string().max(255).description('relationships: Roles, [Roles.models, Realms]')
                .regex(ValidationBase.withCountRegExp(model))
                .example('Realms')
        ),
        $withRelated: Joi.alternatives().try(
            Joi.array().description('includes relationships: Roles, [Roles.models, Realms]')
                .items(
                    Joi.string().max(255)
                        .regex(ValidationBase.withRelatedRegExp(model)))
                .example(['Realms','Roles']),
            Joi.string().max(255)
                .regex(ValidationBase.withRelatedRegExp(model))
                .example('Realms'),
        ),
        $withFields: Joi.alternatives().try(
            Joi.array().description('selects relationships fields: {Roles}name, [{Realms}name,description]')
                .items(Joi.string().max(255)
                    .regex(ValidationBase.withRelatedFieldRegExp(model)))
                .example(['{Realms}name','{Roles}id']),
            Joi.string().max(255)
                .regex(ValidationBase.withRelatedFieldRegExp(model))
                .example('{Realms.Roles}name,description'),
        ),
        $withSort: Joi.alternatives().try(
            Joi.array().description('sort related field: {Realms}[+,-]id vs [-id, -name]')
                .items(Joi.string().max(255)
                    .regex(ValidationBase.withSortRegExp(model)))
                .example(['{Roles}+name','{Roles.models}-username']),
            Joi.string().max(255)
                .regex(ValidationBase.withSortRegExp(model))
                .example('{Realms}description')
        ),
    };

    const modelValidations = {
        pippo: pippo,
        filters: filters,
        pagination: pagination,
        sort: sort,
        math: math,
        extra: extra,
        query: Joi.object().keys(Object.assign({}, filters, pagination, sort, math, extra)),
        FLRelations: FLRelations,
        SLRelations: SLRelations,
        ALLRelations: ALLRelations,
        Attributes: Attributes,
    };

    return modelValidations;
};
