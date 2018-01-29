import {GET_USERS} from '../actions/types';


export default function (state = {}, action) {

    switch (action.type) {

        case GET_USERS :

            if (action.payload.data) {

                const docs = action.payload.data.docs;
                const pages = action.payload.data.pages;

                return {...state, docs, pages}
            }


    }


    return state
}