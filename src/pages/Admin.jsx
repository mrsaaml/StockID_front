import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Building2, Beef, Loader2, ShieldCheck } from 'lucide-react'
import { useTranslation } from '../hooks/useI18n'
import { formatDate } from '../utils/helpers'

export default function Admin() {
  const { t } = useTranslation()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      const stored = JSON.parse(localStorage.getItem('agroid_users') || '[]')
      setUsers(stored)
      setLoading(false)
    }, 300)
  }, [])

  const farmers = users.filter(u => u.role === 'farmer').length
  const insurers = users.filter(u => u.role === 'insurance').length

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-7">
        <div className="flex items-center gap-2.5 mb-1">
          <ShieldCheck size={20} className="text-agro-700" />
          <h1 className="section-title">{t('admin.title')}</h1>
        </div>
        <p className="section-subtitle">{t('admin.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: t('admin.totalUsers'), value: users.length, color: 'text-agro-700', bg: 'bg-agro-50', border: 'border-agro-100' },
          { icon: Users, label: t('admin.farmers'), value: farmers, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { icon: Building2, label: t('admin.insurers'), value: insurers, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' },
          { icon: Beef, label: t('admin.totalAnimals'), value: '—', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
        ].map((s, i) => (
          <div key={i} className="card p-5">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center border ${s.border} mb-3`}>
              <s.icon size={18} className={s.color} />
            </div>
            <div className="text-2xl font-display font-bold text-slate-900">{s.value}</div>
            <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-display font-semibold text-slate-900">{t('admin.users')}</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2">
            <Loader2 size={20} className="animate-spin text-agro-600" />
            <span className="text-slate-500 text-sm">{t('admin.loading')}</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">{t('admin.noUsers')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('admin.name')}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">{t('admin.email')}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">{t('admin.role')}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">{t('admin.region')}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">{t('admin.registered')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u, i) => (
                  <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-row-hover">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-agro-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-agro-700 font-semibold text-xs">
                            {(u.firstName || '')[0]}{(u.lastName || '')[0]}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-slate-900">{u.firstName} {u.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-sm text-slate-600">{u.email}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        u.role === 'admin' ? 'bg-purple-50 text-purple-700' :
                        u.role === 'insurance' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-sm text-slate-500">{u.region || '—'}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-sm text-slate-500">{formatDate(u.createdAt)}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
