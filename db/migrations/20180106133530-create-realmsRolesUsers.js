'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('authRealmsRolesUsers',
			{
				id: {
					type: Sequelize.INTEGER.UNSIGNED,
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
		await queryInterface.addIndex('authRealmsRolesUsers', ['realmId']);
		await queryInterface.addIndex('authRealmsRolesUsers', ['roleId']);
		await queryInterface.addIndex('authRealmsRolesUsers', ['userId']);
		await queryInterface.addConstraint('authRealmsRolesUsers', ['realmId', 'roleId', 'userId'], {
			type: 'unique',
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('authRealmsRolesUsers');
	}
};
