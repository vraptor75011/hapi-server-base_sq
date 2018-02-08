import {EDIT_ROLE, EDIT_ROLE_ERROR} from '../../actions/types';


export default function (state = {}, action) {

    switch (action.type) {

        case EDIT_ROLE :

            if (action.payload) {
                console.log(action.payload)
                const respond =  action.payload.docs;
                return {edited: true, error: '' };
            }
        break;

        case EDIT_ROLE_ERROR :
            if (action.payload) {

            console.log(action.payload)
                const respond =  action.payload.docs;
                return {edited: false, error: respond };
            }
            break;

    }


    return state
}
