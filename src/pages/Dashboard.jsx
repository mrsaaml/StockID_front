import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Beef, CheckCircle2, ScanFace, ArrowRight,
  Plus, MapPin, Calendar, FileCheck
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../hooks/useI18n'
import { cowService } from '../services/cowService'
import { verifyService } from '../services/verifyService'
import { formatDateTime } from '../utils/helpers'

const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }
const stagger = { visible: { transition: { staggerChildren: 0.06 } } }

function OnboardingStep({ num, title, desc, href, done }) {
  return (
    <Link to={href} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-agro-200 hover:bg-agro-50/30 transition-all group">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 ${
        done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500 group-hover:bg-agro-100 group-hover:text-agro-700'
      }`}>
        {done ? <CheckCircle2 size={14} /> : num}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-semibold ${done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{title}</div>
        <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
      </div>
      {!done && <ArrowRight size={14} className="text-slate-300 group-hover:text-agro-500 mt-1 flex-shrink-0 transition-colors" />}
    </Link>
  )
}

export default function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [animals, setAnimals] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [animalsData, historyData] = await Promise.allSettled([
          cowService.getAll(),
          verifyService.getHistory(),
        ])
        if (animalsData.status === 'fulfilled') setAnimals(Array.isArray(animalsData.value) ? animalsData.value : [])
        if (historyData.status === 'fulfilled') setHistory(Array.isArray(historyData.value) ? historyData.value : [])
      } catch (_) {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  const verified = animals.filter(a => a.verified || a.status === 'verified')
  const hasAnimals = animals.length > 0
  const hasVerifications = history.length > 0

  const hour = new Date().getHours()
  const greeting = hour < 12 ? t('dashboard.morning') : hour < 18 ? t('dashboard.afternoon') : t('dashboard.evening')

  const recentActivity = [
    ...animals.slice(-4).map(a => ({
      type: 'register',
      label: t('dashboard.animalRegistered'),
      sub: a.name || `ID: ${a.id}`,
      time: a.created_at || a.createdAt,
      icon: Beef,
      color: 'text-agro-600',
      bg: 'bg-agro-50'
    })),
    ...history.slice(-4).map(h => ({
      type: 'verify',
      label: (h.match === true || (h.similarity ?? 0) >= 0.7) ? t('dashboard.verificationPassed') : t('dashboard.verificationFailed'),
      sub: h.cow_name || h.name || t('dashboard.unknownAnimal'),
      time: h.verified_at || h.createdAt,
      icon: ScanFace,
      color: (h.match === true || (h.similarity ?? 0) >= 0.7) ? 'text-emerald-600' : 'text-red-500',
      bg: (h.match === true || (h.similarity ?? 0) >= 0.7) ? 'bg-emerald-50' : 'bg-red-50',
    })),
  ].sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0)).slice(0, 6)

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[22px] font-display font-bold text-slate-900">
          {greeting}{user?.firstName ? `, ${user.firstName}` : ''}
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">{t('dashboard.subtitle')}</p>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <Link
          to="/register-animal"
          className="flex items-center gap-3.5 p-4 bg-agro-700 text-white rounded-xl hover:bg-agro-800 transition-colors group"
        >
          <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
            <Plus size={18} />
          </div>
          <div>
            <div className="font-semibold text-sm">{t('dashboard.registerAnimal')}</div>
            <div className="text-agro-200 text-xs">{t('dashboard.registerAnimalDesc')}</div>
          </div>
        </Link>
        <Link
          to="/verify"
          className="flex items-center gap-3.5 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors group"
        >
          <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-agro-50 transition-colors">
            <ScanFace size={18} className="text-slate-600 group-hover:text-agro-700 transition-colors" />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-900">{t('dashboard.verifyAnimal')}</div>
            <div className="text-slate-500 text-xs">{t('dashboard.verifyAnimalDesc')}</div>
          </div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Onboarding (shown when no animals) */}
          {!loading && !hasAnimals && (
            <div className="card p-5">
              <div className="mb-4">
                <h2 className="font-display font-semibold text-slate-900 text-[15px]">{t('dashboard.onboarding_title')}</h2>
                <p className="text-slate-500 text-xs mt-0.5">{t('dashboard.onboarding_subtitle')}</p>
              </div>
              <div className="flex flex-col gap-2">
                <OnboardingStep num="1" href="/register-animal" title={t('dashboard.step_add')} desc={t('dashboard.step_add_desc')} done={hasAnimals} />
                <OnboardingStep num="2" href="/verify" title={t('dashboard.step_verify')} desc={t('dashboard.step_verify_desc')} done={hasVerifications} />
                <OnboardingStep num="3" href="/settings" title={t('dashboard.step_insure')} desc={t('dashboard.step_insure_desc')} done={false} />
              </div>
            </div>
          )}

          {/* Activity feed */}
          {(hasAnimals || hasVerifications || loading) && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display font-semibold text-slate-900 text-[15px]">{t('dashboard.recentActivity')}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{t('dashboard.recentActivityDesc')}</p>
                </div>
                <Link to="/history" className="text-xs text-agro-600 hover:text-agro-800 font-medium flex items-center gap-1 transition-colors">
                  {t('dashboard.viewAll')} <ArrowRight size={11} />
                </Link>
              </div>

              {loading ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg animate-pulse flex-shrink-0" />
                      <div className="flex-1">
                        <div className="h-3 bg-slate-100 rounded animate-pulse w-40 mb-1.5" />
                        <div className="h-2.5 bg-slate-100 rounded animate-pulse w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-slate-400 text-sm">{t('dashboard.noActivity')}</p>
                  <Link to="/register-animal" className="text-agro-600 text-sm font-medium hover:underline mt-1 inline-block">
                    {t('dashboard.registerFirst')}
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-slate-50">
                  {recentActivity.map((item, i) => {
                    const Icon = item.icon
                    return (
                      <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                        <div className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon size={15} className={item.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-800">{item.label}</div>
                          <div className="text-xs text-slate-400 truncate">{item.sub}</div>
                        </div>
                        <div className="text-xs text-slate-400 flex-shrink-0 tabular-nums">
                          {formatDateTime(item.time)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Animals summary (if any) */}
          {!loading && hasAnimals && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-slate-900 text-[15px]">{t('dashboard.totalAnimals')}</h2>
                <Link to="/animals" className="text-xs text-agro-600 hover:text-agro-800 font-medium transition-colors">{t('dashboard.viewAll')}</Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xl font-display font-bold text-slate-900">{animals.length}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{t('dashboard.totalAnimals')}</div>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-xl font-display font-bold text-emerald-700">{verified.length}</div>
                  <div className="text-xs text-emerald-600 mt-0.5">{t('dashboard.verifiedAnimals')}</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xl font-display font-bold text-slate-900">{history.length}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{t('dashboard.verifications')}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">
          {/* Account info */}
          <div className="card p-5">
            <h2 className="font-display font-semibold text-slate-900 text-[15px] mb-4">{t('dashboard.account')}</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-agro-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-agro-700 font-semibold text-xs">
                    {(user?.firstName || '')[0]}{(user?.lastName || '')[0]}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <FileCheck size={12} className="text-slate-400 flex-shrink-0" />
                  <span className="text-slate-500 capitalize">{t('dashboard.role')}: </span>
                  <span className="text-slate-800 font-medium capitalize">{user?.role}</span>
                </div>
                {user?.region && (
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500">{t('dashboard.regionLabel')}: </span>
                    <span className="text-slate-800 font-medium">{user.region}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs">
                  <Calendar size={12} className="text-slate-400 flex-shrink-0" />
                  <span className="text-slate-500">{t('dashboard.memberSince')} </span>
                  <span className="text-slate-800 font-medium">
                    {new Date(user?.createdAt || Date.now()).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Onboarding checklist (sidebar version when has animals) */}
          {!loading && hasAnimals && !hasVerifications && (
            <div className="card p-5">
              <h2 className="font-display font-semibold text-slate-900 text-[15px] mb-3">{t('dashboard.onboarding_title')}</h2>
              <div className="flex flex-col gap-2">
                <OnboardingStep num="1" href="/register-animal" title={t('dashboard.step_add')} desc="" done={true} />
                <OnboardingStep num="2" href="/verify" title={t('dashboard.step_verify')} desc={t('dashboard.step_verify_desc')} done={false} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
