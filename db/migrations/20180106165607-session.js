'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('sessions',
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
				createdAt: {
					type: Sequelize.DATE
				},
				updatedAt: {
					type: Sequelize.DATE
				},
			})
			.then(() => queryInterface.addIndex('sessions', ['key', 'userId']))
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('sessions');

	}
};

