const Role = require('../../../models/role/role_model');
const Boom = require('boom');

const Mapper = require('jsonapi-mapper');

const RoleFindAll =
	{
		roleFindAll: function (request, reply) {
			let mapper = new Mapper.Bookshelf(request.server.info.uri);

			let requestData = request.pre.requestData;

			let totalCount = 0;
			let filteredCount = 0;

			if (query.extra.count) {
				Role
					.count()
					.then(function (totCount) {
						if (totCount.isNaN) {
							return reply(Boom.badRequest('Impossible to count'));
						}
						totalCount = totCount;
						Role
							.filtered(query.filters)
							.count()
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
				Role
					.count()
					.then(function (totCount) {
						if (totCount.isNaN) {
							return reply(Boom.badRequest('Impossible to count'));
						}
						totalCount = totCount;
						Role
							.forge()
							.filtered(query.filters)
							.count()
							.then(function (fltCount) {
								if (fltCount.isNaN) {
									return reply(Boom.badRequest('Impossible to count'));
								}
								filteredCount = fltCount;
								Role
									.forge()
									.filtered_ordered(query.filters, query.sort)
									.fetchPage(paginationOptions)
									.then(function (collection) {
										if (!collection) {
											return reply(Boom.badRequest('No roles'));
										}

										const mapperOptions = {
											meta: {
												totalCount: totalCount,
												filteredCount: filteredCount,
												page: collection.pagination.page,
												pageCount: collection.pagination.pageCount,
												pageSize: collection.pagination.pageSize,
												rowCount: collection.pagination.rowCount,
											},
										};
										let collMap = mapper.map(collection, 'role', mapperOptions);
										return reply(collMap);
									})
							})
					})
					.catch(function (error) {
						let errorMsg = error.message || 'An error occurred';
						return reply(Boom.gatewayTimeout(errorMsg));
					});
			}
		}
	};

module.exports = RoleFindAll;