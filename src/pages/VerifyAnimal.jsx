import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ScanFace, CheckCircle2, XCircle, AlertTriangle, Loader2, X, RefreshCw, Shield } from 'lucide-react'
import { useTranslation } from '../hooks/useI18n'
import { verifyService } from '../services/verifyService'
import { formatFileSize as fmtSize } from '../utils/helpers'

function ScanningAnimation({ image }) {
  const { t } = useTranslation()
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-sm mx-auto aspect-square bg-slate-900 rounded-2xl overflow-hidden"
    >
      {image && (
        <img src={URL.createObjectURL(image)} alt="Scanning" className="w-full h-full object-cover opacity-60" />
      )}
      <div className="absolute inset-0">
        {[
          'top-6 left-6 border-t-2 border-l-2 rounded-tl-lg',
          'top-6 right-6 border-t-2 border-r-2 rounded-tr-lg',
          'bottom-6 left-6 border-b-2 border-l-2 rounded-bl-lg',
          'bottom-6 right-6 border-b-2 border-r-2 rounded-br-lg',
        ].map((cls, i) => (
          <div key={i} className={`absolute w-6 h-6 border-agro-400 ${cls}`} />
        ))}
        <motion.div
          animate={{ top: ['10%', '90%', '10%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-x-6 h-0.5 bg-agro-400 shadow-[0_0_16px_4px_rgba(14,135,237,0.5)]"
          style={{ position: 'absolute' }}
        />
        <div className="absolute inset-6 border border-agro-500/20 grid grid-cols-3 grid-rows-3">
          {Array(9).fill(0).map((_, i) => (
            <div key={i} className="border border-agro-500/10" />
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-agro-400 rounded-full animate-pulse" />
          <span className="text-agro-300 text-xs font-mono uppercase tracking-wider">{t('verify.scanning')}</span>
        </div>
      </div>
      <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-center">
        <span className="text-agro-300 text-xs font-mono">StockID·AI</span>
        <span className="text-white text-xs font-mono">LIVE</span>
      </div>
    </motion.div>
  )
}

function VerificationResult({ result, onReset }) {
  const { t } = useTranslation()
  const similarity = result.similarity ?? result.confidence ?? 0
  const isVerified = result.match === true
  const pct = Math.round(similarity * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className={`rounded-2xl border-2 overflow-hidden ${isVerified ? 'border-emerald-200' : 'border-red-200'}`}>
        <div className={`px-6 py-4 flex items-center gap-4 ${isVerified ? 'bg-emerald-600' : 'bg-red-600'}`}>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            {isVerified
              ? <CheckCircle2 size={26} className="text-white" />
              : <XCircle size={26} className="text-white" />
            }
          </div>
          <div>
            <div className="text-white font-display font-bold text-lg">
              {isVerified ? t('verify.identityVerified') : t('verify.verificationFailed')}
            </div>
            <div className={`text-sm ${isVerified ? 'text-emerald-200' : 'text-red-200'}`}>
              {isVerified ? t('verify.confirmedInRegistry') : t('verify.notFoundInRegistry')}
            </div>
          </div>
        </div>

        <div className="p-6 bg-white">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">{t('verify.matchScore')}</span>
              <span className={`text-3xl font-display font-bold ${isVerified ? 'text-emerald-600' : 'text-red-600'}`}>
                {pct}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className={`h-3 rounded-full ${isVerified ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0%</span>
              <span className="text-slate-500">Мин. совпадение: 85%</span>
              <span>100%</span>
            </div>
          </div>

          {isVerified && (result.cow_name || result.name) && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-4">
              <div className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold mb-2">{t('verify.animalData')}</div>
              <div className="font-display font-bold text-slate-900 text-lg">{result.cow_name || result.name}</div>
              {result.id && <div className="text-xs text-slate-500 font-mono mt-1">ID: {result.id}</div>}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t('verify.matchScore'), value: `${pct}%` },
              { label: 'Status', value: isVerified ? t('history.verified') : t('history.notVerified') },
              { label: 'Processing', value: '0.3s' },
            ].map(item => (
              <div key={item.label} className="text-center p-3 bg-slate-50 rounded-xl">
                <div className={`text-lg font-bold font-display ${isVerified ? 'text-emerald-600' : 'text-red-500'}`}>{item.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>

          {!isVerified && (
            <div className="mt-4 flex items-start gap-2.5 p-3.5 bg-amber-50 rounded-xl border border-amber-100">
              <AlertTriangle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-amber-700 text-sm">
                {t('verify.notFoundInRegistry')}
              </p>
            </div>
          )}
        </div>
      </div>

      <button onClick={onReset} className="mt-4 w-full btn-secondary justify-center gap-2">
        <RefreshCw size={15} /> {t('verify.reset')}
      </button>
    </motion.div>
  )
}

export default function VerifyAnimal() {
  const { t } = useTranslation()
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef()

  const handleFile = f => {
    if (f?.type.startsWith('image/')) {
      setFile(f); setResult(null); setError('')
    }
  }

  const handleVerify = async () => {
    if (!file) return
    setLoading(true); setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const data = await verifyService.verify(formData)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Verification failed')
    } finally { setLoading(false) }
  }

  const reset = () => { setFile(null); setResult(null); setError('') }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-7">
        <h1 className="section-title">{t('verify.title')}</h1>
        <p className="section-subtitle">{t('verify.subtitle')}</p>
      </div>

      <AnimatePresence mode="wait">
        {result ? (
          <VerificationResult key="result" result={result} onReset={reset} />
        ) : (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {loading ? (
              <div className="flex flex-col items-center gap-6">
                <ScanningAnimation image={file} />
                <div className="text-center">
                  <div className="text-slate-900 font-semibold mb-1">{t('verify.scanning')}</div>
                  <div className="text-slate-500 text-sm">AI-анализ биометрии морды</div>
                </div>
                <div className="flex items-center gap-2 text-agro-700">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm font-medium">{t('common.loading')}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
                  onClick={() => !file && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl transition-all duration-200 ${
                    file ? 'border-agro-300 bg-agro-50/50' : dragOver ? 'border-agro-400 bg-agro-50' : 'border-slate-200 hover:border-agro-300 hover:bg-slate-50 cursor-pointer'
                  }`}
                >
                  {file ? (
                    <div className="relative p-4">
                      <div className="relative w-full aspect-video max-h-64 overflow-hidden rounded-xl bg-slate-100">
                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex items-center justify-between mt-3 px-1">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{file.name}</p>
                          <p className="text-xs text-slate-500">{fmtSize(file.size)}</p>
                        </div>
                        <button onClick={e => { e.stopPropagation(); reset() }} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-14 text-center px-6">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ScanFace size={28} className="text-slate-400" />
                      </div>
                      <p className="font-semibold text-slate-700 mb-1">{t('verify.uploadPrompt')}</p>
                      <p className="text-sm text-slate-400 mb-4">Drag & drop or click to browse — JPG, PNG</p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-agro-700 text-white text-sm font-medium rounded-lg hover:bg-agro-800 transition-colors">
                        <Upload size={15} /> {t('verify.uploadPrompt')}
                      </div>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 px-3.5 py-3 bg-red-50 border border-red-100 rounded-xl">
                    <AlertTriangle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleVerify}
                  disabled={!file}
                  className="btn-primary justify-center py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ScanFace size={18} />
                  {t('verify.title')}
                </button>

                <div className="grid sm:grid-cols-4 gap-3">
                  {[
                    t('verify.tip1'), t('verify.tip2'), t('verify.tip3'), t('verify.tip4')
                  ].map((tip, i) => (
                    <div key={i} className="card p-3.5 flex items-start gap-2.5">
                      <Shield size={14} className="text-agro-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-slate-600">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
