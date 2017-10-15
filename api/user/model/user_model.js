module.exports = function(sequelize, DataTypes) {

	let User = sequelize.define('User', {

			// ATTRIBUTES
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table"
			},
			username: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validation: {
					len: [3, 64]
				}
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validation: {
					isEmail: true
				}
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validation: {
					len: [8, 32]
				}
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		{
			tableName: 'users',
			paranoid: true
		},
	);


	// Model Relations
	User.associate = function (models) {
		User.belongsToMany(models.Role, { through: models.RealmsRolesUsers });
		User.belongsToMany(models.Realm, { through: models.RealmsRolesUsers });
		User.hasMany(models.RealmsRolesUsers);
	};

	return User;
};
