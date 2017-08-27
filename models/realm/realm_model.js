const Bookshelf = require('../bookshelf');

// related models
require('../../models/realms_roles_users/realms_roles_users_model');

const Realm = Bookshelf.Model.extend({
		tableName: 'realms',

		softDelete: true,
		hasTimestamps: true,

		// relationships
		realms_roles_users: function () {
			return this.hasMany(Bookshelf._models.RealmsRolesUsers, 'realms_roles_users', 'realm_id');
		},
	},
	// {
	// 	schema: [
	// 		Fields.StringField('name', {maxLength: 64, required: true}),
	// 		//Relations
	// 		BelongsToMany('User', {table: 'realms_users', foreignKey: 'realmId', otherKey: 'userId'}),
	// 		//Scopes
	// 		Scope('findByName', function(name) {
	// 			this.where('name', name)
	// 		}),
	// 	]
	// },
);

module.exports = Bookshelf.model('Realm', Realm);