import axios from 'axios';
import {GET_USERS, DELETE_USER} from './types'
import { tokenName, refreshTokenName, profileName } from '../config';
import {getToken, setToken} from "../helpers/store/store_manager";
import {push} from "react-router-redux";


export function getUsers() {


	axios.defaults.headers.common['Authorization'] = localStorage.getItem(tokenName);
	const request = axios.get(`http://localhost:8000/api/v1/users`);

	return {
		type: 'GET_USERS',
		payload: request
	}

}


export function deleteUsers(id) {



	const request = axios.delete(`http://localhost:8000/api/v1/user/${id}`);

	return {
		type: 'DELETE_USER',
		payload: request
	}

}

// export async getUsers() => {
// 	let token = getToken();
// 	if (token) {
// 		axios.defaults.headers.common['Authorization'] = token;
// 		const response = await axios.get(`http://localhost:4000/api/v1/users`);
// 		if (response) {
//
// 		    if (response.headers && response.headers['x-auth-header'] && response.headers['x-refresh-token'] ) {
// 		        setToken(response.headers['x-auth-header'], response.headers['x-refresh-token']);
//         }
// 		    if (response.headers && response.headers['x-user'] ) {
// 		        setProfile(JSON.parse(response.headers['x-user']));
//         }
//
// 			return {
// 				type: 'GET_USERS',
// 				payload: response
// 			}
// 		}
//
//
// 	} else {
// 		// Middleware???
// 		// O Chiami this.props.dispatch(push("/login"));
// 	}
//
//
// }


