const Dotenv = require('dotenv');

Dotenv.config({ silent: true });

module.exports = {

	"development": {
		"hostname": process.env.DB_HOSTNAME,
		"port": process.env.DB_PORT,
		"username": process.env.DATABASE_USER,
		"password": process.env.DATABASE_ACCESS_KEY,
		"database": process.env.DATABASE_NAME,
		"dialect": process.env.DATABASE_DIALECT,
		"pool": {
			"min": process.env.DATABASE_POOL_MIN,
			"max": process.env.DATABASE_POOL_MAX,
		},

		// Use a different storage type. Default: sequelize
		"migrationStorage": "sequelize",

		// Use a different table name. Default: SequelizeMeta
		"migrationStorageTableName": "sequelize_meta",

		// Use a different storage. Default: none
		"seederStorage": "sequelize",

		// Use a different table name. Default: SequelizeData
		"seederStorageTableName": "sequelize_data",
	},

	"test": {
		"hostname": process.env.DB_HOSTNAME,
		"port": process.env.DB_PORT,
		"username": process.env.DATABASE_USER,
		"password": process.env.DATABASE_ACCESS_KEY,
		"database": process.env.DATABASE_NAME,
		"dialect": process.env.DATABASE_DIALECT,
		"pool": {
			"min": process.env.DATABASE_POOL_MIN,
			"max": process.env.DATABASE_POOL_MAX,
		}
	},

  "production": {
    "hostname": process.env.DB_HOSTNAME,
    "port": process.env.DB_PORT,
	  "username": process.env.DATABASE_USER,
	  "password": process.env.DATABASE_ACCESS_KEY,
	  "database": process.env.DATABASE_NAME,
	  "dialect": process.env.DATABASE_DIALECT,
    "pool": {
      "min": process.env.DATABASE_POOL_MIN,
      "max": process.env.DATABASE_POOL_MAX,
    }
  },
};

