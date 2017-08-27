const _ = require('lodash');


const FieldsQR = {

	fields2Query: (model, fields) => {
		Object.keys(fields).forEach(function(key) {
			model.select(fields[key]);
		});

		return model;
	}

};



module.exports = FieldsQR;

