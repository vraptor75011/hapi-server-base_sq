const Bookshelf = require('../bookshelf');

// related models
require('../../models/realms_roles_users/realms_roles_users_model');

let Role = Bookshelf.Model.extend({
		tableName: 'roles',

		softDelete: true,
		hasTimestamps: true,

		// relationships
		realms_roles_users: function () {
			return this.hasMany(Bookshelf._models.RealmsRolesUsers, 'realms_roles_users', 'role_id');
		},

		// scopes
		scopes: {
			filtered: function (qb, filters) {
				Object.keys(filters).map((e) => {
					let signal = '=';
					if (typeof filters[e] === 'object') {
						signal = 'in';
						qb.whereIn(e, filters[e]);
					} else if (typeof filters[e] === 'string') {
						signal = 'LIKE';
					}
					qb.where(e, signal, filters[e]);
				});
			},
			filtered_ordered: function (qb, filters, sort) {
				Object.keys(filters).map((e) => {
					let signal = '=';
					if (typeof filters[e] === 'object') {
						signal = 'in';
						qb.whereIn(e, filters[e]);
					} else if (typeof filters[e] === 'string') {
						signal = 'LIKE';
					}
					qb.where(e, signal, filters[e]);
				});
				sort.forEach(function (el) {
					qb.orderBy(el.column, el.direction);
				})

			}
		},

	},
	// {
	// 	scopes: {
	// 		inRealm: function (qb, realmId) {
	// 			qb.where({realmId: realmId});
	// 		},
	// 	},
	// },
);

module.exports = Bookshelf.model('Role', Role);