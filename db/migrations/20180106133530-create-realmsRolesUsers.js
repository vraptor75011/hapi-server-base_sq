'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('realms_roles_users',
            {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    comment: "Primary and auto incremented key of the table"
                },
                realmId: {
                    type: Sequelize.INTEGER,
                    // references: {
                    // 	// This is a reference to model Realm
                    // 	model: 'Realm',
                    // 	// This is the column name of the referenced Realm model
                    // 	key: 'id',
                    // }
                    allowNull: false,
                },
                roleId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                userId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
            });
        await queryInterface.addIndex('realms_roles_users', ['realmId']);
        await queryInterface.addIndex('realms_roles_users', ['roleId']);
        await queryInterface.addIndex('realms_roles_users', ['userId']);
        await queryInterface.addConstraint('realms_roles_users', ['realmId', 'roleId', 'userId'], {
            type: 'unique',
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('realms_roles_users');
    }
};
