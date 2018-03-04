import axios from 'axios';
import { GET_GEOREPARTITIONS, MODAL_CLOSE, FORM_ERROR } from './types';
import { tokenName } from '../config';
import authHelper from '../helpers/auth_helper';

import { push } from 'react-router-redux';

export function getGeoRepartitions(params) {

  return async (dispatch, getState) => {

      const token = await authHelper();
      if(token) {
          try {
              axios.defaults.headers.common['Authorization'] = localStorage.getItem(tokenName);
              const response = await axios.get(`/api/v1/cntr/geoRepartitions`, {params: params} );
              return dispatch({type: GET_GEOREPARTITIONS, payload: response.data});
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

export function deleteGeoRepartition(id) {
  return async dispatch => {
    try {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem( tokenName);
        await axios.delete(`/api/v1/cntr/geoRepartitions/${id}`, { data: { "$hardDelete": true }});
        dispatch(getGeoRepartitions());
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


export function editGeoRepartition(data) {
    return async (dispatch, getState) => {

        const token = await authHelper();


        if(token) {
            try {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem(tokenName);

                await axios.put(`/api/v1/cntr/geoRepartitions/${data.id}`, data);

                dispatch(getGeoRepartitions());
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

export function newGeoRepartition(data) {
    return async (dispatch, getState) => {

        const token = await authHelper();
        if(token) {
            try {
                const config = { responseType: 'json'};
                axios.defaults.headers.common['Authorization'] = localStorage.getItem(tokenName);
                await axios.post('/api/v1/cntr/geoRepartitions', data, config);

                    dispatch(getGeoRepartitions());
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

