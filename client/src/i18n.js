import i18n from 'i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
import Cache from 'i18next-localstorage-cache';
import Fetch from 'i18next-fetch-backend';

i18n
    .use(LanguageDetector)
    .use(Cache)
    .use(Fetch)
    .init({
        fallbackLng: 'en',
        ns: ['common','app'],
        defaultNS: 'common',
        preload: ['en'],
        wait: true,
        backend: {
            loadPath: 'http://localhost:8000/static/locales/{{lng}}/{{ns}}.json',
            addPath: 'http://localhost:8000/static/locales/{{lng}}/{{ns}}',
            parse: function (data) { console.log("DATA", data) },
            init: {
                mode: 'no-cors',
                credentials: 'include',
                cache: 'default'
            }
        },

        cache: {
            enabled: true,
            prefix: 'i18next_translations_',
            expirationTime: 24*60*60*1000 //one day
        },

        debug: true,

        detection: {
            order: ['localStorage', 'cookie'],
            lookupCookie: 'i18nextLng',
            lookupLocalStorage: 'i18nextLng',
            caches: ["localStorage"]
            //cookieMinutes: 10 // if we want the cookie to expire
        },

    });

export default i18n;
