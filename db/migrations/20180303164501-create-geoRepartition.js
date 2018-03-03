module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('cntrGeoRepartitions',
			{
				id: {
					type: Sequelize.INTEGER.UNSIGNED,
					allowNull: false,
					primaryKey: true,
					autoIncrement: true,
					comment: "Primary and auto incremented key of the table"
				},
				name: {
					type: Sequelize.STRING(128),
					unique: true,
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

	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('cntrGeoRepartitions');
	}
};
