module.exports = function(sequelize, DataTypes) {

	let Role = sequelize.define('role', {

			// ATTRIBUTES
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table",
				query: Query.id,
			},
			name: {
				type: DataTypes.STRING,
                default4Select: true,
				unique: true,
				allowNull: false,
				validation: {
					len: [3,64]
				},
				query: Query.name,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true,
				query: Query.description,
			},
		},
		{
			tableName: 'roles',
			paranoid: true,
			timestamps: true,
		},
	);

	// Class Method
	Role.associate = function (models) {
		Role.belongsToMany(models.Realm, { through: 'realmsRolesUsers' });
		Role.belongsToMany(models.User, { through: 'realmsRolesUsers' });
		Role.hasMany(models.RealmsRolesUsers, {as: 'role-rru', foreignKey: 'roleId', sourceKey: 'id'});
	};

	return Role;
};

// Params to build query URL
const Query = {
	id: {
		array: {
			items: {
				string: {
					regex: '',
					example: '{>=}20',
				},
				integer: {
					min: 1,
					example: 35,
				},
			},
			description: 'the role ID PK auto-increment: [{=}]1 vs [{>}1,{<>}20,{<=}100]',
			example: ['{>}35', '{<}50'],
		},
		string: {
			regex: '',
			example: '{in}35,40',
		},
		integer: {
			min: 1,
			example: 40,
		}

	},
	name: {
		array: {
			items: {
				string: {
					regex: '',
					min: 3,
					max: 64,
					example: '{like}SuperAdmin',
				},
			},
			description: 'the role name: User vs [{=}Admin,{<>}Admin,{like}SuperAdmin',
			example: ['{like}dmin', '{like}User'],
		},
		string: {
			regex: '',
			min: 3,
			max: 64,
			example: ['{like}User', '{<>}Admin']
		},
	},
	description: {
		array: {
			items: {
				string: {
					regex: '',
					min: 3,
					max: 255,
					example: '{like}Can do anything',
				},
			},
			description: 'the role description: Can do anything vs [{=}Limited,{<>}anything,{like}anything',
			example: ['{like}do', '{like}anything'],
		},
		string: {
			regex: '',
			min: 3,
			max: 255,
			example: ['{like}can', '{<>}do']
		},
	},
};