const Logging = require('loggin');


module.exports = {
	apiLogger: Logging.getLogger('Api'),
	sequelizeLogger: Logging.getLogger('Sequelize'),
	session: Logging.getLogger('Session'),
};