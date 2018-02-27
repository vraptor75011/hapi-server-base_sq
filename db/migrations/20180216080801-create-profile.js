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
			public: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
			userId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
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
		await queryInterface.addIndex('authProfiles', ['userId']);
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('authProfiles');
	}
};
