'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('users', {

			// ATTRIBUTES
			id: {
				type: Sequelize.INTEGER,
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
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('users');
	}
};