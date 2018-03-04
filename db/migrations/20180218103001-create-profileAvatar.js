module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('authAvatars', {

			// ATTRIBUTES
			id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table"
			},
			fieldName: {
				type: Sequelize.STRING(),
			},
			originalName: {
				type: Sequelize.STRING(),
			},
			fileName: {
				type: Sequelize.STRING(),
			},
			mimeType: {
				type: Sequelize.STRING(),
			},
			destination: {
				type: Sequelize.STRING(),
			},
			path: {
				type: Sequelize.STRING(),
			},
			size: {
				type: Sequelize.INTEGER.UNSIGNED,
			},
			profileId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: true,
				unique: true,
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
		await queryInterface.addIndex('authAvatars', ['profileId']);
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('authAvatars');
	}
};
