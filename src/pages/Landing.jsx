import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '../hooks/useI18n'
import {
  Shield, ScanFace, FileCheck, AlertTriangle,
  Building2, Users, CheckCircle2,
  Database, Globe, ArrowRight, Menu, X,
  Lock, Zap, Eye, ChevronDown, ChevronUp
} from 'lucide-react'
import LanguageSwitcher from '../components/ui/LanguageSwitcher'
import StockIDLogo from '../components/ui/StockIDLogo'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
}
const stagger = { visible: { transition: { staggerChildren: 0.09 } } }

function FAQ({ items }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="flex flex-col divide-y divide-slate-100">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-4 text-left group"
          >
            <span className="text-slate-800 font-medium text-sm pr-4 group-hover:text-agro-700 transition-colors">{item.q}</span>
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              {open === i
                ? <ChevronUp size={14} className="text-agro-600" />
                : <ChevronDown size={14} className="text-slate-400" />
              }
            </div>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <p className="pb-4 text-slate-500 text-sm leading-relaxed">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export default function Landing() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const problems = [
    { icon: AlertTriangle, title: t('problems.theft.title'), desc: t('problems.theft.desc'), color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
    { icon: FileCheck, title: t('problems.fraud.title'), desc: t('problems.fraud.desc'), color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { icon: Database, title: t('problems.paper.title'), desc: t('problems.paper.desc'), color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { icon: Globe, title: t('problems.noRegistry.title'), desc: t('problems.noRegistry.desc'), color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  ]

  const steps = [
    { step: '01', title: t('how.step1.title'), desc: t('how.step1.desc'), icon: ScanFace },
    { step: '02', title: t('how.step2.title'), desc: t('how.step2.desc'), icon: Database },
    { step: '03', title: t('how.step3.title'), desc: t('how.step3.desc'), icon: FileCheck },
    { step: '04', title: t('how.step4.title'), desc: t('how.step4.desc'), icon: Shield },
  ]

  const audience = [
    { icon: Users, title: t('forWhom.farmers.title'), items: t('forWhom.farmers.items', { returnObjects: true }) },
    { icon: Building2, title: t('forWhom.insurance.title'), items: t('forWhom.insurance.items', { returnObjects: true }) },
    { icon: Globe, title: t('forWhom.gov.title'), items: t('forWhom.gov.items', { returnObjects: true }) },
  ]

  const trustItems = [
    { icon: Lock, title: t('trust.secure.title'), desc: t('trust.secure.desc') },
    { icon: Eye, title: t('trust.transparent.title'), desc: t('trust.transparent.desc') },
    { icon: Zap, title: t('trust.fast.title'), desc: t('trust.fast.desc') },
    { icon: ScanFace, title: t('trust.official.title'), desc: t('trust.official.desc') },
  ]

  const faqItems = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/96 backdrop-blur-md border-b border-slate-100' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-[66px]">
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <StockIDLogo size={32} />
            <span className="font-display font-bold text-slate-900 text-[16px] tracking-tight">
              Stock<span className="text-agro-600">ID</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {[
              ['#how', t('nav.how')],
              ['#for-whom', t('nav.forWhom')],
              ['#why', t('nav.why')],
            ].map(([href, label]) => (
              <a key={href} href={href} className="px-3 py-2 text-[13px] text-slate-600 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-50 transition-all">
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <Link to="/login" className="btn-secondary py-2 px-3.5 text-[13px]">{t('nav.login')}</Link>
            <Link to="/register" className="btn-primary py-2 px-3.5 text-[13px]">{t('nav.register')}</Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="px-5 py-4 flex flex-col gap-1">
                {[['#how', t('nav.how')], ['#for-whom', t('nav.forWhom')], ['#why', t('nav.why')]].map(([href, label]) => (
                  <a key={href} href={href} onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-sm text-slate-700 font-medium rounded-lg hover:bg-slate-50">{label}</a>
                ))}
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                  <LanguageSwitcher />
                  <div className="flex gap-2">
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-sm py-2 px-3">{t('nav.login')}</Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm py-2 px-3">{t('nav.register')}</Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero — clean, no fake stats */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#f8fafc]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-agro-50/60 blur-[90px] -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-slate-100/50 blur-[70px]" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(3,83,164,1) 1px, transparent 1px), linear-gradient(90deg, rgba(3,83,164,1) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-28 pb-20 w-full">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 bg-agro-50 border border-agro-100 rounded-full text-agro-700 text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 bg-agro-500 rounded-full" />
              {t('hero.badge')}
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-[52px] font-display font-bold text-slate-900 leading-[1.1] tracking-tight mb-5">
              {t('hero.title')}
            </motion.h1>

            <motion.p variants={fadeUp} className="text-[16px] text-slate-500 leading-relaxed mb-8 max-w-xl">
              {t('hero.subtitle')}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Link to="/register-animal" className="btn-primary gap-2 px-5 py-2.5 text-sm">
                {t('hero.cta_register')} <ArrowRight size={15} />
              </Link>
              <Link to="/verify" className="btn-secondary gap-2 px-5 py-2.5 text-sm">
                <ScanFace size={15} /> {t('hero.cta_verify')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problems */}
      <section id="problems" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-12">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full text-red-700 text-xs font-semibold mb-4">
              <AlertTriangle size={12} /> {t('problems.badge')}
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-3 max-w-2xl">
              {t('problems.title')}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 max-w-lg text-[15px] leading-relaxed">
              {t('problems.subtitle')}
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {problems.map(item => (
              <motion.div key={item.title} variants={fadeUp} className={`p-5 rounded-xl border ${item.border} ${item.bg}`}>
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mb-3.5 shadow-sm">
                  <item.icon size={16} className={item.color} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1.5 text-[14px]">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-12">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 bg-agro-50 border border-agro-100 rounded-full text-agro-700 text-xs font-semibold mb-4">
              <ScanFace size={12} /> {t('how.badge')}
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-3">
              {t('how.title')}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 max-w-lg text-[15px] leading-relaxed">
              {t('how.subtitle')}
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map(item => (
              <motion.div key={item.step} variants={fadeUp} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-agro-200 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 bg-agro-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold font-mono">{item.step}</span>
                  </div>
                  <div className="w-8 h-8 bg-agro-50 border border-agro-100 rounded-lg flex items-center justify-center">
                    <item.icon size={15} className="text-agro-700" />
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1.5 text-[14px]">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* For whom */}
      <section id="for-whom" className="py-20 bg-agro-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">{t('forWhom.title')}</motion.h2>
            <motion.p variants={fadeUp} className="text-agro-300 max-w-md mx-auto text-[15px] leading-relaxed">{t('forWhom.subtitle')}</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid lg:grid-cols-3 gap-4">
            {audience.map(card => (
              <motion.div key={card.title} variants={fadeUp} className="bg-white/[0.07] border border-white/[0.1] rounded-xl p-5 hover:bg-white/[0.09] transition-colors">
                <div className="w-9 h-9 bg-white/[0.1] rounded-lg flex items-center justify-center mb-4 border border-white/15">
                  <card.icon size={18} className="text-white" />
                </div>
                <h3 className="font-semibold text-white text-[15px] mb-3">{card.title}</h3>
                <ul className="flex flex-col gap-2">
                  {(Array.isArray(card.items) ? card.items : []).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-agro-200 leading-relaxed">
                      <CheckCircle2 size={13} className="text-agro-400 mt-0.5 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust */}
      <section id="why" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-12">
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-display font-bold text-slate-900">{t('trust.title')}</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustItems.map(item => (
              <motion.div key={item.title} variants={fadeUp} className="group p-5 rounded-xl border border-slate-100 hover:border-agro-100 hover:bg-slate-50 transition-all duration-200">
                <div className="w-9 h-9 bg-slate-100 group-hover:bg-agro-50 rounded-xl flex items-center justify-center mb-3.5 transition-colors">
                  <item.icon size={17} className="text-slate-600 group-hover:text-agro-700 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1.5 text-[14px]">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl font-display font-bold text-slate-900 mb-8">
            {t('faq.title')}
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-slate-200 px-5">
            <FAQ items={faqItems} />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-xl mx-auto px-5 sm:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl font-display font-bold text-slate-900 mb-3">{t('cta.title')}</motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 text-[15px] mb-7 leading-relaxed">{t('cta.subtitle')}</motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 justify-center">
              <Link to="/register" className="btn-primary gap-2 px-5 py-2.5 text-sm">
                {t('cta.primary')} <ArrowRight size={15} />
              </Link>
              <Link to="/login" className="btn-secondary gap-2 px-5 py-2.5 text-sm">{t('cta.secondary')}</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <StockIDLogo size={30} dark />
                <span className="font-display font-bold text-white">Stock<span className="text-agro-400">ID</span></span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-3">{t('footer.tagline')}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                {t('footer.madeIn')}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('footer.product')}</div>
              <ul className="flex flex-col gap-2">
                {[t('footer.howWorks'), t('footer.forFarmers'), t('footer.forInsurance')].map(item => (
                  <li key={item}><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('footer.company')}</div>
              <ul className="flex flex-col gap-2">
                {[t('footer.about'), t('footer.contacts')].map(item => (
                  <li key={item}><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('footer.legal')}</div>
              <ul className="flex flex-col gap-2">
                {[t('footer.privacy'), t('footer.terms')].map(item => (
                  <li key={item}><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex items-center justify-between">
            <span className="text-slate-600 text-xs">{t('footer.copyright')}</span>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Shield size={11} className="text-slate-500" /> Encrypted storage
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
