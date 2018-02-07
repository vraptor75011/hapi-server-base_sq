import axios from 'axios';
import {GET_ROLES, DELETE_ROLE, EDIT_ROLE, EDIT_ROLE_ERROR, MODAL_CLOSE, MODAL_OPEN, NEW_ROLE, NEW_USER_ERROR} from './types';
import { tokenName, refreshTokenName, profileName } from '../config';
import authHelper from '../helpers/auth_helper';

import { push } from 'react-router-redux';

export function getRoles(params) {

  return async (dispatch, getState) => {

      const token = await authHelper();
      if(token) {
          try {
              axios.defaults.headers.common['Authorization'] = localStorage.getItem(tokenName);
              const response = await axios.get(`/api/v1/roles`, );
              return dispatch({type: 'GET_ROLES', payload: response.data});
          } catch (error) {
              /*if (error.response && error.response.status === 401) {
                  dispatch(push('/login'));
              } else {
                  dispatch(push('/login'));
                  console.log('ERRORE............');
              }*/
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


      const response = await axios.delete(`/api/v1/users/${id}`, { data: { "$hardDelete": true }});
        dispatch(getRoles());
        return dispatch({type: MODAL_CLOSE });

    } catch (error) {
        if (error.response && error.response.status === 401) {
            dispatch(push('/login'));
        }
        else if (error.response && error.response.status === 400) {
            dispatch({type: 'DELETE_ERROR', payload: error.response});
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

                dispatch(getRoles());
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

export function newUser(data) {
    return async (dispatch, getState) => {

        const token = await authHelper();
        if(token) {
            try {
                const config = { responseType: 'json'};
                axios.defaults.headers.common['Authorization'] = localStorage.getItem(tokenName);
                const response = await axios.post('/api/v1/users', data, config);
                dispatch(getRoles());
                return dispatch({type: MODAL_CLOSE });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    dispatch(push('/login'));
                }
                else if (error.response && error.response.status === 400) {
                    dispatch({type: 'NEW_USER_ERROR', payload: error.response});
                }
            }
        }
    };
}


