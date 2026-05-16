export const REGIONS = [
  'Bishkek', 'Chuy Oblast', 'Issyk-Kul Oblast', 'Naryn Oblast',
  'Talas Oblast', 'Jalal-Abad Oblast', 'Osh Oblast', 'Batken Oblast', 'Osh City'
]

export const BREEDS = [
  'Holstein', 'Ala-Too (Kyrgyz)', 'Simmental', 'Kazakh Whiteheaded',
  'Alatau', 'Brown Swiss', 'Aberdeen Angus', 'Hereford', 'Limousin',
  'Local Mixed Breed', 'Other'
]

export const INSURANCE_COMPANIES = [
  'KyrgyzAgroInsure', 'AgroGarant', 'DamaStrakhovanie',
  'Kyrgyz Insurance Group', 'InGo Armenia Kyrgyzstan', 'Other'
]

export const VACCINATION_STATUSES = [
  'Fully Vaccinated', 'Partially Vaccinated', 'Not Vaccinated', 'Unknown'
]

export const VERIFICATION_THRESHOLD = 0.85

export const ROLES = {
  ADMIN: 'admin',
  FARMER: 'farmer',
  INSURANCE: 'insurance',
  VET: 'veterinary',
}

export const NAV_LINKS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/animals', label: 'My Animals', icon: 'Beef' },
  { path: '/register-animal', label: 'Register Animal', icon: 'PlusCircle' },
  { path: '/verify', label: 'Verify Animal', icon: 'ScanFace' },
  { path: '/history', label: 'Verification History', icon: 'History' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
  { path: '/admin', label: 'Admin Panel', icon: 'ShieldCheck', adminOnly: true },
]
