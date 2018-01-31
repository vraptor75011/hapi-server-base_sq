import {MODAL_OPEN, MODAL_CLOSE} from '../actions/types';


export default function (state = null, action) {

    switch (action.type) {

        case MODAL_OPEN:
            return true;

        case MODAL_CLOSE:
            return null;
        default:
            return state


    }

}

