const _ = require('lodash');


const PaginateQR = {

	page2Query: (model, paginate) => {
		model.offset(paginate.offset).limit(paginate.limit);

		return model;
	}

};



module.exports = PaginateQR;

