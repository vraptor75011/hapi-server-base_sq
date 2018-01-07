'use strict';
const Users = require('./data/01-user_data');
const Realms = require('./data/02-realm_data');
const Roles = require('./data/03-role_data');
const RealmsRolesUsers = require('./data/04-realms_roles_users_data');

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('users', Users, {})
        .then(function(){
	        return queryInterface.bulkInsert('realms', Realms, {})
		        .then(function() {
			        return queryInterface.bulkInsert('roles', Roles, {})
				        .then(function() {
					        return queryInterface.bulkInsert('realms_roles_users', RealmsRolesUsers, {})
				        })
		        })
        })
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('realms_roles_users', null, {})
	      .then(function() {
		      return queryInterface.bulkDelete('roles', null, {})
			      .then(function() {
				      return queryInterface.bulkDelete('realms', null, {})
					      .then(function() {
						      return queryInterface.bulkDelete('users', null, {})
					      })
			      })
	      })
  }
};
