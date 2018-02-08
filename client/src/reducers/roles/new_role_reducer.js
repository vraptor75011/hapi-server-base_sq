import {NEW_ROLE, NEW_ROLE_ERROR} from '../../actions/types';


export default function (state = {}, action) {

    switch (action.type) {

        case NEW_ROLE :

            if (action.payload) {

                return {new: true, error: '' };
            }
        break;

        case NEW_ROLE_ERROR :
            if (action.payload) {

                return {edited: false, error: action.payload };
            }
            break;

    }


    return state
}
