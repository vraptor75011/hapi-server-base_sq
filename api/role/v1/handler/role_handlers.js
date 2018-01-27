const DB = require('../../../../config/sequelize');
const HandlerHelper = require('../../../../utilities/handler/handler-helper');

const Role = DB.Role;


const Handler =
    {
        findAll: function (request, reply) {
            // Call listAll async function with await inside handler-helper
            // call LIST Handler for CRUD function valid for all present models
            let result = HandlerHelper.list(Role, request.query);
            return reply(result);

        },

        findOne: function (request, reply) {
            // Call an async function with await inside in handler-helper
            // call FIND ONE Handler for CRUD function valid for all present models
            let user = HandlerHelper.find(Role, request.params.roleId, request.query);
            return reply(user);

        },

        create: function (request, reply) {
            // Call an async function with await inside in handler-helper
            // Only for Admin to Add a new Role without free registration

            request.payload.password = Role.hashPassword(request.payload.password);
            // call CREATE Handler for CRUD function valid for all present models
            let user = HandlerHelper.create(Role, request.payload);
            return reply(user);

        },

        update: function (request, reply) {
            // Admin and Role can update an Role, but Role can't change his roles and realms
            // Call an async function with await inside in handler-helper

            // call CREATE Handler for CRUD function valid for all present models
            let user = HandlerHelper.update(Role, request.params.roleId, request.payload);
            return reply(user);
        },

        delete: function (request, reply) {
            // Admin can delete an Role
            // Call an async function with await inside in handler-helper

            // call DELETE Handler for CRUD function valid for all present models
            let response = HandlerHelper.deleteOne(Role, request.params.roleId, request.payload);
            return reply(response);
        },

        deleteMany: function (request, reply) {
            // Admin can delete an Role
            // Call an async function with await inside in handler-helper

            // call DELETE MANY Handler for EXTRA CRUD function valid for all present models
            let response = HandlerHelper.deleteMany(Role, request.payload);
            return reply(response);
        },

        addOne: function (request, reply) {
            // Admin can add one child model to an Role
            // Call an async function with await inside in handler-helper
            let childModel = Role.associations[request.params.childModel].target;
            // call ADD_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = HandlerHelper.addOne(Role, request.params.roleId, childModel, request.params.childId, request.params.childModel);
            return reply(response);
        },

        removeOne: function (request, reply) {
            // Admin can remove one child model from an Role
            // Call an async function with await inside in handler-helper
            let childModel = Role.associations[request.params.childModel].target;
            // call REMOVE_ONE Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = HandlerHelper.removeOne(Role, request.params.roleId, childModel, request.params.childId, request.params.childModel);
            return reply(response);
        },

        addMany: function (request, reply) {
            // Admin can add one or more child model to an Role
            // Call an async function with await inside in handler-helper
            let childModel = Role.associations[request.params.childModel].target;
            // call ADD_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = HandlerHelper.addMany(Role, request.params.roleId, childModel, request.params.childModel, request.payload);
            return reply(response);
        },

        removeMany: function (request, reply) {
            // Admin can remove one or more child model from an Role
            // Call an async function with await inside in handler-helper
            let childModel = Role.associations[request.params.childModel].target;
            // call REMOVE_MANY Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = HandlerHelper.removeMany(Role, request.params.roleId, childModel, request.params.childModel, request.payload);
            return reply(response);
        },

        getAll: function (request, reply) {
            // Admin can get list of Child model related to Role
            // Call an async function with await inside in handler-helper
            let childModel = Role.associations[request.params.childModel].target;
            // call GET_ALL Handler for EXTRA CRUD function valid for all present models and a new child model
            let response = HandlerHelper.getAll(Role, request.params.roleId, childModel, request.params.childModel, request.query);
            return reply(response);
        },
    };

module.exports = Handler;