const Jwt = require('jsonwebtoken');
const Config = require('../../config/config');

function createToken(user, session, scope, roles, realms, expirationPeriod) {

	let token = {};

	if (session) {
		const tokenUser = {
			sessionId: session.id,
			sessionKey: session.key,
			passwordHash: session.passwordHash,
		};
		token = Jwt.sign({
			sessionUser: tokenUser,
			scope: scope,
			roles: roles,
			realms: realms,
		}, Config.get('/jwtSecret'), { algorithm: 'HS256', expiresIn: expirationPeriod });
	}	else {
		const tokenUser = {
			id: user.id,
			username: user.username,
			email: user.email,
		};

		token = Jwt.sign({
			user: tokenUser,
			scope: scope,
			roles: roles,
			realms: realms,
		}, Config.get('/jwtSecret'), { algorithm: 'HS256', expiresIn: expirationPeriod });
	}

	return token;
}

module.exports = createToken;