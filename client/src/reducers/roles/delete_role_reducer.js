import {DELETE_ROLE} from '../../actions/types';


export default function (state = null, action) {

    switch (action.type) {

        case DELETE_ROLE :

            if (action.payload) {


                return action.payload.docs;
            }
            break;

    }


    return state
}
