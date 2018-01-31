import {EDIT_USER, EDIT_USER_ERROR} from '../actions/types';


export default function (state = {}, action) {

    switch (action.type) {

        case EDIT_USER :

            if (action.payload) {
                console.log(action.payload)
                const respond =  action.payload.docs;
                return {edited: true, error: '' };
            }
        break;

        case EDIT_USER_ERROR :
            if (action.payload) {

            console.log(action.payload)
                const respond =  action.payload.docs;
                return {edited: false, error: respond };
            }
            break;

    }


    return state
}
