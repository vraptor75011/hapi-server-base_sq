import {FORM_ERROR, FORM_CANCEL} from '../actions/types';


export default function (state = {id: null, error: '' }, action) {

    switch (action.type) {



        case FORM_ERROR :

            const errorListArray = action.payload.data.details.map((error)=>{
                        return {[error.path]: error.message}
            });

            const errorListObj = Object.assign({}, ...errorListArray);//merge all object
            return {id: null, error: errorListObj };

        case FORM_CANCEL :

            return {id: null, error: '' };

    }

    return state
}
