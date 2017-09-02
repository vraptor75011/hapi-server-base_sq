const FilterQR = require('./filter_query');
const FieldsQR = require('./fields_query');


const QueryBase = {
	filtered: (model, queryData) => {

		if (queryData.fields) {
			model = FieldsQR.fields2Query(model, queryData.fields);
		}

		if (queryData.filter) {
			model = FilterQR.filter2Query(model, queryData.filter);
		}


		return model;
	}


};

module.exports = QueryBase;