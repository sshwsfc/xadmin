import _ from 'lodash'
import i18next from 'i18next'
import XHR from 'i18next-xhr-backend'
import Cache from 'i18next-localstorage-cache'
import LanguageDetector from 'i18next-browser-languagedetector'

import zh_Hans from './zh_Hans/translation.json'

const locales = {
  zh_Hans: {
    translation: zh_Hans
  }
}

export default {
  name: 'xadmin.i18n',
  context: (app) => (context, cb) => {
    const resources = app.load_dict_list('locales')
    for(let ln in resources) {
      resources[ln] = _.merge({}, ...resources[ln])
    }
    i18next
      .use(XHR) // or any other backend implementation
      .use(Cache) // or any other cache implementation
      .use(LanguageDetector) // or any other implementation
      .init({
        debug: true,
        lng: 'zh_Hans',
        fallbackLng: false,
        keySeparator: false,
        nsSeparator: false,
        resources
      }, (err, t) => {
        cb(null, { ...context, _t: t })
      })
  },
  locales
}
