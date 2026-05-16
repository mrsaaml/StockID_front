import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useTranslation } from '../hooks/useI18n'
import { cowService } from '../services/cowService'
import LivestockPassport from '../components/verification/LivestockPassport'

export default function AnimalDetails() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [animal, setAnimal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cowService.getById(id)
      .then(data => setAnimal(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={28} className="animate-spin text-agro-600" />
    </div>
  )

  if (error || !animal) return (
    <div className="p-8 text-center">
      <p className="text-red-600 mb-4">{error || 'Animal not found'}</p>
      <Link to="/animals" className="btn-secondary">{t('common.back')}</Link>
    </div>
  )

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <Link to="/animals" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ArrowLeft size={15} /> {t('common.back')}
      </Link>
      <div className="mb-6">
        <h1 className="section-title">{animal.name}</h1>
        <p className="section-subtitle">{t('passport.title')}</p>
      </div>
      <LivestockPassport animal={{
        ...animal,
        biometricId: `KG-STK-${animal.id}`,
        registeredAt: animal.created_at || animal.createdAt,
        status: 'verified',
        birthYear: animal.birth_year,
        ownerName: animal.owner_name,
        vaccinationStatus: animal.vaccination_status,
        insuranceCompany: animal.insurance_company,
        imageUrl: animal.photo_path ? `http://127.0.0.1:8000/${animal.photo_path}` : null,
      }} />
    </div>
  )
}
