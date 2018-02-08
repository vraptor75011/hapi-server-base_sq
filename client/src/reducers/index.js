import {combineReducers} from 'redux';
import {reducer as form} from 'redux-form';
import auth from './auth_reducer';
import users from './get_users_reducer';
import deleteUsers from './delete_user_reducer';
import editUser from './edit_user_reducer';
import newUser from './new_user_reducer';
import modal from './modal_reducer';
import singleUser from './single_user_reducer';

import roles from './roles/get_roles_reducer';
import deleteRole from './roles/delete_role_reducer';
import editRole from './roles/edit_role_reducer';
import newRole from './roles/new_role_reducer';
import modalRoleData from './roles/modal_role_data_reducer';

//import usersReducer from './users_reducer';


const rootReducer = combineReducers({
    form,
    auth,
    users,
    deleteUsers,
    editUser,
    modal,
    singleUser,
    newUser,
    roles,
    deleteRole,
    editRole,
    newRole,
    modalRoleData

});

export default rootReducer;