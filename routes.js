const AuthRoutes = require('./handlers/auth/auth_routes');
const RoleRoutes = require('./handlers/role/role_routes');
const UserRoutes = require('./handlers/user/user_routes');


const Routes = [
	// Authentication Routes
	{ register: AuthRoutes},

	// Role Routes
	{ register: RoleRoutes},

	// User Routes
	{ register: UserRoutes},



];

module.exports = Routes;