const Boom = require('boom');
const URL = require('url');
const DB = require('../../../../../config/sequelize');

const User = DB.User;


const UserFindAll =
	{
		userFindAll: function (request, reply) {
			let requestData = request.pre.requestData;

			// Calculating records total number
			let totalCount = 0;
			let filteredCount = 0;

			if (requestData.queryData.count) {
				User
					.count()
					.then(function (totCount) {
						if (totCount.isNaN) {
							return reply(Boom.badRequest('Impossible to count'));
						}
						totalCount = totCount;
						User
							.count({
								where: requestData.queryData.filter,
							})
							.then(function (fltCount) {
								if (fltCount.isNaN) {
									return reply(Boom.badRequest('Impossible to count'));
								}
								return reply({
									totalCount: totalCount,
									filteredCount: fltCount
								});
							})
					})
					.catch(function (error) {
						let errorMsg = error.message || 'An error occurred';
						return reply(Boom.gatewayTimeout(errorMsg));
					});
			} else {
				User
					.count()
					.then(function (totCount) {
						if (totCount.isNaN) {
							return reply(Boom.badRequest('Impossible to count'));
						}
						totalCount = totCount;
						User
							.findAll({
								limit: requestData.queryData.pagination.limit,
								offset: requestData.queryData.pagination.offset,
								include: requestData.queryData.include,
								attributes: requestData.queryData.fields,
								where: requestData.queryData.filter,
								order: requestData.queryData.sort,
							})
							.then(function (result) {
								// if (result.count.isNaN) {
								// 	return reply(Boom.badRequest('Impossible to count'));
								// }
								// filteredCount = result.count;
								if (!result) {
									return reply(Boom.badRequest('No users'));
								}

								let mapper = {
									meta: {
										totalCount: totalCount,
										filteredCount: filteredCount,
										page: requestData.queryData.pagination.page,
										pageCount: Math.floor(totalCount / requestData.queryData.pagination.pageSize) + 1,
										pageSize: requestData.queryData.pagination.pageSize,
										rowCount: result.length,
									},
									data: result,
								};
								return reply(mapper);

							})
					})
					.catch(function (error) {
						let errorMsg = error.message || 'An error occurred';
						return reply(Boom.gatewayTimeout(errorMsg));
					});
			}
		}
	};

module.exports = UserFindAll;