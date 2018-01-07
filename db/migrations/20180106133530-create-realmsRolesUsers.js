'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('realms_roles_users',
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
			})
			.then(() => queryInterface.addIndex('realms_roles_users', ['realmId']))
			.then(() => queryInterface.addIndex('realms_roles_users', ['roleId']))
			.then(() => queryInterface.addIndex('realms_roles_users', ['userId']))
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('realms_roles_users');
	}
};
