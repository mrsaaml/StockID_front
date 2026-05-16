import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, CheckCircle2, Loader2, AlertCircle, FileText, Beef } from 'lucide-react'
import { useTranslation } from '../hooks/useI18n'
import { cowService } from '../services/cowService'
import { REGIONS, BREEDS, INSURANCE_COMPANIES, VACCINATION_STATUSES } from '../utils/constants'
import { formatFileSize, generateBiometricId, formatDateTime } from '../utils/helpers'
import LivestockPassport from '../components/verification/LivestockPassport'

const INITIAL_FORM = {
  name: '', breed: '', age: '', birthYear: '',
  region: '', ownerName: '', insuranceCompany: '',
  vaccinationStatus: '', notes: ''
}

export default function RegisterAnimal() {
  const { t } = useTranslation()
  const [form, setForm] = useState(INITIAL_FORM)
  const [files, setFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const fileInputRef = useRef()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const addFiles = useCallback((newFiles) => {
    const valid = Array.from(newFiles).filter(f => f.type.startsWith('image/')).slice(0, 3)
    setFiles(prev => [...prev, ...valid].slice(0, 3))
  }, [])

  const onDrop = e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }
  const removeFile = idx => setFiles(prev => prev.filter((_, i) => i !== idx))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name) { setError(t('registerAnimal.errorName')); return }
    if (files.length === 0) { setError(t('registerAnimal.errorPhoto')); return }
    setLoading(true); setError('')
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      if (form.breed) formData.append('breed', form.breed)
      if (form.age) formData.append('age', form.age)
      if (form.birthYear) formData.append('birth_year', form.birthYear)
      if (form.region) formData.append('region', form.region)
      if (form.vaccinationStatus) formData.append('vaccination_status', form.vaccinationStatus)
      if (form.ownerName) formData.append('owner_name', form.ownerName)
      if (form.insuranceCompany) formData.append('insurance_company', form.insuranceCompany)
      if (form.notes) formData.append('notes', form.notes)
      files.forEach(f => formData.append('files', f))
      const data = await cowService.register(formData)
      setResult({
        ...data, ...form,
        biometricId: data.id ? `KG-STK-${data.id}` : generateBiometricId(),
        registeredAt: new Date().toISOString(),
        imageUrl: files[0] ? URL.createObjectURL(files[0]) : null,
      })
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  if (result) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={22} className="text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-slate-900">{t('registerAnimal.successTitle')}</h1>
              <p className="text-sm text-slate-500">{t('registerAnimal.successSubtitle')}</p>
            </div>
          </div>
          <LivestockPassport animal={result} />
          <div className="mt-6 flex gap-3">
            <button onClick={() => { setResult(null); setForm(INITIAL_FORM); setFiles([]) }} className="btn-secondary">
              {t('registerAnimal.registerAnother')}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-7">
        <h1 className="section-title">{t('registerAnimal.title')}</h1>
        <p className="section-subtitle">{t('registerAnimal.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Animal Info */}
            <div className="card p-6">
              <h2 className="font-display font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Beef size={18} className="text-agro-700" />
                {t('registerAnimal.animalInfo')}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">{t('registerAnimal.nameLabel')}</label>
                  <input name="name" value={form.name} onChange={handleChange} className="form-input" placeholder={t('registerAnimal.namePlaceholder')} required />
                </div>
                <div>
                  <label className="form-label">{t('registerAnimal.breedLabel')}</label>
                  <select name="breed" value={form.breed} onChange={handleChange} className="form-select">
                    <option value="">{t('registerAnimal.selectBreed')}</option>
                    {BREEDS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">{t('registerAnimal.ageLabel')}</label>
                  <input name="age" value={form.age} onChange={handleChange} className="form-input" type="number" min="0" max="30" placeholder="4" />
                </div>
                <div>
                  <label className="form-label">{t('registerAnimal.birthYearLabel')}</label>
                  <input name="birthYear" value={form.birthYear} onChange={handleChange} className="form-input" type="number" min="2000" max="2025" placeholder="2020" />
                </div>
                <div>
                  <label className="form-label">{t('registerAnimal.regionLabel')}</label>
                  <select name="region" value={form.region} onChange={handleChange} className="form-select">
                    <option value="">{t('auth.selectRegion')}</option>
                    {REGIONS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">{t('registerAnimal.vaccinationLabel')}</label>
                  <select name="vaccinationStatus" value={form.vaccinationStatus} onChange={handleChange} className="form-select">
                    <option value="">{t('registerAnimal.selectVaccination')}</option>
                    {VACCINATION_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Owner & Insurance */}
            <div className="card p-6">
              <h2 className="font-display font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-agro-700" />
                {t('registerAnimal.ownerInsurance')}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">{t('registerAnimal.ownerLabel')}</label>
                  <input name="ownerName" value={form.ownerName} onChange={handleChange} className="form-input" placeholder={t('registerAnimal.ownerPlaceholder')} />
                </div>
                <div>
                  <label className="form-label">{t('registerAnimal.insuranceLabel')}</label>
                  <select name="insuranceCompany" value={form.insuranceCompany} onChange={handleChange} className="form-select">
                    <option value="">{t('registerAnimal.insuranceNone')}</option>
                    {INSURANCE_COMPANIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">{t('registerAnimal.notesLabel')}</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} className="form-input resize-none" rows={3} placeholder={t('registerAnimal.notesPlaceholder')} />
                </div>
              </div>
            </div>
          </div>

          {/* Right — upload */}
          <div className="flex flex-col gap-5">
            <div className="card p-5">
              <h2 className="font-display font-semibold text-slate-900 mb-1 text-sm">{t('registerAnimal.photos')}</h2>
              <p className="text-xs text-slate-500 mb-4">{t('registerAnimal.photosDesc')}</p>

              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                  dragOver ? 'border-agro-400 bg-agro-50' : 'border-slate-200 hover:border-agro-300 hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Upload size={20} className={dragOver ? 'text-agro-600' : 'text-slate-400'} />
                </div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  {dragOver ? t('registerAnimal.dropHere') : t('registerAnimal.dropPhotos')}
                </p>
                <p className="text-xs text-slate-400">{t('registerAnimal.browseFiles')}</p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
              </div>

              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 flex flex-col gap-2 overflow-hidden">
                    {files.map((file, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-9 h-9 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-slate-800 truncate">{file.name}</div>
                          <div className="text-xs text-slate-400">{formatFileSize(file.size)}</div>
                        </div>
                        <button onClick={() => removeFile(i)} className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"><X size={15} /></button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-4 p-3 bg-agro-50 rounded-xl border border-agro-100">
                <p className="text-xs text-agro-700 font-medium mb-1">{t('registerAnimal.photoTips')}</p>
                <ul className="text-xs text-agro-600 flex flex-col gap-0.5">
                  <li>• {t('registerAnimal.tip1')}</li>
                  <li>• {t('registerAnimal.tip2')}</li>
                  <li>• {t('registerAnimal.tip3')}</li>
                </ul>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 px-3.5 py-3 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary justify-center py-3.5 disabled:opacity-60">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              {loading ? t('registerAnimal.submitting') : t('registerAnimal.submit')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
