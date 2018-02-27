import {UPDATE_LOCALES} from '../actions/types';

export default function locale(state = {}, action) {
    switch (action.type) {
        case UPDATE_LOCALES:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}
