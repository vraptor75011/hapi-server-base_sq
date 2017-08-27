const _ = require('lodash');

// Only ONE element follows
const Operator = ['{=}', '{<}', '{<=}', '{>}', '{>=}', '{<>}', '{like}'];

// Array follows
const InOperator = '{in}';
// Array follows ONLY TWO elements
const BtwOperator = '{btw}';
// End condition
const NullOperator = '{null}';
// Change Where => whereNot, orWhere, orWhereNot, orWhereNotLike
const OrOperator = '{or}';
const NotOperator = '{not}';

const FilterQR = {

	filter2Query: (model, filter) => {
		Object.keys(filter).forEach(function(key) {
			Object.keys(filter[key]).map((op) => {
				if (_.includes(Operator, op)) {
					let signal = _.replace(_.replace(op, '}', ''), '{', '');
					filter[key][op].forEach(function(value){
						model.where(key, signal, value);
					});
				}
				if (_.includes(InOperator, op)) {
					filter[key][op].forEach(function(value){
						model.whereIn(key, value);
					});
				}
				if (_.includes(BtwOperator, op)) {
					filter[key][op].forEach(function(value){
						model.whereBetween(key, value[0], value[1]);
					});
				}
				if (_.includes(NullOperator, op)) {
					model.whereNull(key);
				}
				if (_.includes(OrOperator, op)) {
					let orKeys = filter[key][op];
					Object.keys(orKeys).map((orOp) => {
						if (_.includes(Operator, orOp)) {
							let signal = _.replace(_.replace(orOp, '}', ''), '{', '');
							orKeys[orOp].forEach(function(value){
								model.orWhere(key, signal, value);
							});
						}
						if (_.includes(InOperator, orOp)) {
							orKeys[orOp].forEach(function(value){
								model.orWhereIn(key, value);
							});
						}
						if (_.includes(BtwOperator, orOp)) {
							orKeys[op][orOp].forEach(function(value){
								model.orWhereBetween(key, value[0], value[1]);
							});
						}
						if (_.includes(NullOperator, orOp)) {
							model.orWhereNull(key);
						}
						if (_.includes(NotOperator, orOp)){
							let orNotKeys = filter[key][op][orOp];
							Object.keys(orNotKeys).map((orNotOp) => {
								if (_.includes(Operator, orNotOp)) {
									let signal = _.replace(_.replace(orNotOp, '}', ''), '{', '');
									orNotKeys[orNotOp].forEach(function(value){
										model.orWhereNot(key, signal, value);
									});
								}
								if (_.includes(InOperator, orNotOp)) {
									orNotKeys[orNotOp].forEach(function(value){
										model.orWhereNotIn(key, value);
									});
								}
								if (_.includes(BtwOperator, orNotOp)) {
									orNotKeys[orNotOp].forEach(function(value){
										model.orWhereNotBetween(key, value[0], value[1]);
									});
								}
								if (_.includes(NullOperator, orNotOp)) {
									model.orWhereNotNull(key);
								}
							});
						}
					});
				}
				if (_.includes(NotOperator, op)){
					let notKeys = filter[key][op];
					Object.keys(notKeys).map((notOp) => {
						if (_.includes(Operator, notOp)) {
							let signal = _.replace(_.replace(notOp, '}', ''), '{', '');
							notKeys[notOp].forEach(function(value){
								model.whereNot(key, signal, value);
							});
						}
						if (_.includes(InOperator, notOp)) {
							notKeys[notOp].forEach(function(value){
								model.whereNotIn(key, value);
							});
						}
						if (_.includes(BtwOperator, notOp)) {
							notKeys[notOp].forEach(function(value){
								model.whereNotBetween(key, value[0], value[1]);
							});
						}
						if (_.includes(NullOperator, notOp)) {
							model.whereNotNull(key);
						}
					});
				}
			})
		});

		return model;
	}

};



module.exports = FilterQR;

