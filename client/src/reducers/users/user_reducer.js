import {NEW_USER, EDIT_USER, DELETE_USER} from '../../actions/types';


export default function (state = {}, action) {

    switch (action.type) {

        case NEW_USER :

            return {id: action.payload.docs.id, error: '' };

        case EDIT_USER :
            const respond =  action.payload.docs;
            return {id: action.payload.docs.id, error: '' };

        case DELETE_USER :

            return {id: action.payload.docs.id, error: '' };


    }

    return state
}

