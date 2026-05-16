import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import { useTranslation } from '../hooks/useI18n'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await new Promise(r => setTimeout(r, 350))
      const user = authService.login(form.email, form.password)
      if (!user) {
        setError(t('auth.invalidCredentials'))
        return
      }
      login(user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Demo accounts — always work, uses fixed credentials in authService
  const demoAccounts = [
    { label: 'Admin', email: 'admin@stockid.kg', password: 'admin123' },
    { label: 'Фермер', email: 'farmer@stockid.kg', password: 'farmer123' },
    { label: 'Страховщик', email: 'insurance@stockid.kg', password: 'insurance123' },
  ]

  return (
    <div>
      <h1 className="text-[22px] font-display font-bold text-slate-900 mb-1">{t('auth.loginTitle')}</h1>
      <p className="text-slate-500 text-sm mb-7">{t('auth.loginSubtitle')}</p>

      {/* Demo accounts */}
      <div className="mb-5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <p className="text-slate-500 text-xs font-medium mb-2">{t('auth.demoAccounts')}</p>
        <div className="flex flex-wrap gap-1.5">
          {demoAccounts.map(acc => (
            <button
              key={acc.label}
              type="button"
              onClick={() => { setForm({ email: acc.email, password: acc.password }); setError('') }}
              className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:border-agro-300 hover:text-agro-700 transition-colors"
            >
              {acc.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="form-label">{t('auth.email')}</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-input"
            placeholder="your@email.com"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="form-label mb-0">{t('auth.password')}</label>
            <a href="#" className="text-xs text-slate-500 hover:text-agro-700 font-medium transition-colors">{t('auth.forgotPassword')}</a>
          </div>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-input pr-10"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPass(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg">
            <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary justify-center py-3 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : null}
          {loading ? t('auth.signingIn') : t('auth.signIn')}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        {t('auth.noAccount')}{' '}
        <Link to="/register" className="text-agro-700 font-medium hover:underline">{t('auth.createAccount')}</Link>
      </p>
    </div>
  )
}
