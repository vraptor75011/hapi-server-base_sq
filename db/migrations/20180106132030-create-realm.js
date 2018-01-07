'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('realms',
			{
				id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					primaryKey: true,
					autoIncrement: true,
					comment: "Primary and auto incremented key of the table"
				},
				name: {
					type: Sequelize.STRING(64),
					unique: true,
					allowNull: false,
				},
				description: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				createdAt: {
					type: Sequelize.DATE
				},
				updatedAt: {
					type: Sequelize.DATE
				},
				deletedAt: {
					type: Sequelize.DATE
				},
			});

	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('realms');
	}
};
