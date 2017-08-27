const Jwt = require('jsonwebtoken');
const Config = require('../config');

function createToken(user, session, scope, roles, realm, expirationPeriod) {

	let token = {};
	let tokenRoles = [];

	roles.forEach(function(role){
		let tmp = {
			id: role.id,
			name: role.name,
		};
		tokenRoles.push(tmp);
	});

	let tokenRealm = {
		id: realm.id,
		name: realm.name,
	};


	if (session) {
		user = session;
		const tokenUser = {
			id: user.id,
			username: user.username,
			email: user.email,
		};
		token = Jwt.sign({
			sessionUser: tokenUser,
			scope: scope,
			roles: tokenRoles,
			realm: tokenRealm,
		}, Config.get('/jwtSecret'), { algorithm: 'HS256', expiresIn: expirationPeriod });
	}
	else {
		const tokenUser = {
			id: user.id,
			username: user.username,
			email: user.email,
		};

		token = Jwt.sign({
			user: tokenUser,
			scope: scope,
			roles: tokenRoles,
			realm: tokenRealm,
		}, Config.get('/jwtSecret'), { algorithm: 'HS256', expiresIn: expirationPeriod });
	}

	return token;
}

module.exports = createToken;