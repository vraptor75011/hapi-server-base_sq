import i18n from 'i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
import Cache from 'i18next-localstorage-cache';
import Fetch from 'i18next-fetch-backend';
import {tokenName} from "./config";



i18n
    .use(Cache)
    .use(Fetch)
    .init({
        lng: 'it',
        fallbackLng: ['it'],
        ns: ['common','app'],
        defaultNS: 'common',
        preload: ['it'],
        wait: true,
        backend: {
            loadPath: '/api/static/locales/{{lng}}/{{ns}}.json',
            addPath: '/api/static/locales/{{lng}}/{{ns}}.json',
            init: {
                mode: 'no-cors',
                credentials: 'include',
                cache: 'default'
            }
        },

        cache: {
            enabled: false,
            prefix: 'i18next_translations_',
            expirationTime: 24*60*60*1000, //one day
            versions: { en: 'v1', it: 'v1.1' }
},

        debug: true,
        interpolation: {
            escapeValue: false, // not needed for react!!
        },

        detection: {
            order: ['localStorage', 'cookie'],
            lookupCookie: 'i18nextLng',
            lookupLocalStorage: 'i18nextLng',
            caches: ["localStorage"]
            //cookieMinutes: 10 // if we want the cookie to expire
        },
        react: {
            wait: true
        }

    });




export default i18n;
