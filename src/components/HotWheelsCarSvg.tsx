import React from 'react';

interface HotWheelsCarSvgProps {
  color?: 'blue' | 'red';
  className?: string;
  glow?: boolean;
}

export const HotWheelsCarSvg: React.FC<HotWheelsCarSvgProps> = ({
  color = 'blue',
  className = '',
  glow = true,
}) => {
  const isBlue = color === 'blue';

  const bodyGradientId = isBlue ? 'car-body-blue' : 'car-body-red';
  const bodyHighlightId = isBlue ? 'car-highlight-blue' : 'car-highlight-red';
  const rimColor = isBlue ? '#38bdf8' : '#fbbf24';

  return (
    <svg
      viewBox="0 0 420 160"
      className={`w-full h-auto select-none overflow-visible ${className}`}
      style={{
        filter: glow
          ? isBlue
            ? 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.7))'
            : 'drop-shadow(0 0 12px rgba(230, 0, 18, 0.75))'
          : undefined,
      }}
    >
      <defs>
        {/* Blue body gradient */}
        <linearGradient id="car-body-blue" x1="0%" y1="20%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="35%" stopColor="#0066cc" />
          <stop offset="70%" stopColor="#004080" />
          <stop offset="100%" stopColor="#002244" />
        </linearGradient>

        <linearGradient id="car-highlight-blue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#0284c7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#002244" stopOpacity="0" />
        </linearGradient>

        {/* Red body gradient */}
        <linearGradient id="car-body-red" x1="0%" y1="20%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#ff4500" />
          <stop offset="30%" stopColor="#e60012" />
          <stop offset="70%" stopColor="#b3000d" />
          <stop offset="100%" stopColor="#660007" />
        </linearGradient>

        <linearGradient id="car-highlight-red" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#e60012" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#660007" stopOpacity="0" />
        </linearGradient>

        {/* Windshield gradient */}
        <linearGradient id="car-glass" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="60%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.6" />
        </linearGradient>

        {/* Hot Wheels flame gradient */}
        <linearGradient id="hw-flame-grad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#ff0000" />
          <stop offset="35%" stopColor="#ff4500" />
          <stop offset="75%" stopColor="#ffa500" />
          <stop offset="100%" stopColor="#ffeb3b" />
        </linearGradient>

        {/* Wheel rim radial */}
        <radialGradient id="rim-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#94a3b8" />
          <stop offset="85%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
      </defs>

      {/* Aerodynamic undertray shadow */}
      <ellipse cx="210" cy="138" rx="190" ry="12" fill="rgba(0,0,0,0.6)" filter="blur(4px)" />

      {/* Main Car Body Group */}
      <g id="car-chassis">
        {/* Rear Spoiler / Wing */}
        <path
          d="M 28 65 L 12 50 L 52 50 L 58 65 Z"
          fill={isBlue ? '#002244' : '#660007'}
        />
        <path
          d="M 10 49 L 55 49 L 50 44 L 5 44 Z"
          fill={isBlue ? '#0284c7' : '#ff4500'}
        />
        {/* Wing struts */}
        <line x1="24" y1="50" x2="30" y2="70" stroke="#0f172a" strokeWidth="4" />
        <line x1="42" y1="50" x2="48" y2="70" stroke="#0f172a" strokeWidth="4" />

        {/* Main Body Shell */}
        <path
          d="M 25 90 
             Q 30 72 65 72 
             Q 90 70 120 54 
             Q 155 35 220 35 
             Q 280 35 315 62 
             L 365 74 
             Q 405 84 410 98 
             Q 412 110 395 116 
             L 375 118 
             Q 372 88 340 88 
             Q 308 88 305 118 
             L 175 118 
             Q 172 88 140 88 
             Q 108 88 105 118 
             L 40 118 
             Q 22 115 25 90 Z"
          fill={`url(#${bodyGradientId})`}
          stroke={isBlue ? '#38bdf8' : '#f87171'}
          strokeWidth="1.5"
        />

        {/* Roof / Cabin Glass */}
        <path
          d="M 125 54 
             Q 155 38 215 38 
             Q 265 38 295 62 
             L 245 62 
             Q 190 62 135 62 Z"
          fill="url(#car-glass)"
          stroke="#0f172a"
          strokeWidth="1.5"
        />

        {/* Side window front and rear divider */}
        <path
          d="M 215 40 L 210 62"
          stroke="#0f172a"
          strokeWidth="3"
        />

        {/* Aerodynamic Body Lines & Highlight */}
        <path
          d="M 65 76 Q 160 68 280 66 Q 340 76 395 95"
          fill="none"
          stroke={`url(#${bodyHighlightId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        <path
          d="M 120 95 L 290 95"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
        />

        {/* Front Headlight (Neon Glow) */}
        <path
          d="M 388 92 L 408 97 L 396 104 Z"
          fill="#e0f2fe"
          style={{ filter: 'drop-shadow(0 0 6px #38bdf8)' }}
        />

        {/* Rear Taillight */}
        <path
          d="M 24 88 L 32 88 L 30 96 L 22 95 Z"
          fill="#ff0033"
          style={{ filter: 'drop-shadow(0 0 6px #ff0033)' }}
        />

        {/* Lower Front Splitter */}
        <path
          d="M 390 118 L 415 117 L 412 124 L 380 124 Z"
          fill="#0f172a"
        />

        {/* Hot Wheels Flame Badge on Door */}
        <g transform="translate(185, 76) scale(0.68)">
          {/* Flame background glow badge */}
          <path
            d="M 0 15 
               C 10 5, 25 0, 45 2 
               C 65 3, 75 14, 85 8 
               C 95 2, 105 18, 120 12 
               C 130 8, 140 18, 155 12 
               C 140 30, 110 38, 70 38 
               C 35 38, 10 30, 0 15 Z"
            fill="url(#hw-flame-grad)"
            stroke="#ffffff"
            strokeWidth="1.8"
            style={{ filter: 'drop-shadow(0 0 4px rgba(255, 69, 0, 0.9))' }}
          />

          {/* Hot Wheels Script Text Style */}
          <text
            x="20"
            y="26"
            fontFamily="'Montserrat', 'Arial Black', sans-serif"
            fontWeight="900"
            fontStyle="italic"
            fontSize="16"
            fill="#ffffff"
            stroke="#b91c1c"
            strokeWidth="1"
            letterSpacing="-0.5px"
          >
            HOT WHEELS
          </text>
        </g>
      </g>

      {/* Front Wheel */}
      <g id="front-wheel" transform="translate(340, 118)">
        {/* Tire rubber */}
        <circle cx="0" cy="0" r="32" fill="#0f172a" stroke="#1e293b" strokeWidth="4" />
        <circle cx="0" cy="0" r="28" fill="#1e293b" />
        {/* Rim outer lip */}
        <circle cx="0" cy="0" r="22" fill="url(#rim-gradient)" stroke={rimColor} strokeWidth="1.5" />
        {/* Brake disc & caliper */}
        <circle cx="0" cy="0" r="16" fill="#475569" stroke="#64748b" strokeWidth="1" />
        <path d="M 8 -8 A 12 12 0 0 1 12 4 L 4 2 Z" fill="#ef4444" />
        {/* 5-Spoke Star Design */}
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <line
            key={idx}
            x1="0"
            y1="0"
            x2={Math.cos((angle * Math.PI) / 180) * 19}
            y2={Math.sin((angle * Math.PI) / 180) * 19}
            stroke="#f8fafc"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        ))}
        {/* Center Cap */}
        <circle cx="0" cy="0" r="5" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1" />
      </g>

      {/* Rear Wheel */}
      <g id="rear-wheel" transform="translate(140, 118)">
        {/* Tire rubber */}
        <circle cx="0" cy="0" r="32" fill="#0f172a" stroke="#1e293b" strokeWidth="4" />
        <circle cx="0" cy="0" r="28" fill="#1e293b" />
        {/* Rim outer lip */}
        <circle cx="0" cy="0" r="22" fill="url(#rim-gradient)" stroke={rimColor} strokeWidth="1.5" />
        {/* Brake disc & caliper */}
        <circle cx="0" cy="0" r="16" fill="#475569" stroke="#64748b" strokeWidth="1" />
        <path d="M 8 -8 A 12 12 0 0 1 12 4 L 4 2 Z" fill="#ef4444" />
        {/* 5-Spoke Star Design */}
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <line
            key={idx}
            x1="0"
            y1="0"
            x2={Math.cos((angle * Math.PI) / 180) * 19}
            y2={Math.sin((angle * Math.PI) / 180) * 19}
            stroke="#f8fafc"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        ))}
        {/* Center Cap */}
        <circle cx="0" cy="0" r="5" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1" />
      </g>
    </svg>
  );
};
