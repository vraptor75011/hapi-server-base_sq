import {combineReducers} from 'redux';
import {reducer as form} from 'redux-form';
import auth from './auth_reducer';
import users from './get_users_reducer';
import deleteUsers from './delete_user_reducer';

//import usersReducer from './users_reducer';


const rootReducer = combineReducers({
    form,
    auth,
    users,
    deleteUsers
});

export default rootReducer;