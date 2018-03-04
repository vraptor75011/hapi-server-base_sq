import {DELETE_GEOREPARTITION, EDIT_GEOREPARTITION, NEW_GEOREPARTITION} from '../../actions/types';


export default function (state = {}, action) {

    switch (action.type) {

        case NEW_GEOREPARTITION :
            console.log(action.payload.docs);
           return {id: action.payload.docs.id, error: '' };

        case EDIT_GEOREPARTITION :
            const respond =  action.payload.docs;
            return {id: action.payload.docs.id, error: '' };

        case DELETE_GEOREPARTITION :
            return {id: action.payload.docs.id, error: '' };

    }

    return state
}
