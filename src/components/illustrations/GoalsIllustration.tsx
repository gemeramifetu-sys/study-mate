import React from 'react';

export const GoalsIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-48' }) => {
  return (
    <svg viewBox="0 0 300 240" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="padGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fdf2f8" />
        </linearGradient>
      </defs>

      <g transform="translate(70, 30)">
        <rect x="0" y="0" width="160" height="180" rx="20" fill="url(#padGrad)" stroke="#f472b6" strokeWidth="8" />
        <rect x="0" y="0" width="160" height="24" rx="12" fill="#ec4899" />

        {[45, 70, 95, 120, 145].map((y) => (
          <g key={y}>
            <circle cx="28" cy={y} r="6" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <line x1="44" y1={y} x2="136" y2={y} stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
          </g>
        ))}

        <path d="M 24 45 L 27 48 L 33 42" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 24 70 L 27 73 L 33 67" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <g transform="translate(30, 60) rotate(-20)">
        <polygon points="15,0 35,0 30,120 20,120" fill="#2563eb" />
        <polygon points="20,120 30,120 25,145" fill="#f59e0b" />
        <polygon points="23,145 27,145 25,152" fill="#0f172a" />
        <rect x="33" y="15" width="8" height="40" rx="3" fill="#1d4ed8" />
      </g>

      <g transform="translate(190, 15)">
        <circle cx="28" cy="28" r="22" fill="#fbbf24" stroke="#f59e0b" strokeWidth="3" />
        <rect x="20" y="48" width="16" height="10" rx="2" fill="#64748b" />
        <line x1="20" y1="52" x2="36" y2="52" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="22" y1="56" x2="34" y2="56" stroke="#ffffff" strokeWidth="1.5" />
      </g>
    </svg>
  );
};
