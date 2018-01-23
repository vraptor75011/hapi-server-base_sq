'use strict';
const Users = require('./data/01-user_data');
const Realms = require('./data/02-realm_data');
const Roles = require('./data/03-role_data');
const RealmsRolesUsers = require('./data/04-realms_roles_users_data');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('users', Users, {});
        await queryInterface.bulkInsert('realms', Realms, {});
        await queryInterface.bulkInsert('roles', Roles, {});
        await queryInterface.bulkInsert('realms_roles_users', RealmsRolesUsers, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('realms_roles_users', null, {});
        await queryInterface.bulkDelete('roles', null, {});
        await queryInterface.bulkDelete('realms', null, {});
        await queryInterface.bulkDelete('users', null, {});
    },
};
