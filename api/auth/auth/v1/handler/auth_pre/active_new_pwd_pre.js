const { apiLogger, chalk } = require('../../../../../../utilities/logging/logging');
const Jwt = require('jsonwebtoken');
const Boom = require('boom');
const Config = require('../../../../../../config/config');
const Sequelize = require('sequelize');
const DB = require('../../../../../../config/sequelize');

const Op = Sequelize.Op;

const AuthUser = DB.AuthUser;


module.exports = [
	{
		assign: 'decoded',
		method: async (request, h) => {
			Jwt.verify(request.query.token, Config.get('/jwtSecret'), function (error, decoded) {
				if (error) {
					return Boom.badRequest('Invalid email or key.');
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
						resetPasswordExpires: { [Op.gt]: Date.now() }
					}
				};
				let user = await AuthUser.findOne(conditions);
				if (!user) {
					return Boom.badRequest('Invalid email or key.');
				}
				return h.response(user);
			} catch(error) {
				apiLogger.error(chalk.red(error));
				let errorMsg = error.message || 'An error occurred';
				return Boom.badImplementation(errorMsg);
			}
		}
	}
];
