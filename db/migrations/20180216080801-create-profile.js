'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('authProfiles', {

			// ATTRIBUTES
			id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table"
			},
			firstName: {
				type: Sequelize.STRING(64),
				allowNull: false,
			},
			lastName: {
				type: Sequelize.STRING(64),
				allowNull: false,
			},
			langDefault: {
				type: Sequelize.STRING(8),
			},
			mobilePhone: {
				type: Sequelize.STRING(16),
			},
			resetPasswordToken: {
				type: Sequelize.STRING,
			},
			resetPasswordExpires: {
				type: Sequelize.STRING,
			},
			resetPasswordNewPWD: {
				type: Sequelize.STRING(128),
			},
			activateAccountToken: {
				type: Sequelize.STRING,
			},
			activateAccountExpires: {
				type: Sequelize.STRING,
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
		await queryInterface.addIndex('authUsers', ['username']);
		await queryInterface.addIndex('authUsers', ['email']);
		await queryInterface.addIndex('authUsers', ['password']);
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('authUsers');
	}
};