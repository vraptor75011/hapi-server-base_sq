module.exports = function(sequelize, DataTypes) {

	let RealmsRolesUsers = sequelize.define('realmsRolesUsers', {

			// ATTRIBUTES
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table"
			},
			// realmId: {
			// 	type: DataTypes.INTEGER,
			// 	references: {
			// 		// This is a reference to another model
			// 		model: 'Realm',
			// 		// This is the column name of the referenced model
			// 		key: 'id',
			// 	}
			// },
			// roleId: {
			// 	type: DataTypes.INTEGER,
			// 	references: {
			// 		model: 'Role',
			// 		key: 'id',
			// 	}
			// },
			// userId: {
			// 	type: DataTypes.INTEGER,
			// 	references: {
			// 		model: 'User',
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
			tableName: 'realms_roles_users',
			paranoid: true,
		},
	);

	// Model Relations
	RealmsRolesUsers.associate = function (models) {
		RealmsRolesUsers.belongsTo(models.Realm, {foreignKey: 'realmId', targetKey: 'id'});
		RealmsRolesUsers.belongsTo(models.Role, {foreignKey: 'roleId', targetKey: 'id'});
		RealmsRolesUsers.belongsTo(models.User, {foreignKey: 'userId', targetKey: 'id'});
	};

	return RealmsRolesUsers;
};
