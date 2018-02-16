'use strict';
const Users = require('./data/01-user_data');
const Realms = require('./data/02-realm_data');
const Roles = require('./data/03-role_data');
const RealmsRolesUsers = require('./data/04-realms_roles_users_data');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('authUsers', Users, {});
        await queryInterface.bulkInsert('authRealms', Realms, {});
        await queryInterface.bulkInsert('authRoles', Roles, {});
        await queryInterface.bulkInsert('authRealmsRolesUsers', RealmsRolesUsers, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('authRealmsRolesUsers', null, {});
        await queryInterface.bulkDelete('authRoles', null, {});
        await queryInterface.bulkDelete('authRealms', null, {});
        await queryInterface.bulkDelete('authUsers', null, {});
    },
};
