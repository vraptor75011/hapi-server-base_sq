import { MODAL_CLOSE, MODAL_OPEN } from './types';


export function openModal() {
    return function (dispatch) {
        dispatch({type: MODAL_OPEN});
    }
}



export function closeModal() {
    return function (dispatch) {
        dispatch({type: MODAL_CLOSE});
    }
}

