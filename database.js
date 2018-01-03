const Env       = process.env.NODE_ENV || 'development';
const DBConfig    = require('./config/database')[Env];
const Sequelize = require('sequelize');

module.exports.register = (server, options, next) => {
	const config = DBConfig;
	const	opts = {
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
			freezeTableName: false,


			// Enable optimistic locking.  When enabled, sequelize will add a version count attribute
			// to the model and throw an OptimisticLockingError error when stale instances are saved.
			// Set to true or a string with the attribute name you want to use to enable.
			// version: true,
		};



	server.register([{
		register: require('hapi-sequelizejs'),
		options: [{
			name: 'hapiDB', // identifier
			models: ['./api/**/*_model.js'], // paths/globs to model files
			sequelize: new Sequelize(DBConfig.database, DBConfig.username, DBConfig.password, DBConfig, opts), // sequelize instance
			sync: true, // sync models - default false
			forceSync: false // force sync (drops tables) - default false
		}]
	}]);

	next();

};

module.exports.register.attributes = {
	name: 'sequelize',
	version: '0.0.1',
};