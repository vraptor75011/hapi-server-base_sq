import {DELETE_USER} from '../actions/types';


export default function (state = null, action) {

    switch (action.type) {

        case DELETE_USER :

            if (action.payload) {


                return action.payload.docs;
            }


    }


    return state
}
