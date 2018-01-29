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
		method: async (request, reply) => {
			Jwt.verify(request.query.token, Config.get('/jwtSecret'), function (err, decoded) {
				if (err) {
					return reply(Boom.badRequest('Invalid email or key.'));
				}
				return reply(decoded);
			});
		}
	},
	{
		assign: 'user',
		method: async (request, reply) => {
			try{
				const conditions = { where: {
						email: request.pre.decoded.email,
						resetPasswordExpires: { [Op.gt]: Date.now() }
					}
				};
				let user = await User.findOne(conditions);
				if (!user) {
					return reply(Boom.badRequest('Invalid email or key.'));
				}
				return reply(user);
			} catch(error) {
				Log.apiLogger.error(Chalk.red(error));
				return reply(Boom.badImplementation('There was an error accessing the database.'));
			}
		}
	}
];
