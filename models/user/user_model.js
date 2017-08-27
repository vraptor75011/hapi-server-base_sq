const SeqBase = require('../sequelize');
const Sequelize = require('sequelize');
const Role = require('../role/role_model');
const Realm = require('../realm/realm_model');
const RealmsRolesUsers = require('../realms_roles_users/realms_roles_users_model');



const User = SeqBase.define('users', {

		// ATTRIBUTES
		username: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
			validation: {
				len: [3,64]
			},
		},
		email: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
			validation:  {
				isEmail: true
			}
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false,
			validation: {
				len: [8,32]
			},
		},
		isActive: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
		},
	},
);

User.belongsToMany(Role, { through: RealmsRolesUsers });
User.belongsToMany(Realm, { through: RealmsRolesUsers });

module.exports = User;