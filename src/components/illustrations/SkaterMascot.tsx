import React from 'react';

interface SkaterMascotProps {
  isRunning?: boolean;
  className?: string;
}

export const SkaterMascot: React.FC<SkaterMascotProps> = ({ isRunning = false, className = 'w-36 h-36' }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full transition-transform duration-300 ${
          isRunning ? 'animate-bounce' : 'hover:scale-105'
        }`}
        style={{ animationDuration: isRunning ? '0.75s' : '0s' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="coatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7c2d12" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="boardGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Speed Wind Lines */}
        {isRunning && (
          <g opacity="0.6" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round">
            <line x1="20" y1="95" x2="48" y2="95" />
            <line x1="12" y1="120" x2="35" y2="120" />
            <line x1="18" y1="145" x2="42" y2="145" />
          </g>
        )}

        {/* Hair Stream Behind */}
        <path d="M 60 70 C 40 85, 35 115, 45 135 C 55 120, 68 110, 80 100 Z" fill="url(#hairGrad)" />

        {/* Head */}
        <circle cx="110" cy="62" r="18" fill="#fed7aa" />

        {/* Hair Front */}
        <path d="M 98 46 C 115 42, 126 52, 128 62 C 120 58, 108 55, 98 56 Z" fill="url(#hairGrad)" />

        {/* Blue Sunglasses */}
        <g transform="translate(112, 58)">
          <rect x="0" y="0" width="12" height="8" rx="2" fill="#0284c7" />
          <rect x="-14" y="0" width="12" height="8" rx="2" fill="#0284c7" />
          <line x1="-3" y1="4" x2="1" y2="4" stroke="#0284c7" strokeWidth="2" />
          <line x1="-12" y1="2" x2="-8" y2="6" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="2" x2="6" y2="6" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Scarf / Collar */}
        <path d="M 100 76 Q 112 84 125 76 Q 128 85 102 85 Z" fill="#86efac" />

        {/* Orange Coat */}
        <path
          d="M 95 82 C 80 98, 55 120, 58 135 C 75 140, 95 130, 115 115 L 125 90 Z"
          fill="url(#coatGrad)"
        />

        {/* Hand holding coffee cup */}
        <g transform="translate(136, 125)">
          <polygon points="-8,5 8,5 6,24 -6,24" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
          <rect x="-7.5" y="10" width="15" height="8" rx="1" fill="#78350f" />
          <rect x="-9" y="3" width="18" height="3" rx="1" fill="#ea580c" />
          {isRunning && (
            <path d="M 0 -2 C 2 -6, -2 -8, 0 -12" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" />
          )}
        </g>

        {/* Shorts */}
        <path d="M 90 120 L 108 112 L 120 128 L 98 135 Z" fill="#2563eb" />

        {/* Back Leg */}
        <path d="M 92 132 L 80 152 L 95 158" fill="none" stroke="#fed7aa" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="90,154 110,158 108,166 88,162" fill="#4ade80" />

        {/* Front Leg */}
        <path d="M 112 126 L 126 150 L 140 156" fill="none" stroke="#fed7aa" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="135,152 156,156 154,164 133,160" fill="#a855f7" />

        {/* Skateboard Deck */}
        <g transform="translate(20, 155)">
          <path d="M 50 12 C 55 10, 140 10, 145 12 L 148 16 C 142 16, 52 16, 47 16 Z" fill="url(#boardGrad)" />
          
          <rect x="68" y="16" width="10" height="4" fill="#94a3b8" />
          <rect x="124" y="16" width="10" height="4" fill="#94a3b8" />
          
          <circle cx="73" cy="22" r="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
          <circle cx="129" cy="22" r="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
          {isRunning && (
            <>
              <line x1="71" y1="22" x2="75" y2="22" stroke="#0f172a" strokeWidth="1.5" />
              <line x1="127" y1="22" x2="131" y2="22" stroke="#0f172a" strokeWidth="1.5" />
            </>
          )}

          <ellipse cx="102" cy="27" rx="55" ry="3" fill="#cbd5e1" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
};
