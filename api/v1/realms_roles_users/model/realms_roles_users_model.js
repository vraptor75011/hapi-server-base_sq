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

	// Class Method
	// RealmsRolesUsers.associate = function (models) {
	// 	User.belongsToMany(models.role, { through: 'realms_roles_users' });
	// 	User.belongsToMany(models.realm, { through: 'realms_roles_users' });
	// };

	return RealmsRolesUsers;
};
