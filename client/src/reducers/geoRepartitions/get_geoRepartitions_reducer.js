import {GET_GEOREPARTITIONS} from '../../actions/types';


export default function (state = { docs: null, pages: {current: 1, hasNext: false,
        hasPrev: false, next: 2,prev: 0,total: 1}}, action) {

    switch (action.type) {

        case GET_GEOREPARTITIONS :

            if (action.payload) {
                const docs = action.payload.docs;
                const pages = action.payload.pages;

                return {...state, docs, pages}
            }
    }

    return state
}
