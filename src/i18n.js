// Minimal i18n implementation — compatible with react-i18next API
// No external dependencies required

import ruTranslations from './locales/ru.json'
import enTranslations from './locales/en.json'

const resources = { ru: ruTranslations, en: enTranslations }

function getNestedValue(obj, path, params) {
  const keys = path.split('.')
  let val = obj
  for (const k of keys) {
    if (val == null) return path
    val = val[k]
  }
  if (val == null) return path
  if (typeof val === 'string' && params) {
    return val.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] ?? _)
  }
  return val
}

// Detect saved or browser language
function detectLanguage() {
  const saved = localStorage.getItem('stockid_lang')
  if (saved && (saved.startsWith('ru') || saved.startsWith('en'))) return saved.startsWith('en') ? 'en' : 'ru'
  const browser = navigator.language || 'ru'
  return browser.startsWith('en') ? 'en' : 'ru'
}

let currentLang = detectLanguage()
const listeners = new Set()

export const i18n = {
  get language() { return currentLang },
  changeLanguage(lang) {
    currentLang = lang
    localStorage.setItem('stockid_lang', lang)
    listeners.forEach(fn => fn(lang))
  },
  t(key, opts) {
    const dict = resources[currentLang] || resources.ru
    const val = getNestedValue(dict, key, opts)
    if (opts?.returnObjects && typeof val === 'object') return val
    return typeof val === 'string' ? val : key
  },
  on(_event, fn) { listeners.add(fn) },
  off(_event, fn) { listeners.delete(fn) },
}

export default i18n
