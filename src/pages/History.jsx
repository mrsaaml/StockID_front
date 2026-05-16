import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Search, Loader2, ScanFace } from 'lucide-react'
import { verifyService } from '../services/verifyService'
import { useTranslation } from '../hooks/useI18n'
import { formatDateTime } from '../utils/helpers'
import { VERIFICATION_THRESHOLD } from '../utils/constants'

export default function History() {
  const { t } = useTranslation()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    verifyService.getHistory()
      .then(data => setHistory(Array.isArray(data) ? data : []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = history.filter(h =>
    !search || (h.cow_name || h.name || '').toLowerCase().includes(search.toLowerCase())
  )

  const verified = history.filter(h => (h.similarity ?? 0) >= VERIFICATION_THRESHOLD).length

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-7">
        <h1 className="section-title">{t('history.title')}</h1>
        <p className="section-subtitle">{t('history.subtitle')}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: t('history.total'), value: history.length, color: 'text-slate-900' },
          { label: t('history.successful'), value: verified, color: 'text-emerald-600' },
          { label: t('history.failed'), value: history.length - verified, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <div className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('history.searchPlaceholder')} className="form-input pl-9 py-2" />
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2">
            <Loader2 size={22} className="animate-spin text-agro-600" />
            <span className="text-slate-500 text-sm">{t('history.loading')}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
              <ScanFace size={22} className="text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-slate-600 font-medium">{search ? t('history.noSearchResults') : t('history.noHistory')}</p>
              <p className="text-slate-400 text-sm mt-1">{!search && t('history.noHistoryDesc')}</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('history.animal')}</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">{t('history.result')}</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">{t('history.score')}</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">{t('history.date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((h, i) => {
                  const similarity = h.similarity ?? h.confidence ?? 0
                  const isVerified = h.match === true || similarity >= VERIFICATION_THRESHOLD
                  return (
                    <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-row-hover">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isVerified ? 'bg-emerald-50' : 'bg-red-50'}`}>
                            {isVerified
                              ? <CheckCircle2 size={16} className="text-emerald-600" />
                              : <XCircle size={16} className="text-red-500" />
                            }
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">{h.cow_name || h.name || '—'}</div>
                            <div className="text-xs text-slate-400 font-mono">ID: {h.cow_id || h.id || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        {isVerified
                          ? <span className="badge-verified">{t('history.verified')}</span>
                          : <span className="badge-failed">{t('history.notVerified')}</span>
                        }
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${similarity >= 0.7 ? 'bg-emerald-500' : similarity >= 0.5 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.round(similarity * 100)}%` }}
                            />
                          </div>
                          <span className="text-sm text-slate-600 font-mono">{Math.round(similarity * 100)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-sm text-slate-500">{formatDateTime(h.verified_at || h.createdAt)}</span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
