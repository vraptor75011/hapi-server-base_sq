import axios from 'axios';
import { GET_REALMS, MODAL_CLOSE, FORM_ERROR } from './types';
import { tokenName } from '../config';
import authHelper from '../helpers/auth_helper';

import { push } from 'react-router-redux';

export function getRealms(params) {

  return async (dispatch, getState) => {

      const token = await authHelper();
      if(token) {
          try {
              axios.defaults.headers.common['Authorization'] = localStorage.getItem(tokenName);
              const response = await axios.get(`/api/v1/auth/realms`, {params: params} );
              return dispatch({type: GET_REALMS, payload: response.data});
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

export function deleteRealm(id) {
  return async dispatch => {
    try {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem( tokenName);
        await axios.delete(`/api/v1/auth/realms/${id}`, { data: { "$hardDelete": true }});
        dispatch(getRealms());
        return dispatch({type: MODAL_CLOSE });

    } catch (error) {
        if (error.response && error.response.status === 401) {
            dispatch(push('/login'));
        }
        else if (error.response && error.response.status === 400) {
            dispatch({type: FORM_ERROR, payload: error.response});
        }



    }
  };
}


export function editRealm(data) {
    return async (dispatch, getState) => {

        const token = await authHelper();


        if(token) {
            try {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem(tokenName);

                await axios.put(`/api/v1/auth/realms/${data.id}`, data);

                dispatch(getRealms());
                return dispatch({type: MODAL_CLOSE });


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    dispatch(push('/login'));
                }
                else if (error.response && error.response.status === 400) {
                    dispatch({type: FORM_ERROR, payload: error.response});
                }


            }
        }
    };
}

export function newRealm(data) {
    return async (dispatch, getState) => {

        const token = await authHelper();
        if(token) {
            try {
                const config = { responseType: 'json'};
                axios.defaults.headers.common['Authorization'] = localStorage.getItem(tokenName);
                await axios.post('/api/v1/auth/realms', data, config);

                    dispatch(getRealms());
                    dispatch({type: MODAL_CLOSE });


            } catch (error) {

                if (error.response && error.response.status === 401) {
                    dispatch(push('/login'));
                }
                else if (error.response && error.response.status === 400) {
                    dispatch({type: FORM_ERROR, payload: error.response});
                }
            }
        }
    };
}

