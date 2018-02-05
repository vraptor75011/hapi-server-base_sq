module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('auth_attempts',
			{
				id: {
					type: Sequelize.INTEGER.UNSIGNED,
					allowNull: false,
					primaryKey: true,
					autoIncrement: true,
					comment: "Primary and auto incremented key of the table"
				},
				ip: {
					type: Sequelize.STRING(16),
					allowNull: false,
				},
				username: {
					type: Sequelize.STRING(64),
					allowNull: true,
				},
				email: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				count: {
					type: Sequelize.INTEGER,
					defaultValue: 0,
					allowNull: false,
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
		await queryInterface.addIndex('auth_attempts', ['ip', 'username', 'email']);

	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('auth_attempts');

	}
};
