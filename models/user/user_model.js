const Bookshelf = require('../bookshelf');
const UserSchema = require('./user_schema');
const QueryBase = require('../query/query_base');
const FilterQR = require('../query/filter_query');
const FieldsQR = require('../query/fields_query');
const SortQR = require('../query/sort_query');
const RelatedQR = require('../query/related_query');
const PaginateQR = require('../query/paginate_query');

// related models
require('../../models/realms_roles_users/realms_roles_users_model');
require('../../models/realm/realm_model');


const User = Bookshelf.Model.extend({
		tableName: 'users',
		idAttribute: 'id',

		softDelete: true,
		hasTimestamps: true,

		hidden: ['password'],

		// validations
		validate: UserSchema.schemaModel,

		// relationships
		realmsRolesUsers: function () {
			return this.hasMany('RealmsRolesUsers', 'user_id');
		},

		// roles: function () {
		// 	return this.belongsToMany(Role, 'realms_roles_users', 'userId', 'roleId');
		// },
		// realmRoles: function (realmId) {
		// 	return this.belongsToMany(Role, 'realms_roles_users', 'userId', 'roleId').inRealm(realmId);
		// },

		// scopes
		scopes: {
			realmRoles: function (qb, realmId) {
				// qb.join('roles_users', 'roles_users.user_id', '=', 'users.id');
				// qb.join('roles', 'roles.id', '=', 'roles_users.role_id');
				// qb.where('roles.realm_id', '=', realmId).debug(true);

			},
			onlyActive: function (qb) {
				qb.where({isActive: true});
			},
			// filtered: function (qb, filters) {
			// 	Object.keys(filters).map((e) => {
			// 		let signal = '=';
			// 		if (typeof filters[e] === 'object') {
			// 			signal = 'in';
			// 		} else if (typeof filters[e] === 'string') {
			// 			signal = 'LIKE';
			// 		}
			// 		qb.where(e, signal, filters[e]);
			// 	});
			// },
			filtered: function(qb, queryData) {
				if (Object.keys(queryData.filter).length) {
					return FilterQR.filter2Query(this, queryData.filter);
				}
			},
			selected: function(qb, queryData) {
				if (Object.keys(queryData.fields).length) {
					return FieldsQR.fields2Query(this, queryData.fields);
				}
			},
			sorted: function(qb, queryData) {
				if (queryData.sort.length) {
					return SortQR.sort2Query(this, queryData.sort);
				}
			},
			related: function(qb, queryData) {
				return RelatedQR.with2Query(this, queryData);
			},
			paginated: function(qb, queryData) {
				return PaginateQR.page2Query(this, queryData.pagination);
			},

			filtered_ordered: function (qb, filters, sort) {
				Object.keys(filters).map((e) => {
					let signal = '=';
					let pippo = filters[e].length;
					if (typeof filters[e] === 'object') {
						if (filters[e].length) {
							signal = 'in';
						}
					} else if (typeof filters[e] === 'string') {
						signal = 'LIKE';
					}
					qb.where(e, signal, filters[e]);
				});
				sort.forEach(function (el) {
					qb.orderBy(el.column, el.direction);
				});
				qb.debug(true);
			}
		},
	},
	{
		// model functions MUST end with fetch(), count()...send the query
		filtered_count: function(filters) {
			return this
				.query(function (qb) {
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
				})
		},
	},

);


module.exports = Bookshelf.model('User', User);