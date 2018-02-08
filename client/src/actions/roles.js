import axios from 'axios';
import { GET_ROLES, MODAL_CLOSE, ROLE_FORM_ERROR } from './types';
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

export function deleteRole(id) {
  return async dispatch => {
    try {
      axios.defaults.headers.common['Authorization'] = localStorage.getItem(
        tokenName,
      );


      const response = await axios.delete(`/api/v1/roles/${id}`, { data: { "$hardDelete": true }});
        dispatch(getRoles());
        return dispatch({type: MODAL_CLOSE });

    } catch (error) {
        if (error.response && error.response.status === 401) {
            dispatch(push('/login'));
        }
        else if (error.response && error.response.status === 400) {
            dispatch({type: ROLE_FORM_ERROR, payload: error.response});
        }



    }
  };
}


export function editRole(data) {
    return async (dispatch, getState) => {

        const token = await authHelper();


        if(token) {
            try {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem(tokenName);

                const response = await axios.put(`/api/v1/roles/${data.id}`, data);

                dispatch(getRoles());
                return dispatch({type: MODAL_CLOSE });


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    dispatch(push('/login'));
                }
                else if (error.response && error.response.status === 400) {
                    dispatch({type: ROLE_FORM_ERROR, payload: error.response});
                }


            }
        }
    };
}

export function newRole(data) {
    return async (dispatch, getState) => {

        const token = await authHelper();
        if(token) {
            try {
                const config = { responseType: 'json'};
                axios.defaults.headers.common['Authorization'] = localStorage.getItem(tokenName);
                const response = await axios.post('/api/v1/roles', data, config);

                    dispatch(getRoles());
                    dispatch({type: MODAL_CLOSE });


            } catch (error) {
                console.log(error.response && error.response.status === 400)
                if (error.response && error.response.status === 401) {
                    dispatch(push('/login'));
                }
                else if (error.response && error.response.status === 400) {
                    dispatch({type: ROLE_FORM_ERROR, payload: error.response});
                }
            }
        }
    };
}

