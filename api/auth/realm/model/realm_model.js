module.exports = function(sequelize, Sequelize) {

	let AuthRealm = sequelize.define('authRealm', {

			// ATTRIBUTES
			id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "Primary and auto incremented key of the table",
				query: Query.id,
			},
			name: {
				type: Sequelize.STRING,
                default4Select: true,
				unique: true,
				allowNull: false,
				validation: {
					len: [3,64]
				},
				query: Query.name,
			},
			description: {
				type: Sequelize.STRING,
				allowNull: true,
				query: Query.description,
			},
		},
		{
			tableName: 'authRealms',
			paranoid: true,
			timestamps: true,
		},
	);

	// Class Method
	AuthRealm.associate = function (models) {
		AuthRealm.belongsToMany(models.AuthRole, { through: 'authRealmsRolesUsers', foreignKey: 'realmId', otherKey: 'roleId' });
		AuthRealm.belongsToMany(models.AuthUser, { through: 'authRealmsRolesUsers', foreignKey: 'realmId', otherKey: 'userId' });
		AuthRealm.hasMany(models.AuthRealmsRolesUsers, {as: 'realmRRU', foreignKey: 'realmId', sourceKey: 'id'});
	};

	return AuthRealm;
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
			description: 'the role name: AuthUser vs [{=}Admin,{<>}Admin,{like}SuperAdmin',
			example: ['{like}dmin', '{like}AuthUser'],
		},
		string: {
			regex: '',
			min: 3,
			max: 64,
			example: ['{like}AuthUser', '{<>}Admin']
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