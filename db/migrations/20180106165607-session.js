'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('authSessions',
			{
				id: {
					type: Sequelize.INTEGER.UNSIGNED,
					allowNull: false,
					primaryKey: true,
					autoIncrement: true,
					comment: "Primary and auto incremented key of the table"
				},
				key: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				passwordHash: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				userAgent: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				userId: {
					type: Sequelize.INTEGER.UNSIGNED,
					allowNull: false,
				},
				realmId: {
					type: Sequelize.INTEGER.UNSIGNED,
					allowNull: false,
				},
				createdAt: {
					type: Sequelize.DATE
				},
				updatedAt: {
					type: Sequelize.DATE
				},
			});
		await queryInterface.addIndex('authSessions', ['key', 'userAgent', 'userId', 'realmId']);

	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('authSessions');

	}
};

