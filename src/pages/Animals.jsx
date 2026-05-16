import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus, Trash2, Eye, Filter, Beef, Loader2, AlertTriangle } from 'lucide-react'
import { cowService } from '../services/cowService'
import { useTranslation } from '../hooks/useI18n'
import { formatDate } from '../utils/helpers'

export default function Animals() {
  const { t } = useTranslation()
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')

  const fetchAnimals = async () => {
    setLoading(true)
    try {
      const data = await cowService.getAll()
      setAnimals(Array.isArray(data) ? data : [])
    } catch (_) { setAnimals([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAnimals() }, [])

  const handleDelete = async (id) => {
    if (!confirm(t('animals.deleteConfirm'))) return
    setDeleting(id)
    try {
      await cowService.delete(id)
      setAnimals(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      setError(t('animals.deleteError') + err.message)
    } finally { setDeleting(null) }
  }

  const filtered = animals.filter(a =>
    !search || (a.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.breed || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="section-title">{t('animals.title')}</h1>
          <p className="section-subtitle">{animals.length > 0 ? t('animals.subtitle', { count: animals.length }) : t('animals.subtitle_zero')}</p>
        </div>
        <Link to="/register-animal" className="btn-primary">
          <Plus size={15} /> {t('animals.register')}
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('animals.searchPlaceholder')} className="form-input pl-9 py-2" />
        </div>
        <button className="btn-secondary py-2 gap-1.5">
          <Filter size={14} /> {t('animals.filter')}
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
          <AlertTriangle size={15} />{error}
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={28} className="animate-spin text-agro-600" />
            <p className="text-slate-500 text-sm">{t('animals.loading')}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
              <Beef size={26} className="text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-slate-600 font-medium">{search ? t('animals.noSearchResults') : t('animals.noAnimals')}</p>
              <p className="text-slate-400 text-sm mt-1">{search ? t('animals.noSearchResultsDesc') : t('animals.noAnimalsDesc')}</p>
            </div>
            {!search && (
              <Link to="/register-animal" className="btn-primary mt-2">
                <Plus size={15} /> {t('animals.register')}
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('animals.animal')}</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">{t('animals.breed')}</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">{t('animals.status')}</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">{t('animals.registered')}</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('animals.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(animal => (
                  <motion.tr key={animal.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-row-hover">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-100">
                          <Beef size={18} className="text-amber-600" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 text-sm">{animal.name}</div>
                          <div className="text-xs text-slate-400 font-mono">ID: {animal.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-sm text-slate-600">{animal.breed || '—'}</span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      {animal.verified || animal.status === 'verified'
                        ? <span className="badge-verified">{t('status.verified')}</span>
                        : <span className="badge-pending">{t('status.pending')}</span>
                      }
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm text-slate-500">{formatDate(animal.created_at || animal.createdAt)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/animals/${animal.id}`} className="p-2 text-slate-400 hover:text-agro-700 hover:bg-agro-50 rounded-lg transition-colors">
                          <Eye size={15} />
                        </Link>
                        <button onClick={() => handleDelete(animal.id)} disabled={deleting === animal.id} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                          {deleting === animal.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                        </button>
                      </div>
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
