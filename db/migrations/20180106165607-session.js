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
					required: true
				},
				passwordHash: {
					type: Sequelize.STRING,
					required: true
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
			await queryInterface.addIndex('sessions', ['key', 'userId', 'realmId']);

	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('sessions');

	}
};

