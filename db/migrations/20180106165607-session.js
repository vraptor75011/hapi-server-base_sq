'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('sessions',
			{
				id: {
					type: Sequelize.INTEGER,
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
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				realmId: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				createdAt: {
					type: Sequelize.DATE
				},
				updatedAt: {
					type: Sequelize.DATE
				},
			});
			await queryInterface.addIndex('sessions', ['key', 'userAgent', 'sender', 'userId', 'realmId']);

	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('sessions');

	}
};

