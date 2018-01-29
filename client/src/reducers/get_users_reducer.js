import {GET_USERS} from '../actions/types';


export default function (state = {}, action) {

    switch (action.type) {

        case GET_USERS :

            if (action.payload.data) {

                const data = action.payload.data;

                return {...state, data}
            }


    }


    return state
}