import {DELETE_ROLE, EDIT_ROLE, NEW_ROLE, ROLE_FORM_ERROR} from '../../actions/types';


export default function (state = {}, action) {

    switch (action.type) {

        case NEW_ROLE :
            console.log(action.payload.docs)
           return {id: action.payload.docs.id, error: '' };

        case EDIT_ROLE :
            const respond =  action.payload.docs;
            return {id: action.payload.docs.id, error: '' };

        case DELETE_ROLE :

            return {id: action.payload.docs.id, error: '' };

        case ROLE_FORM_ERROR :

            const errorListArray = action.payload.data.details.map((error)=>{
                        return {[error.path]: error.message}
            });

            const errorListObj = Object.assign({}, ...errorListArray);//merge all object
            return {id: null, error: errorListObj };


    }

    return state
}
