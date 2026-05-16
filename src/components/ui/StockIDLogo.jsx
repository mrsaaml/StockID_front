import React from 'react'

export default function StockIDLogo({ size = 32, dark = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="9" fill={dark ? '#ffffff12' : '#0353a4'} />
      {/* Scan bracket corners */}
      <path d="M7 13V8H12" stroke={dark ? '#60a5fa' : '#93c5fd'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28 8H33V13" stroke={dark ? '#60a5fa' : '#93c5fd'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 27V32H12" stroke={dark ? '#60a5fa' : '#93c5fd'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28 32H33V27" stroke={dark ? '#60a5fa' : '#93c5fd'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Cow head ellipse */}
      <ellipse cx="20" cy="18" rx="8" ry="7.5" fill="white" fillOpacity="0.96"/>
      {/* Ears */}
      <ellipse cx="12.5" cy="13.5" rx="2.5" ry="3" fill="white" fillOpacity="0.9"/>
      <ellipse cx="27.5" cy="13.5" rx="2.5" ry="3" fill="white" fillOpacity="0.9"/>
      {/* Muzzle area (nose fingerprint) */}
      <ellipse cx="20" cy="21.5" rx="4" ry="2.8" fill="#1d6ed8" fillOpacity="0.85"/>
      {/* Biometric lines on nose */}
      <path d="M17.5 21 Q20 19.5 22.5 21" stroke="white" strokeWidth="0.75" strokeLinecap="round"/>
      <path d="M17 22 Q20 20.2 23 22" stroke="white" strokeWidth="0.65" strokeLinecap="round"/>
      <path d="M18 23 Q20 21.5 22 23" stroke="white" strokeWidth="0.55" strokeLinecap="round"/>
    </svg>
  )
}
