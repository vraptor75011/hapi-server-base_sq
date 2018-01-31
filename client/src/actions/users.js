import axios from 'axios';
import { GET_USERS, DELETE_USER, EDIT_USER, EDIT_USER_ERROR, MODAL_CLOSE  } from './types';
import { tokenName, refreshTokenName, profileName } from '../config';
import authHelper from '../helpers/auth_helper';

import { push } from 'react-router-redux';

export function getUsers() {

  return async (dispatch, getState) => {

      const token = await authHelper();
      if(token) {
          try {
              axios.defaults.headers.common['Authorization'] = localStorage.getItem(tokenName);
              const response = await axios.get(`/api/v1/users`);
              return dispatch({type: 'GET_USERS', payload: response.data});
          } catch (error) {
              if (error.response && error.response.status === 401) {
                  dispatch(push('/login'));
              } else {
                  dispatch(push('/login'));
                  console.log('ERRORE............');
              }
          }
      }
  };
}

export function deleteUser(id) {
  return async dispatch => {
    try {
      axios.defaults.headers.common['Authorization'] = localStorage.getItem(
        tokenName,
      );
      const response = await axios.delete(`http://localhost:8000/user/${id}`);
      return dispatch(
        { type: 'DELETE_USER', payload: response.data },
        getUsers(),
      );
    } catch (error) {
      if (error.response && error.response.status === 401) {
        //if request is unauthorized redirect to login page
        dispatch(push('/login'));
      } else {
        console.log('ERRORE............');
      }
    }
  };
}


export function editUser(data) {
    return async (dispatch, getState) => {

        const token = await authHelper();


        if(token) {
            try {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem(tokenName);

                const response = await axios.put(`/api/v1/users/${data.id}`, data);

                dispatch(getUsers());
                return dispatch({type: MODAL_CLOSE });


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    dispatch(push('/login'));
                }
                else if (error.response && error.response.status === 400) {
                    dispatch({type: 'EDIT_USER_ERROR', payload: error.response});
                }


            }
        }
    };
}

export function newUser() {
    return async (dispatch, getState) => {

        const token = await authHelper();
        if(token) {
            try {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem(tokenName);
                const response = await axios.get(`http://localhost:4000/api/v1/users`);
                return dispatch({type: 'GET_USERS', payload: response.data});
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    dispatch(push('/login'));
                } else {
                    dispatch(push('/login'));
                    console.log('ERRORE............');
                }
            }
        }
    };
}
