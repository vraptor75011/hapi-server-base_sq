import {combineReducers} from 'redux';
import auth from './auth_reducer';
import users from './users/get_users_reducer';
import user from './users/user_reducer';
import modal from './modal_reducer';


import roles from './roles/get_roles_reducer';
import role from './roles/role_reducer';

import realms from './realms/get_realms_reducer';
import realm from './realms/realm_reducer';

import form from './form_reducer';

import locale from './localesReducer';



const rootReducer = combineReducers({
    form,
    auth,
    users,
    user,
    modal,
    roles,
    role,
    locale,
    realms,
    realm


});

export default rootReducer;
