const Jwt = require('jsonwebtoken');
const Config = require('../config');

function createToken(user, session, scope, roles, realm, expirationPeriod) {

  let token = {};

  if (session) {
    user = session;
	  const tokenUser ={
		  username: user.username,
		  email: user.email,
		  createdAt: user.createdAt,
		  updatedAt: user.updatedAt,
	  };
    token = Jwt.sign({
      sessionUser: tokenUser,
      scope: scope,
	    roles: roles,
	    realm: realm,
    }, Config.get('/jwtSecret'), { algorithm: 'HS256', expiresIn: expirationPeriod });
  }
  else {
    const tokenUser ={
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    token = Jwt.sign({
      user: tokenUser,
      scope: scope,
	    roles: roles,
	    realm: realm,
    }, Config.get('/jwtSecret'), { algorithm: 'HS256', expiresIn: expirationPeriod });
  }

  return token;
}

module.exports = createToken;