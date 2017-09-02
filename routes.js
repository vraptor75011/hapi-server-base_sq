const AuthRoutes = require('./api/v1/auth/routes/auth_routes');
const RoleRoutes = require('./api/v1/role/routes/role_routes');
const UserRoutes = require('./api/v1/user/routes/user_routes');


const Routes = [
	// Authentication Routes
	{ register: AuthRoutes},

	// Role Routes
	{ register: RoleRoutes},

	// User Routes
	{ register: UserRoutes},



];

module.exports = Routes;