import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { i18n } from '../i18n'

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(i18n.language)

  useEffect(() => {
    const handler = (l) => setLang(l)
    i18n.on('languageChanged', handler)
    return () => i18n.off('languageChanged', handler)
  }, [])

  const t = useCallback((key, opts) => i18n.t(key, opts), [lang])

  return (
    <I18nContext.Provider value={{ t, i18n, lang }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    // Fallback if used outside provider
    return { t: (key, opts) => i18n.t(key, opts), i18n }
  }
  return { t: ctx.t, i18n: ctx.i18n }
}
