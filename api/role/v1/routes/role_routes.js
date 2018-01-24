const HeaderValidation = require('../../../../utilities/validation/header_validation');
const RoleValidation = require('../../url_validation/role_validation');
const RoleHandler = require('../../v1/handler/role_handlers');

module.exports.register = (server, options, next) => {

    server.route([
        {
            method: 'GET',
            path: '/v1/roles',
            config: {
                handler: RoleHandler.findAll,
                auth:
                // false,
                    {
                        scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
                    },
                tags: ['api', 'Roles'],
                description: 'GET Roles List',
                notes: ['Returns Roles list filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
                'Role First Level Relations: ' + RoleValidation.FLRelations + '<br>' +
                'Role Second Level Relations: ' + RoleValidation.SLRelations + '<br>' +
                'Attributes: ' + RoleValidation.Attributes + '<br>'],
                validate: {
                    query: RoleValidation.queryAll,
                    // query: RoleValidations.query,
                    headers: HeaderValidation.headerRequired,
                },
            },
        },
        {
            method: 'GET',
            path: '/v1/roles/{roleId}',
            config: {
                handler: RoleHandler.findOne,
                auth:
                // false,
                    {
                        scope: ['GameApp-SuperAdmin', 'WebApp-Admin'],
                    },
                tags: ['api', 'Roles'],
                description: 'GET One Role',
                notes: ['Returns a Role identified by the params {roleId} <br>' +
                'Attributes: ' + RoleValidation.Attributes + '<br>'],
                validate: {
                    params: RoleValidation.oneParams,
                    query: RoleValidation.queryOne,
                    // query: RoleValidations.query,
                    headers: HeaderValidation.headerRequired,
                },
            },
        },
        {
            method: 'POST',
            path: '/v1/roles',
            config: {
                handler: RoleHandler.create,
                auth:
                    {
                        scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
                    },
                tags: ['api', 'Roles'],
                description: 'POST a New Role',
                notes: ['Save a new Role with params in payload with one or more Child object.<br>' +
                'Role hasMany Child Model: Role object can contain one or more Child object <br>' +
                'Role BelongsToMany Child Model: Role object can contain one or more Child object can contain one Through object'],
                validate: {
                    payload: RoleValidation.postPayload,
                    headers: HeaderValidation.headerRequired,
                },
            },
        },
        {
            method: 'PUT',
            path: '/v1/roles/{roleId}',
            config: {
                handler: RoleHandler.update,
                auth:
                    {
                        scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
                    },
                tags: ['api', 'Roles'],
                description: 'PUT an Updated Role',
                notes: ['Save an updated Role with params in payload <br>'],
                validate: {
                    params: RoleValidation.oneParams,
                    payload: RoleValidation.putPayload,
                    headers: HeaderValidation.headerRequired,
                },
            },
        },
        {
            method: 'DELETE',
            path: '/v1/roles/{roleId}',
            config: {
                handler: RoleHandler.delete,
                auth:
                    {
                        scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
                    },
                tags: ['api', 'Roles'],
                description: 'DELETE an Role',
                notes: ['Delete un Role <br>'],
                validate: {
                    params: RoleValidation.oneParams,
                    payload: RoleValidation.deleteOnePayload,
                    headers: HeaderValidation.headerRequired,
                },
            },
        },
        // EXTRA CRUD
        {
            method: 'DELETE',
            path: '/v1/roles/',
            config: {
                handler: RoleHandler.deleteMany,
                auth:
                    {
                        scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
                    },
                tags: ['api', 'Roles'],
                description: 'DELETE many Roles by Ids Array',
                notes: ['Delete many Roles <br>'],
                validate: {
                    // params: RoleValidation.paramOne,
                    payload: RoleValidation.deleteManyPayload,
                    headers: HeaderValidation.headerRequired,
                },
            },
        },
        {
            method: 'POST',
            path: '/v1/roles/{roleId}/{childModel}/{childId}',
            config: {
                handler: RoleHandler.addOne,
                auth:
                    {
                        scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
                    },
                tags: ['api', 'Roles'],
                description: 'ADD one related Model to Role',
                notes: ['Add one related model (to save) to a persisted Role <br>' +
                'Add a persisted child Model to Role.'],
                validate: {
                    params: RoleValidation.addOneParams,
                    headers: HeaderValidation.headerRequired,
                },
            },
        },
        {
            method: 'DELETE',
            path: '/v1/roles/{roleId}/{childModel}/{childId}',
            config: {
                handler: RoleHandler.removeOne,
                auth:
                    {
                        scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
                    },
                tags: ['api', 'Roles'],
                description: 'Remove one related Model from Role',
                notes: ['Remove one related model (delete) from a persisted Role <br>' +
                'Role hasMany Child Model: Role object can contain one or more Child object <br>' +
                'Role BelongsToMany Child Model: Role object can contain one or more Child object can contain one Through object'],
                validate: {
                    params: RoleValidation.removeOneParams,
                    payload: RoleValidation.removeOnePayload,
                    headers: HeaderValidation.headerRequired,
                },
            },
        },
        {
            method: 'POST',
            path: '/v1/roles/{roleId}/{childModel}',
            config: {
                handler: RoleHandler.addMany,
                auth:
                    {
                        scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
                    },
                tags: ['api', 'Roles'],
                description: 'ADD one or more related Model to Role',
                notes: ['Add one or more related model (to save) to an existed Role <br>' +
                'Role hasMany Child Model: Role object can contain one or more Child object <br>' +
                'Role BelongsToMany Child Model: Role object can contain one or more Child object can contain one Through object'],
                validate: {
                    params: RoleValidation.addManyParams,
                    payload: RoleValidation.addManyPayload,
                    headers: HeaderValidation.headerRequired,
                },
            },
        },
        {
            method: 'DELETE',
            path: '/v1/roles/{roleId}/{childModel}',
            config: {
                handler: RoleHandler.removeMany,
                auth:
                    {
                        scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
                    },
                tags: ['api', 'Roles'],
                description: 'Remove one or many related Model from Role',
                notes: ['Remove one or many related model (delete) from a persisted Role <br>' +
                'Role hasMany Child Model: Role object can contain one or more Child object <br>' +
                'Role BelongsToMany Child Model: Role object can contain one or more Child object can contain one Through object'],
                validate: {
                    params: RoleValidation.removeManyParams,
                    payload: RoleValidation.removeManyPayload,
                    headers: HeaderValidation.headerRequired,
                },
            },
        },
        {
            method: 'GET',
            path: '/v1/roles/{roleId}/{childModel}',
            config: {
                handler: RoleHandler.getAll,
                auth:
                    {
                        scope: ['WebApp-SuperAdmin', 'WebApp-Admin'],
                    },
                tags: ['api', 'Roles'],
                description: 'Get All Role related child model with query filters',
                notes: ['Get All records of Role related Child Model <br>'],
                validate: {
                    params: RoleValidation.getAllParams,
                    query: RoleValidation.queryGetAll,
                    headers: HeaderValidation.headerRequired,
                },
            },
        },
        {
            method: 'GET',
            path: '/v1/roles/4Select',
            config: {
                handler: RoleHandler.findAll,
                auth:
                // false,
                    {
                        scope: ['GameApp-SuperAdmin', 'WebApp-Admin', 'GameApp-User', 'WebApp-User'],
                    },
                tags: ['api', 'Roles'],
                description: 'GET Roles List for Input Select',
                notes: ['Returns Roles list for input select filtered by query (url), paginated and sorted. Default pageSize: 10 <br>' +
                'User First Level Relations, only for query: ' + RoleValidation.FLRelations + '<br>' +
                'User Second Level Relations only for query: ' + RoleValidation.SLRelations + '<br>' +
                'Attributes: ' + RoleValidation.Attributes4Select + '<br>'],
                validate: {
                    query: RoleValidation.query4Select,
                    // query: UserValidations.query,
                    headers: HeaderValidation.headerRequired,
                },
            },
        },
    ]);

    next()
};

module.exports.register.attributes = {
    name: 'api.v1.roles',
    version: '1.0.0',
};
