const DB = require('../../../../config/sequelize');
const HandlerHelper = require('../../../../utilities/handler/handler-helper');

const Realm = DB.Realm;


const Handler =
    {
        findAll: async (request, h) => {
            // Call listAll async function with await inside handler-helper
            // call LIST Handler for CRUD function valid for all present models
            let result = await HandlerHelper.list(Realm, request.query);
            return h.response(result);

        },

        findOne: async (request, h) => {
            // Call an async function with await inside in handler-helper
            // call FIND ONE Handler for CRUD function valid for all present models
            let user = await HandlerHelper.find(Realm, request.params.realmId, request.query);
            return h.response(user);

        },

        create: async (request, h) => {
            // Call an async function with await inside in handler-helper
            // Only for Admin to Add a new Realm without free registration

            request.payload.password = Realm.hashPassword(request.payload.password);
            // call CREATE Handler for CRUD function valid for all present models
            let user = await HandlerHelper.create(Realm, request.payload);
            return h.response(user);

        },

        update: async (request, h) => {
            // Admin and Realm can update an Realm, but Realm can't change his roles and realms
            // Call an async function with await inside in handler-helper

            // call CREATE Handler for CRUD function valid for all present models
            let user = await HandlerHelper.update(Realm, request.params.realmId, request.payload);
            return h.response(user);
        },

        delete: async (request, h) => {
            // Admin can delete an Realm
            // Call an async function with await inside in handler-helper

            // call DELETE Handler for CRUD function valid for all present models
            let response = await HandlerHelper.deleteOne(Realm, request.params.realmId, request.payload);
            return h.response(response);
        },

        deleteMany: async (request, h) => {
            // Admin can delete an Realm
            // Call an async function with await inside in handler-helper

            // call DELETE MANY Handler for EXTRA CRUD function valid for all present models
            let response = await HandlerHelper.deleteMany(Realm, request.payload);
            return h.response(response);
        },

        addOne: async (request, h) => {
            // Admin can add one child model to an Realm
            // Call an async function with await inside in handler-helper
            let childModel = Realm.associations[request.params.childModel].target;
            // call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = await HandlerHelper.addOne(Realm, request.params.realmId, childModel, request.params.childId, request.params.childModel);
            return h.response(response);
        },

        removeOne: async (request, h) => {
            // Admin can remove one child model from an Realm
            // Call an async function with await inside in handler-helper
            let childModel = Realm.associations[request.params.childModel].target;
            // call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = await HandlerHelper.removeOne(Realm, request.params.realmId, childModel, request.params.childId, request.params.childModel);
            return h.response(response);
        },

        addMany: async (request, h) => {
            // Admin can add one or more child model to an Realm
            // Call an async function with await inside in handler-helper
            let childModel = Realm.associations[request.params.childModel].target;
            // call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = await HandlerHelper.addMany(Realm, request.params.realmId, childModel, request.params.childModel, request.payload);
            return h.response(response);
        },

        removeMany: async (request, h) => {
            // Admin can remove one or more child model from an Realm
            // Call an async function with await inside in handler-helper
            let childModel = Realm.associations[request.params.childModel].target;
            // call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = await HandlerHelper.removeMany(Realm, request.params.realmId, childModel, request.params.childModel, request.payload);
            return h.response(response);
        },

        getAll: async (request, h) => {
            // Admin can get list of Child model related to Realm
            // Call an async function with await inside in handler-helper
            let childModel = Realm.associations[request.params.childModel].target;
            // call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = await HandlerHelper.getAll(Realm, request.params.realmId, childModel, request.params.childModel, request.query);
            return h.response(response);
        },
    };

module.exports = Handler;