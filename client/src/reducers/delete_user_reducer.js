import {DELETE_USER, DELETE_USER_ERROR} from '../actions/types';


export default function (state = null, action) {

    switch (action.type) {

        case DELETE_USER :

            if (action.payload) {


                return action.payload.docs;
            }
            break;
        case DELETE_USER_ERROR :

            if (action.payload) {


                return action.payload.docs;
            }
            break;

    }


    return state
}
