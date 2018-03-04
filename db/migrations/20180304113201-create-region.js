module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('cntrRegions', {

			// ATTRIBUTES
			id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table"
			},
			name: {
				type: Sequelize.STRING(128),
				allowNull: false,
			},
			geoRepartitionId: {
				type: Sequelize.INTEGER.UNSIGNED,
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
		await queryInterface.addIndex('cntrRegions', ['geoRepartitionId']);
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('cntrRegions');
	}
};
