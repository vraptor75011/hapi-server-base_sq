const Bookshelf = require('../bookshelf');

// related models
require('../../models/realm/realm_model');
require('../../models/role/role_model');
require('../../models/user/user_model');

const RealmsRolesUsers = Bookshelf.Model.extend({
		tableName: 'realms_roles_users',

		softDelete: true,
		hasTimestamps: true,

		// relationships
		realm: function () {
			return this.belongsTo(Bookshelf._models.Realm)
		},
		role: function () {
			return this.belongsTo(Bookshelf._models.Role)
		},
		user: function () {
			return this.belongsTo('User', 'id');
		},
	},
);

module.exports = Bookshelf.model('RealmsRolesUsers', RealmsRolesUsers);