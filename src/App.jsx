import React from 'react'
import { AuthProvider } from './context/AuthContext'
import { I18nProvider } from './hooks/useI18n'
import AppRouter from './router/AppRouter'

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </I18nProvider>
  )
}
