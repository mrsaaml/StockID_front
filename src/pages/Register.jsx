import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Loader2, Building2, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { REGIONS } from '../utils/constants'
import { useTranslation } from '../hooks/useI18n'

export default function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register } = useAuth()
  const [role, setRole] = useState('farmer')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    firstName: '', lastName: '', companyName: '',
    region: '', phone: '', email: '', password: '', confirmPassword: ''
  })

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError(t('auth.passwordMismatch'))
      return
    }
    if (form.password.length < 6) {
      setError(t('auth.passwordTooShort'))
      return
    }
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 500))
      await register({ ...form, role })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const ROLE_OPTIONS = [
    { value: 'farmer', label: t('auth.roleFarmer'), icon: User, desc: t('auth.roleFarmerDesc') },
    { value: 'insurance', label: t('auth.roleInsurance'), icon: Building2, desc: t('auth.roleInsuranceDesc') },
  ]

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-slate-900 mb-1">{t('auth.registerTitle')}</h1>
      <p className="text-slate-500 text-sm mb-6">{t('auth.registerSubtitle')}</p>

      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {ROLE_OPTIONS.map(opt => {
          const Icon = opt.icon
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRole(opt.value)}
              className={`flex flex-col items-start gap-1 p-3.5 rounded-xl border-2 text-left transition-all ${
                role === opt.value ? 'border-agro-600 bg-agro-50' : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={15} className={role === opt.value ? 'text-agro-700' : 'text-slate-500'} />
                <span className={`text-xs font-semibold ${role === opt.value ? 'text-agro-700' : 'text-slate-700'}`}>
                  {opt.label}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 leading-tight">{opt.desc}</span>
            </button>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">{t('auth.firstName')}</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} className="form-input" placeholder="Aziz" required />
          </div>
          <div>
            <label className="form-label">{t('auth.lastName')}</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} className="form-input" placeholder="Mamytbekov" required />
          </div>
        </div>

        {role === 'insurance' && (
          <div>
            <label className="form-label">{t('auth.companyName')}</label>
            <input name="companyName" value={form.companyName} onChange={handleChange} className="form-input" placeholder="KyrgyzAgroInsure" required={role === 'insurance'} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">{t('auth.region')}</label>
            <select name="region" value={form.region} onChange={handleChange} className="form-select" required>
              <option value="">{t('auth.selectRegion')}</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">{t('auth.phone')}</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+996 700 000 000" type="tel" />
          </div>
        </div>

        <div>
          <label className="form-label">{t('auth.email')}</label>
          <input name="email" value={form.email} onChange={handleChange} className="form-input" placeholder="your@email.com" type="email" required />
        </div>

        <div>
          <label className="form-label">{t('auth.password')}</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-input pr-10"
              placeholder={t('auth.passwordMin')}
              required
            />
            <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="form-label">{t('auth.confirmPassword')}</label>
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="form-input" placeholder={t('auth.repeatPassword')} required />
        </div>

        {error && (
          <div className="flex items-start gap-2.5 px-3.5 py-3 bg-red-50 border border-red-100 rounded-lg">
            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary justify-center py-3 mt-1 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {loading ? t('auth.creating') : t('auth.registerTitle')}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-5">
        {t('auth.alreadyAccount')}{' '}
        <Link to="/login" className="text-agro-700 font-medium hover:underline">{t('auth.signInLink')}</Link>
      </p>
    </div>
  )
}
