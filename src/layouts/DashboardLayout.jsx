import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, PlusCircle, ScanFace, History,
  Settings, ShieldCheck, ChevronRight, LogOut, Bell,
  Menu, X, ChevronDown, Beef
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../hooks/useI18n'
import { getInitials } from '../utils/helpers'
import StockIDLogo from '../components/ui/StockIDLogo'
import LanguageSwitcher from '../components/ui/LanguageSwitcher'

export default function DashboardLayout() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard },
    { path: '/animals', label: t('sidebar.myAnimals'), icon: Beef },
    { path: '/register-animal', label: t('sidebar.registerAnimal'), icon: PlusCircle },
    { path: '/verify', label: t('sidebar.verify'), icon: ScanFace },
    { path: '/history', label: t('sidebar.history'), icon: History },
    { path: '/settings', label: t('sidebar.settings'), icon: Settings },
  ]
  const adminItems = [
    { path: '/admin', label: t('sidebar.adminPanel'), icon: ShieldCheck },
  ]

  const handleLogout = () => { logout(); navigate('/') }
  const initials = getInitials(user?.firstName, user?.lastName)

  function SidebarItem({ item, collapsed: col }) {
    const active = location.pathname === item.path
    const Icon = item.icon
    return (
      <Link
        to={item.path}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium ${
          active ? 'bg-agro-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
        title={col ? item.label : undefined}
      >
        <Icon size={18} className="flex-shrink-0" />
        {!col && <span>{item.label}</span>}
        {!col && active && <ChevronRight size={14} className="ml-auto opacity-60" />}
      </Link>
    )
  }

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-100 ${collapsed && !mobile ? 'justify-center px-3' : ''}`}>
        <StockIDLogo size={32} />
        {(!collapsed || mobile) && (
          <div>
            <span className="font-display font-bold text-slate-900 text-[16px] tracking-tight">
              Stock<span className="text-agro-600">ID</span>
            </span>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">{t('sidebar.livestock')}</div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto scrollbar-thin">
        {(!collapsed || mobile) && (
          <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">{t('sidebar.main')}</p>
        )}
        {navItems.map(item => <SidebarItem key={item.path} item={item} collapsed={collapsed && !mobile} />)}

        {user?.role === 'admin' && (
          <>
            {(!collapsed || mobile) && (
              <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-4 mb-1">{t('sidebar.admin')}</p>
            )}
            {adminItems.map(item => <SidebarItem key={item.path} item={item} collapsed={collapsed && !mobile} />)}
          </>
        )}
      </nav>

      <div className="border-t border-slate-100 px-3 py-3">
        <div className={`flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors ${collapsed && !mobile ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-agro-100 flex items-center justify-center flex-shrink-0">
            <span className="text-agro-700 font-semibold text-xs">{initials}</span>
          </div>
          {(!collapsed || mobile) && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-900 truncate">{user?.firstName} {user?.lastName}</div>
              <div className="text-xs text-slate-500 truncate capitalize">{user?.role}</div>
            </div>
          )}
        </div>
        {(!collapsed || mobile) && (
          <button
            onClick={handleLogout}
            className="mt-1 w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={15} />
            <span>{t('sidebar.signOut')}</span>
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar — изменено md на lg */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col bg-white border-r border-slate-100 flex-shrink-0 overflow-hidden"
        style={{ minHeight: '100vh' }}
      >
        <div className="w-full h-full flex flex-col" style={{ minWidth: collapsed ? 72 : 256 }}>
          <SidebarContent />
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 md:hidden flex flex-col"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 h-14 bg-white border-b border-slate-100 flex items-center px-4 md:px-6 gap-4">
          {/* Кнопка Menu — изменено md:hidden на lg:hidden */}
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600">
            <Menu size={20} />
          </button>
          {/* Кнопка collapse — изменено hidden md:flex на hidden lg:flex */}
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            {collapsed ? <ChevronRight size={18} /> : <Menu size={18} />}
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-agro-100 flex items-center justify-center">
                  <span className="text-agro-700 font-semibold text-xs">{initials}</span>
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.firstName}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-elevated border border-slate-100 py-1.5 z-50"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-medium text-slate-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <Link to="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <Settings size={15} />{t('sidebar.settings')}
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut size={15} />{t('sidebar.signOut')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}