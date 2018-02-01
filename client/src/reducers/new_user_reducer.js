import {NEW_USER, NEW_USER_ERROR} from '../actions/types';


export default function (state = {}, action) {

    switch (action.type) {

        case NEW_USER :

            if (action.payload) {

                return {new: true, error: '' };
            }
        break;

        case NEW_USER_ERROR :
            if (action.payload) {

                return {edited: false, error: action.payload };
            }
            break;

    }


    return state
}
