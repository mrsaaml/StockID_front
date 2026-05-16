import React from 'react'
import { Shield, CheckCircle2, Beef, Lock, FileCheck, Building2 } from 'lucide-react'
import { useTranslation } from '../../hooks/useI18n'
import { formatDate } from '../../utils/helpers'
import StockIDLogo from '../ui/StockIDLogo'

export default function LivestockPassport({ animal }) {
  const { t } = useTranslation()
  if (!animal) return null
  const isVerified = animal.status === 'verified' || animal.verified || true

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-elevated max-w-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-agro-800 to-agro-700 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <StockIDLogo size={32} dark />
          <div>
            <div className="text-white font-display font-bold text-[15px]">
              Stock<span className="text-agro-300">ID</span>
            </div>
            <div className="text-agro-300 text-[10px] uppercase tracking-widest font-medium">{t('passport.title')}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-agro-300 text-[10px]">{t('passport.kyrgyzRepublic')}</div>
          <div className="text-agro-200 text-[10px] mt-0.5">{t('passport.ministry')}</div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex gap-4 mb-5">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border-2 border-amber-200 overflow-hidden flex items-center justify-center">
              {animal.imageUrl ? (
                <img src={animal.imageUrl} alt={animal.name} className="w-full h-full object-cover" />
              ) : (
                <Beef size={34} className="text-amber-600" />
              )}
            </div>
            <div className={`mt-2 text-center text-xs font-semibold py-1 rounded-lg ${
              isVerified ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}>
              {isVerified ? t('passport.verified') : t('passport.pending')}
            </div>
          </div>

          {/* Core info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-display font-bold text-slate-900 mb-1.5">{animal.name || '—'}</h2>
            <div className="font-mono text-xs text-slate-400 mb-3 flex items-center gap-1">
              <Lock size={10} />
              {animal.biometricId || `KG-STK-${animal.id}`}
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
              {[
                [t('passport.breed'), animal.breed || '—'],
                [t('passport.birthYear'), animal.birthYear || '—'],
                [t('passport.age'), animal.age ? `${animal.age} ${t('passport.years')}` : '—'],
                [t('passport.region'), animal.region || '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{k}</div>
                  <div className="text-sm text-slate-800 font-medium">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-1.5 mb-1.5">
              <FileCheck size={12} className="text-agro-600" />
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{t('passport.owner')}</span>
            </div>
            <div className="text-sm font-medium text-slate-800 truncate">{animal.ownerName || t('passport.notSpecified')}</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Building2 size={12} className="text-agro-600" />
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{t('passport.insurance')}</span>
            </div>
            <div className="text-sm font-medium text-slate-800 truncate">{animal.insuranceCompany || t('passport.notInsured')}</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Shield size={12} className="text-agro-600" />
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{t('passport.vaccination')}</span>
            </div>
            <div className="text-sm font-medium text-slate-800 truncate">{animal.vaccinationStatus || '—'}</div>
          </div>
        </div>

        {/* Biometric ID */}
        <div className="bg-agro-50 border border-agro-100 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-agro-600" />
            <div>
              <div className="text-[10px] text-agro-600 font-semibold">{t('passport.biometricId')}</div>
              <div className="font-mono text-agro-800 text-sm font-bold tracking-wider">
                {animal.biometricId || `KG-STK-${animal.id}`}
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-agro-600">
            <div className="font-semibold text-[10px]">{t('passport.registeredAt')}</div>
            <div>{formatDate(animal.registeredAt || animal.created_at)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
