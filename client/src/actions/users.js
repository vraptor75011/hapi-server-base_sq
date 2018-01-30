import axios from 'axios';
import {GET_USERS, DELETE_USER} from './types'
import { tokenName, refreshTokenName, profileName } from '../config';






export function getUsers() {


    axios.defaults.headers.common['Authorization'] = localStorage.getItem(tokenName);


    return function (dispatch) {

        axios.get(`http://localhost:4000/api/v1/users`).then(response =>
            dispatch({
                type: 'GET_USERS',
                payload: response.data
            }));


    }
}




export function deleteUsers(id) {



    const request = axios.delete(`http://localhost:8000/user/${id}`);

    return {
        type: 'DELETE_USER',
        payload: request
    }

}


