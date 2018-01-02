'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('users', {

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
				unique: true,
			},
			email: {
				type: Sequelize.STRING,
				unique: true,
			},
			password: {
				type: Sequelize.STRING(128),
			},
			firstName: {
				type: Sequelize.STRING(64),
			},
			lastName: {
				type: Sequelize.STRING(64),
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
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('groups');
	}
};