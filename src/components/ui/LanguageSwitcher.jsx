import React from 'react'
import { useTranslation } from '../../hooks/useI18n'

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'ru'

  const toggle = () => {
    const next = lang === 'ru' ? 'en' : 'ru'
    i18n.changeLanguage(next)
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all hover:border-slate-300 ${className}`}
      title="Switch language"
    >
      <span className={`transition-opacity ${lang === 'ru' ? 'opacity-100' : 'opacity-40'}`}>RU</span>
      <span className="text-slate-300 font-normal">/</span>
      <span className={`transition-opacity ${lang === 'en' ? 'opacity-100' : 'opacity-40'}`}>EN</span>
    </button>
  )
}
