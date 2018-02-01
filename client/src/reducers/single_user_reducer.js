import {SINGLE_USER} from '../actions/types';


export default function (state = {id: "", "firstName": '', "lastName": '', "email": '', 'password': ''}, action) {

    switch (action.type) {

        case SINGLE_USER:
console.log(action.payload)
            return action.payload;

    }
    return state

}

