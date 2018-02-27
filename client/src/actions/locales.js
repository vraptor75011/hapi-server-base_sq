import {UPDATE_LOCALES} from './types';

import itLocaleData from 'react-intl/locale-data/it'


export function locales() {

    return {
        type: UPDATE_LOCALES,
        payload: itLocaleData
    }
}

