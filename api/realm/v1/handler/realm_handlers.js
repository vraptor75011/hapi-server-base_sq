const DB = require('../../../../config/sequelize');
const HandlerHelper = require('../../../../utilities/handler/handler-helper');

const Realm = DB.Realm;


const Handler =
    {
        findAll: function (request, reply) {
            // Call listAll async function with await inside handler-helper
            // call LIST Handler for CRUD function valid for all present models
            let result = HandlerHelper.list(Realm, request.query);
            return reply(result);

        },

        findOne: function (request, reply) {
            // Call an async function with await inside in handler-helper
            // call FIND ONE Handler for CRUD function valid for all present models
            let user = HandlerHelper.find(Realm, request.params.realmId, request.query);
            return reply(user);

        },

        create: function (request, reply) {
            // Call an async function with await inside in handler-helper
            // Only for Admin to Add a new Realm without free registration

            request.payload.password = Realm.hashPassword(request.payload.password);
            // call CREATE Handler for CRUD function valid for all present models
            let user = HandlerHelper.create(Realm, request.payload);
            return reply(user);

        },

        update: function (request, reply) {
            // Admin and Realm can update an Realm, but Realm can't change his roles and realms
            // Call an async function with await inside in handler-helper

            // call CREATE Handler for CRUD function valid for all present models
            let user = HandlerHelper.update(Realm, request.params.realmId, request.payload);
            return reply(user);
        },

        delete: function (request, reply) {
            // Admin can delete an Realm
            // Call an async function with await inside in handler-helper

            // call DELETE Handler for CRUD function valid for all present models
            let response = HandlerHelper.deleteOne(Realm, request.params.realmId, request.payload);
            return reply(response);
        },

        deleteMany: function (request, reply) {
            // Admin can delete an Realm
            // Call an async function with await inside in handler-helper

            // call DELETE MANY Handler for EXTRA CRUD function valid for all present models
            let response = HandlerHelper.deleteMany(Realm, request.payload);
            return reply(response);
        },

        addOne: function (request, reply) {
            // Admin can add one child model to an Realm
            // Call an async function with await inside in handler-helper
            let childModel = Realm.associations[request.params.childModel].target;
            // call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = HandlerHelper.addOne(Realm, request.params.realmId, childModel, request.params.childId, request.params.childModel);
            return reply(response);
        },

        removeOne: function (request, reply) {
            // Admin can remove one child model from an Realm
            // Call an async function with await inside in handler-helper
            let childModel = Realm.associations[request.params.childModel].target;
            // call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = HandlerHelper.removeOne(Realm, request.params.realmId, childModel, request.params.childId, request.params.childModel);
            return reply(response);
        },

        addMany: function (request, reply) {
            // Admin can add one or more child model to an Realm
            // Call an async function with await inside in handler-helper
            let childModel = Realm.associations[request.params.childModel].target;
            // call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = HandlerHelper.addMany(Realm, request.params.realmId, childModel, request.params.childModel, request.payload);
            return reply(response);
        },

        removeMany: function (request, reply) {
            // Admin can remove one or more child model from an Realm
            // Call an async function with await inside in handler-helper
            let childModel = Realm.associations[request.params.childModel].target;
            // call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = HandlerHelper.removeMany(Realm, request.params.realmId, childModel, request.params.childModel, request.payload);
            return reply(response);
        },

        getAll: function (request, reply) {
            // Admin can get list of Child model related to Realm
            // Call an async function with await inside in handler-helper
            let childModel = Realm.associations[request.params.childModel].target;
            // call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = HandlerHelper.getAll(Realm, request.params.realmId, childModel, request.params.childModel, request.query);
            return reply(response);
        },
    };

module.exports = Handler;