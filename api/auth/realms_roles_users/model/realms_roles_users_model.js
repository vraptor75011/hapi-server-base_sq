module.exports = function(sequelize, Sequelize) {

	let AuthRealmsRolesUsers = sequelize.define('authRealmsRolesUsers', {

			// ATTRIBUTES
			id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table"
			},
			// realmId: {
			// 	type: Sequelize.INTEGER,
			// 	references: {
			// 		// This is a reference to another model
			// 		model: 'AuthRealm',
			// 		// This is the column name of the referenced model
			// 		key: 'id',
			// 	}
			// },
			// roleId: {
			// 	type: Sequelize.INTEGER,
			// 	references: {
			// 		model: 'AuthRole',
			// 		key: 'id',
			// 	}
			// },
			// userId: {
			// 	type: Sequelize.INTEGER,
			// 	references: {
			// 		model: 'AuthUser',
			// 		key: 'id',
			// 	}
			// },
		},
		{
			name: {
				singular: 'realmsRolesUsers',
				plural: 'realmsRolesUsers',
			},
			timestamps: false,
			tableName: 'authRealmsRolesUsers',
			paranoid: true,
		},
	);

	// Model Relations
	AuthRealmsRolesUsers.associate = function (models) {
		AuthRealmsRolesUsers.belongsTo(models.AuthRealm, {foreignKey: 'realmId', targetKey: 'id'});
		AuthRealmsRolesUsers.belongsTo(models.AuthRole, {foreignKey: 'roleId', targetKey: 'id'});
		AuthRealmsRolesUsers.belongsTo(models.AuthUser, {foreignKey: 'userId', targetKey: 'id'});
	};

	return AuthRealmsRolesUsers;
};
