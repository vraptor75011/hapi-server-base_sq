module.exports = function(sequelize, DataTypes) {

	let RealmsRolesUsers = sequelize.define('RealmsRolesUsers', {

			// ATTRIBUTES
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table"
			},
		},
		{
			tableName: 'realms_roles_users',
			paranoid: true,
		},
	);

	// Model Relations
	RealmsRolesUsers.associate = function (models) {
		RealmsRolesUsers.belongsTo(models.Realm);
		RealmsRolesUsers.belongsTo(models.Role);
		RealmsRolesUsers.belongsTo(models.User);
	};

	return RealmsRolesUsers;
};
