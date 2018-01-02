const Logging = require('loggin');


module.exports = {
	apiLogger: Logging.getLogger('Api'),
	sequelizeLogger: Logging.getLogger('Sequelize'),
	gulpLogger: Logging.getLogger('Gulp'),
};