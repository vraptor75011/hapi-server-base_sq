import {combineReducers} from 'redux';
import auth from './auth_reducer';
import users from './users/get_users_reducer';
import user from './users/user_reducer';
import modal from './modal_reducer';


import roles from './roles/get_roles_reducer';
import role from './roles/role_reducer';

import form from './form_reducer';



const rootReducer = combineReducers({
    form,
    auth,
    users,
    user,
    modal,
    roles,
    role

});

export default rootReducer;