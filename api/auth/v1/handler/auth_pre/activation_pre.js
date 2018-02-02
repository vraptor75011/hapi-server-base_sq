const Log = require('../../../../../utilities/logging/logging');
const Chalk = require('chalk');
const Jwt = require('jsonwebtoken');
const Boom = require('boom');
const Config = require('../../../../../config/config');
const Sequelize = require('sequelize');
const DB = require('../../../../../config/sequelize');

const Op = Sequelize.Op;

const User = DB.User;


module.exports = [
	{
		assign: 'decoded',
		method: async (request, h) => {
			Jwt.verify(request.query.token, Config.get('/jwtSecret'), function (err, decoded) {
				if (err) {
					return h.response(Boom.badRequest('Invalid email or key.'));
				}
				return h.response(decoded);
			});
		}
	},
	{
		assign: 'user',
		method: async (request, h) => {
			try{
				const conditions = { where: {
						email: request.pre.decoded.email,
						activateAccountExpires: { [Op.gt]: Date.now() }
					}
				};
				let user = await User.findOne(conditions);
				if (!user) {
					return h.response(Boom.badRequest('Invalid email or key.'));
				}
				return h.response(user);
			} catch(error) {
				Log.apiLogger.error(Chalk.red(error));
				return h.response(Boom.badImplementation('There was an error accessing the database.'));
			}
		}
	}
];
