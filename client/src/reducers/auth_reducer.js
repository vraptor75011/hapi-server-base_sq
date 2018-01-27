import {AUTH_ERROR, AUTH_USER, UNAUTH_USER, LOADING_TOKEN} from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case AUTH_USER:
            return {...state, error: '', authenticated: true};
        case UNAUTH_USER:
            return {...state, error: null, authenticated: false};
        case AUTH_ERROR:
            return {...state, error: 'Invalid email or password. Please try again'};
        case LOADING_TOKEN:
            console.log(action)
            return {...state, fetching: false };

    }

    return state;
}