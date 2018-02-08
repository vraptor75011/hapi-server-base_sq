import {MODAL_ROLE_DATA} from '../../actions/types';


export default function (state = {id: "", "name": '', "description": ''}, action) {

    switch (action.type) {

        case MODAL_ROLE_DATA:

            return action.payload;

    }
    return state

}

