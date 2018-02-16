'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('authUsers', {

			// ATTRIBUTES
			id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table"
			},
			username: {
				type: Sequelize.STRING(64),
				allowNull: true,
				unique: true,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: Sequelize.STRING(128),
				allowNull: false,
			},
			firstName: {
				type: Sequelize.STRING(64),
				allowNull: false,
			},
			lastName: {
				type: Sequelize.STRING(64),
				allowNull: false,
			},
			isActive: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			currentLoginAt: {
				type: Sequelize.DATE,
			},
			lastLoginAt: {
				type: Sequelize.DATE,
			},
			currentLoginIP: {
				type: Sequelize.STRING(16),
			},
			lastLoginIP: {
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