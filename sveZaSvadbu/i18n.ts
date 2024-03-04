import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import sr from './locales/sr.json'

const resources = {
  // 2 json objekta, jedan za engleski, drugi za srpski jezik
  // ruta: locales/en || locales/sr
  en: en,
  sr: sr,
}

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
