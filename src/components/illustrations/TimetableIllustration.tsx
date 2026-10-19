import React from 'react';

export const TimetableIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-48' }) => {
  return (
    <svg viewBox="0 0 300 240" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="calBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
      </defs>

      <g transform="translate(30, 20)">
        <rect x="0" y="16" width="240" height="190" rx="16" fill="url(#calBg)" stroke="#cbd5e1" strokeWidth="2" />
        <rect x="0" y="16" width="240" height="34" rx="16" fill="#1e293b" />
        <rect x="0" y="36" width="240" height="14" fill="#1e293b" />

        {[20, 50, 80, 110, 140, 170, 200, 220].map((x) => (
          <path key={x} d={`M ${x} 8 C ${x} 2, ${x + 6} 2, ${x + 6} 8 L ${x + 6} 24 L ${x} 24 Z`} fill="#f59e0b" />
        ))}

        <g transform="translate(18, 62)">
          <rect x="0" y="0" width="36" height="24" rx="4" fill="#3b82f6" />
          <rect x="42" y="0" width="36" height="24" rx="4" fill="#ea580c" />
          <rect x="84" y="0" width="36" height="24" rx="4" fill="#10b981" />
          <rect x="126" y="0" width="36" height="24" rx="4" fill="#6366f1" />
          <rect x="168" y="0" width="36" height="24" rx="4" fill="#f59e0b" />

          <rect x="0" y="32" width="36" height="34" rx="6" fill="#eff6ff" stroke="#bfdbfe" />
          <rect x="42" y="32" width="36" height="48" rx="6" fill="#ffedd5" stroke="#fed7aa" />
          <rect x="84" y="32" width="36" height="28" rx="6" fill="#ecfdf5" stroke="#a7f3d0" />
          <rect x="126" y="32" width="36" height="38" rx="6" fill="#e0e7ff" stroke="#c7d2fe" />
          <rect x="168" y="32" width="36" height="30" rx="6" fill="#fef3c7" stroke="#fde68a" />

          <rect x="0" y="74" width="36" height="42" rx="6" fill="#ecfdf5" stroke="#a7f3d0" />
          <rect x="84" y="68" width="36" height="48" rx="6" fill="#eff6ff" stroke="#bfdbfe" />
          <rect x="126" y="76" width="36" height="40" rx="6" fill="#ffedd5" stroke="#fed7aa" />
        </g>
      </g>

      <g transform="translate(210, 140)">
        <rect x="0" y="0" width="46" height="70" rx="8" fill="#1e293b" />
        <path d="M 8 10 L 38 10 L 23 35 L 38 60 L 8 60 L 23 35 Z" fill="#ffffff" />
        <polygon points="12,14 34,14 23,30" fill="#f59e0b" />
        <polygon points="23,38 10,58 36,58" fill="#f59e0b" />
      </g>
    </svg>
  );
};
