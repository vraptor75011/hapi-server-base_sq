// Update with your config settings.
const Dotenv = require('dotenv');

Dotenv.config({ silent: true });

module.exports = {

  development: {
	  client: 'mysql',
	  connection: {
		  port: process.env.DATABASE_PORT,
		  host: process.env.DATABASE_HOST,
		  database: process.env.DATABASE_NAME,
		  user: process.env.DATABASE_USER,
		  password: process.env.DATABASE_ACCESS_KEY,
	  },
	  pool: {
		  min: process.env.DATABASE_POOL_MIN,
		  max: process.env.DATABASE_POOL_MAX,
	  },
	  migrations: {
		  directory: './db/migrations',
		  tableName: 'knex_migrations',
	  },
	  seeds: {
		  directory: './db/seeds',
	  },
  },

  staging: {
	  client: 'mysql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
	  client: 'mysql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
