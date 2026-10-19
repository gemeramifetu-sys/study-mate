import React from 'react';

export const BrainInsightMascot: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brainLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="brainRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      <circle cx="200" cy="200" r="160" fill="#f8fafc" />
      <circle cx="200" cy="200" r="145" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 6" />

      {/* Left Brain Hemisphere */}
      <path
        d="M 192 100 C 140 100, 95 135, 95 190 C 95 220, 115 240, 115 260 C 115 285, 140 300, 192 300 Z"
        fill="url(#brainLeft)"
      />
      <path d="M 130 150 C 160 160, 170 140, 190 150" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <path d="M 115 200 C 145 200, 160 220, 190 210" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <path d="M 135 250 C 155 250, 170 270, 190 260" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />

      {/* Right Brain Hemisphere */}
      <path
        d="M 208 100 C 260 100, 305 135, 305 190 C 305 220, 285 240, 285 260 C 285 285, 260 300, 208 300 Z"
        fill="url(#brainRight)"
      />
      <path d="M 270 150 C 240 160, 230 140, 210 150" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <path d="M 285 200 C 255 200, 240 220, 210 210" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <path d="M 265 250 C 245 250, 230 270, 210 260" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />

      <line x1="200" y1="110" x2="200" y2="290" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" opacity="0.3" />

      {/* Floating Chart Card */}
      <g transform="translate(60, 60)">
        <rect width="80" height="52" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        <rect x="12" y="30" width="8" height="14" fill="#ef4444" rx="2" />
        <rect x="26" y="22" width="8" height="22" fill="#3b82f6" rx="2" />
        <rect x="40" y="16" width="8" height="28" fill="#10b981" rx="2" />
        <rect x="54" y="26" width="8" height="18" fill="#f59e0b" rx="2" />
      </g>

      {/* Floating Idea Card */}
      <g transform="translate(260, 60)">
        <rect width="80" height="52" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        <circle cx="30" cy="24" r="10" fill="#facc15" />
        <rect x="27" y="34" width="6" height="5" fill="#94a3b8" rx="1" />
        <path d="M 52 28 C 52 20, 64 20, 64 28 C 64 34, 52 34, 52 28 Z" fill="#10b981" />
      </g>

      {/* Left Student */}
      <g transform="translate(70, 210)">
        <circle cx="20" cy="20" r="14" fill="#0f172a" />
        <path d="M 6 45 C 6 35, 34 35, 34 45 L 36 100 L 4 100 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="20" y1="45" x2="20" y2="100" stroke="#0f172a" strokeWidth="1.5" />
        <path d="M 30 50 L 65 30" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
        <line x1="12" y1="100" x2="10" y2="135" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
        <line x1="28" y1="100" x2="30" y2="135" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
      </g>

      {/* Right Student */}
      <g transform="translate(290, 210)">
        <circle cx="20" cy="20" r="14" fill="#78350f" />
        <rect x="13" y="16" width="6" height="5" rx="1" fill="#0f172a" />
        <rect x="21" y="16" width="6" height="5" rx="1" fill="#0f172a" />
        <line x1="19" y1="18" x2="21" y2="18" stroke="#0f172a" strokeWidth="1.5" />
        <path d="M 6 45 C 6 35, 34 35, 34 45 L 36 100 L 4 100 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        <rect x="0" y="55" width="18" height="24" rx="3" fill="#0f172a" />
        <rect x="3" y="58" width="12" height="18" rx="1" fill="#38bdf8" />
        <line x1="12" y1="100" x2="10" y2="135" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
        <line x1="28" y1="100" x2="30" y2="135" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
      </g>
    </svg>
  );
};
