const FS = require('fs');
const _ = require('lodash');

let routes = [];

let getFiles = function(dir, fileList = []) {
//
	let	files = FS.readdirSync(dir);
	files.forEach(function(file) {
		if (FS.statSync(dir + '/' + file).isDirectory()) {
			getFiles(dir + '/' + file, fileList);
		}
		else if (_.includes(file, '_routes.js')) {
			fileList.push(dir + '/' + file);
		}
	});
	return fileList;
};

let routesFiles = getFiles('api');

routesFiles.forEach((route) => {
	routes = routes.concat(require('./' + route));
});


module.exports = routes;