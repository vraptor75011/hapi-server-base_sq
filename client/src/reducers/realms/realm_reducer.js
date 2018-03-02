import {DELETE_REALM, EDIT_REALM, NEW_REALM} from '../../actions/types';


export default function (state = {}, action) {

    switch (action.type) {

        case NEW_REALM :

           return {id: action.payload.docs.id, error: '' };

        case EDIT_REALM :
            const respond =  action.payload.docs;
            return {id: action.payload.docs.id, error: '' };

        case DELETE_REALM :

            return {id: action.payload.docs.id, error: '' };



    }

    return state
}
