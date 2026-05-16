import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from '../hooks/useI18n'
import { CheckCircle2 } from 'lucide-react'
import StockIDLogo from '../components/ui/StockIDLogo'
import LanguageSwitcher from '../components/ui/LanguageSwitcher'

export default function AuthLayout() {
  const { t } = useTranslation()

  const benefits = [
    t('auth.benefit1'),
    t('auth.benefit2'),
    t('auth.benefit3'),
    t('auth.benefit4'),
  ]

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[440px] xl:w-[500px] bg-agro-800 relative flex-col justify-between p-10 overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-agro-700/25 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <StockIDLogo size={36} dark />
            <span className="text-white font-display font-bold text-lg">
              Stock<span className="text-agro-300">ID</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <h2 className="text-2xl font-display font-semibold text-white leading-snug mb-3">
              {t('auth.sideTitle')}
            </h2>
            <p className="text-agro-200 text-sm leading-relaxed">
              {t('auth.sideDesc')}
            </p>
          </div>

          <div>
            <p className="text-agro-400 text-xs font-semibold uppercase tracking-widest mb-4">{t('auth.whyUse')}</p>
            <ul className="flex flex-col gap-3">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={15} className="text-agro-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-agro-100 leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-agro-500 text-xs">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            StockID · Кыргызстан · 2024
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile topbar */}
        <div className="flex items-center justify-between px-5 py-4 lg:hidden border-b border-slate-200 bg-white">
          <Link to="/" className="flex items-center gap-2">
            <StockIDLogo size={28} />
            <span className="font-display font-bold text-slate-900 text-base">
              Stock<span className="text-agro-600">ID</span>
            </span>
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
          <div className="hidden lg:block absolute top-5 right-6">
            <LanguageSwitcher />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-[420px]"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
