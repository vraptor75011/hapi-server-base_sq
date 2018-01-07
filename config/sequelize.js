const Sequelize = require('sequelize');
const Dotenv = require('dotenv');
const FS = require('fs');
const _ = require('lodash');
//
const Env       = process.env.NODE_ENV || 'development';
const Config    = require('../config/database')[Env];
const Log = require('../utilities/logging/logging');
const Chalk = require('chalk');
//
Dotenv.config({ silent: true });
//
let getFiles = function(dir, fileList = []) {
//
	let	files = FS.readdirSync(dir);
	files.forEach(function(file) {
		if (FS.statSync(dir + '/' + file).isDirectory()) {
			getFiles(dir + '/' + file, fileList);
		}
		else if (_.includes(file, '_model.js')) {
			let tmp = {};
			tmp.name = _.upperFirst(_.camelCase(_.replace(file, '_model.js', '')));
			tmp.path = '../' + dir + '/' + file;
			fileList.push(tmp);
		}
	});
	return fileList;
};
//
// Sequelize Logging
let logging = function (str) {
	Log.sequelizeLogger.info(Chalk.green(str));
};

Config['logging'] = logging;


let sequelize = new Sequelize(Config.database, Config.username, Config.password, Config,
	{
		define: {
			// don't add the timestamp attributes (updatedAt, createdAt)
			timestamps: true,
//
// 			don't delete database entries but set the newly added attribute deletedAt
// 			to the current date (when deletion was done). paranoid will only work if
// 			timestamps are enabled
			paranoid: true,
//
// 			don't use camelcase for automatically added attributes but underscore style
// 			so updatedAt will be updated_at
			underscored: false,
//
// 			disable the modification of table names; By default, sequelize will automatically
// 			transform all passed model names (first parameter of define) into plural.
// 			if you don't want that, set the following
			freezeTableName: false,
//
//
// 			Enable optimistic locking.  When enabled, sequelize will add a version count attribute
// 			to the model and throw an OptimisticLockingError error when stale instances are saved.
// 			Set to true or a string with the attribute name you want to use to enable.
			version: true,
		},
//
	});
//
const DB = {
	Sequelize: Sequelize,
	sequelize: sequelize,
};
//
let modelFiles = getFiles('api');
//
modelFiles.forEach(function(model){
	DB[model.name] = DB.sequelize.import(model.path);
});
//
Object.keys(DB).forEach(function(modelName) {
	if (DB[modelName].associate) {
		DB[modelName].associate(DB);
	}
});
//
//
//
//
module.exports = DB;
