module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('authProfileAvatars', {

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
		await queryInterface.dropTable('authProfileAvatars');
	}
};
