// Local auth service — demo accounts always available as fallback
const DEMO_USERS = [
  {
    id: 1, email: 'admin@stockid.kg', password: 'admin123',
    firstName: 'Азиз', lastName: 'Мамытбеков',
    role: 'admin', region: 'Bishkek',
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 2, email: 'farmer@stockid.kg', password: 'farmer123',
    firstName: 'Нурлан', lastName: 'Бакытбеков',
    role: 'farmer', region: 'Chuy Oblast',
    createdAt: new Date('2024-01-20').toISOString()
  },
  {
    id: 3, email: 'insurance@stockid.kg', password: 'insurance123',
    firstName: 'Айгерим', lastName: 'Сейткали',
    role: 'insurance', companyName: 'KyrgyzAgroInsure',
    region: 'Bishkek', createdAt: new Date('2024-02-01').toISOString()
  },
]

export const authService = {
  login(email, password) {
    // Always try demo users first
    const demoMatch = DEMO_USERS.find(u => u.email === email && u.password === password)
    if (demoMatch) return demoMatch

    // Then check registered users
    const users = JSON.parse(localStorage.getItem('agroid_users') || '[]')
    return users.find(u => u.email === email && u.password === password) || null
  },
}
