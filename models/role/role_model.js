const SeqBase = require('../sequelize');
const Sequelize = require('sequelize');


const Role = SeqBase.define('roles', {

	// ATTRIBUTES
	name: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
		validation: {
			len: [3,64]
		},
	},
	description: {
		type: Sequelize.STRING,
		allowNull: true,
	},


});

module.exports = Role;