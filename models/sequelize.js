const Sequelize = require('sequelize');
const Dotenv = require('dotenv');

Dotenv.config({ silent: true });


const SeqBase = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_ACCESS_KEY, {
	host: process.env.DATABASE_HOST,
	dialect: 'mysql',

	pool: {
		min: process.env.DATABASE_POOL_MIN,
		max: process.env.DATABASE_POOL_MAX,
	},

	define: {
		// don't add the timestamp attributes (updatedAt, createdAt)
		timestamps: true,

		// don't delete database entries but set the newly added attribute deletedAt
		// to the current date (when deletion was done). paranoid will only work if
		// timestamps are enabled
		paranoid: true,

		// don't use camelcase for automatically added attributes but underscore style
		// so updatedAt will be updated_at
		underscored: false,

		// disable the modification of table names; By default, sequelize will automatically
		// transform all passed model names (first parameter of define) into plural.
		// if you don't want that, set the following
		freezeTableName: true,


		// Enable optimistic locking.  When enabled, sequelize will add a version count attribute
		// to the model and throw an OptimisticLockingError error when stale instances are saved.
		// Set to true or a string with the attribute name you want to use to enable.
		// version: true,
	},

});



module.exports = SeqBase;