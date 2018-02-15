const Logging = require('loggin');
const Chalk = require('chalk');


module.exports = {
	apiLogger: Logging.getLogger('Api'),
	seqLogger: Logging.getLogger('Sequelize'),
	sesLogger: Logging.getLogger('Session'),
	chalk: Chalk,
};