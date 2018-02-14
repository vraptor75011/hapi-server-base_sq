import {DELETE_ROLE, EDIT_ROLE, NEW_ROLE} from '../../actions/types';


export default function (state = {}, action) {

    switch (action.type) {

        case NEW_ROLE :
            console.log(action.payload.docs)
           return {id: action.payload.docs.id, error: '' };

        case EDIT_ROLE :
            const respond =  action.payload.docs;
            return {id: action.payload.docs.id, error: '' };

        case DELETE_ROLE :

            return {id: action.payload.docs.id, error: '' };



    }

    return state
}
