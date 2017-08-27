const _ = require('lodash');


const SortQR = {

	sort2Query: (model, columns) => {
		columns.forEach(function(col){
			model.orderBy(col[0], col[1]);
		});

		return model;
	}

};



module.exports = SortQR;

