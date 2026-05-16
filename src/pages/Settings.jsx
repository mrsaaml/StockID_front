import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { CheckCircle2, Loader2, User, Bell, Shield } from 'lucide-react'
import { REGIONS } from '../utils/constants'
import { useTranslation } from '../hooks/useI18n'
import LanguageSwitcher from '../components/ui/LanguageSwitcher'

export default function Settings() {
  const { t } = useTranslation()
  const { user, login } = useAuth()
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    region: user?.region || '',
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async e => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const updated = { ...user, ...form }
    localStorage.setItem('agroid_user', JSON.stringify(updated))
    login(updated)
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-7">
        <h1 className="section-title">{t('settings.title')}</h1>
        <p className="section-subtitle">{t('settings.subtitle')}</p>
      </div>

      {/* Profile */}
      <div className="card p-6 mb-5">
        <div className="flex items-center gap-2.5 mb-5">
          <User size={17} className="text-agro-700" />
          <h2 className="font-display font-semibold text-slate-900">{t('settings.profile')}</h2>
        </div>
        <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">{t('settings.firstName')}</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} className="form-input" />
          </div>
          <div>
            <label className="form-label">{t('settings.lastName')}</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} className="form-input" />
          </div>
          <div>
            <label className="form-label">{t('settings.email')}</label>
            <input name="email" value={form.email} onChange={handleChange} className="form-input" type="email" />
          </div>
          <div>
            <label className="form-label">{t('settings.phone')}</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+996 700 000 000" />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">{t('settings.region')}</label>
            <select name="region" value={form.region} onChange={handleChange} className="form-select">
              <option value="">—</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
              {loading ? <Loader2 size={15} className="animate-spin" /> : null}
              {loading ? t('settings.saving') : t('settings.save')}
            </button>
            {saved && (
              <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                <CheckCircle2 size={15} /> {t('settings.saved')}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Notifications */}
      <div className="card p-6 mb-5">
        <div className="flex items-center gap-2.5 mb-5">
          <Bell size={17} className="text-agro-700" />
          <h2 className="font-display font-semibold text-slate-900">{t('settings.notifications')}</h2>
        </div>
        <div className="flex flex-col gap-4">
          {[
            t('settings.emailNotif'),
            t('settings.fraudAlerts'),
            t('settings.weeklyReport'),
          ].map((label, i) => (
            <label key={i} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate-700">{label}</span>
              <div className="w-10 h-5 bg-agro-600 rounded-full relative">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="card p-6 mb-5">
        <div className="flex items-center gap-2.5 mb-5">
          <Shield size={17} className="text-agro-700" />
          <h2 className="font-display font-semibold text-slate-900">{t('settings.security')}</h2>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-700">{t('settings.changePassword')}</span>
            <button className="btn-secondary text-xs py-1.5 px-3">{t('common.edit')}</button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-slate-100">
            <span className="text-sm text-slate-700">{t('settings.twoFactor')}</span>
            <span className="text-xs text-slate-400 px-2 py-1 bg-slate-100 rounded-full">{t('settings.comingSoon')}</span>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="card p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <h2 className="font-display font-semibold text-slate-900">{t('settings.language')}</h2>
        </div>
        <p className="text-sm text-slate-500 mb-4">{t('settings.chooseLanguage')}</p>
        <LanguageSwitcher />
      </div>
    </div>
  )
}
