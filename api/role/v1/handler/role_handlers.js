const DB = require('../../../../config/sequelize');
const HandlerHelper = require('../../../../utilities/handler/handler-helper');

const Role = DB.Role;


const Handler =
    {
        findAll: async (request, h) => {
            // Call listAll async function with await inside handler-helper
            // call LIST Handler for CRUD function valid for all present models
            let result = await HandlerHelper.list(Role, request.query);
            return h.response(result);

        },

        findOne: async (request, h) => {
            // Call an async function with await inside in handler-helper
            // call FIND ONE Handler for CRUD function valid for all present models
            let user = await HandlerHelper.find(Role, request.params.roleId, request.query);
            return h.response(user);

        },

        create: async (request, h) => {
            // Call an async function with await inside in handler-helper
            // Only for Admin to Add a new Role without free registration

            // call CREATE Handler for CRUD function valid for all present models
            let user = await HandlerHelper.create(Role, request.payload);
            return h.response(user);

        },

        update: async (request, h) => {
            // Admin and Role can update an Role, but Role can't change his roles and realms
            // Call an async function with await inside in handler-helper

            // call CREATE Handler for CRUD function valid for all present models
            let user = await HandlerHelper.update(Role, request.params.roleId, request.payload);
            return h.response(user);
        },

        delete: async (request, h) => {
            // Admin can delete an Role
            // Call an async function with await inside in handler-helper

            // call DELETE Handler for CRUD function valid for all present models
            let response = await HandlerHelper.deleteOne(Role, request.params.roleId, request.payload);
            return h.response(response);
        },

        deleteMany: async (request, h) => {
            // Admin can delete an Role
            // Call an async function with await inside in handler-helper

            // call DELETE MANY Handler for EXTRA CRUD function valid for all present models
            let response = await HandlerHelper.deleteMany(Role, request.payload);
            return h.response(response);
        },

        addOne: async (request, h) => {
            // Admin can add one child model to an Role
            // Call an async function with await inside in handler-helper
            let childModel = Role.associations[request.params.childModel].target;
            // call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = await HandlerHelper.addOne(Role, request.params.roleId, childModel, request.params.childId, request.params.childModel);
            return h.response(response);
        },

        removeOne: async (request, h) => {
            // Admin can remove one child model from an Role
            // Call an async function with await inside in handler-helper
            let childModel = Role.associations[request.params.childModel].target;
            // call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = await HandlerHelper.removeOne(Role, request.params.roleId, childModel, request.params.childId, request.params.childModel);
            return h.response(response);
        },

        addMany: async (request, h) => {
            // Admin can add one or more child model to an Role
            // Call an async function with await inside in handler-helper
            let childModel = Role.associations[request.params.childModel].target;
            // call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = await HandlerHelper.addMany(Role, request.params.roleId, childModel, request.params.childModel, request.payload);
            return h.response(response);
        },

        removeMany: async (request, h) => {
            // Admin can remove one or more child model from an Role
            // Call an async function with await inside in handler-helper
            let childModel = Role.associations[request.params.childModel].target;
            // call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = await HandlerHelper.removeMany(Role, request.params.roleId, childModel, request.params.childModel, request.payload);
            return h.response(response);
        },

        getAll: async (request, h) => {
            // Admin can get list of Child model related to Role
            // Call an async function with await inside in handler-helper
            let childModel = Role.associations[request.params.childModel].target;
            // call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = await HandlerHelper.getAll(Role, request.params.roleId, childModel, request.params.childModel, request.query);
            return h.response(response);
        },
    };

module.exports = Handler;