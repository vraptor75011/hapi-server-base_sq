import {NEW_USER, EDIT_USER, DELETE_USER, USER_FORM_ERROR} from '../../actions/types';


export default function (state = {}, action) {

    switch (action.type) {

        case NEW_USER :

            return {id: action.payload.docs.id, error: '' };

        case EDIT_USER :
            const respond =  action.payload.docs;
            return {id: action.payload.docs.id, error: '' };

        case DELETE_USER :

            return {id: action.payload.docs.id, error: '' };

        case USER_FORM_ERROR :

            return {id: null, error: action.payload };


    }

    return state
}

