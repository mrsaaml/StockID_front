import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('agroid_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (_) {}
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    const enriched = { ...userData, loginAt: new Date().toISOString() }
    localStorage.setItem('agroid_user', JSON.stringify(enriched))
    setUser(enriched)
  }

  const logout = () => {
    localStorage.removeItem('agroid_user')
    setUser(null)
  }

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('agroid_users') || '[]')
    const exists = users.find(u => u.email === userData.email)
    if (exists) throw new Error('User with this email already exists')
    const newUser = { ...userData, id: Date.now(), role: userData.role || 'farmer', createdAt: new Date().toISOString() }
    users.push(newUser)
    localStorage.setItem('agroid_users', JSON.stringify(users))
    login(newUser)
    return newUser
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
