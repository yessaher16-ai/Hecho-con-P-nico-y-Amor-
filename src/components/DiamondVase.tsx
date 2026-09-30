import React from 'react';

interface DiamondVaseProps {
  className?: string;
}

export const DiamondVase: React.FC<DiamondVaseProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ambient background glow behind the diamond */}
      <div className="absolute inset-0 bg-[#00f2fe]/20 blur-2xl rounded-full scale-110 pointer-events-none" />

      <svg
        viewBox="0 0 320 280"
        className="w-full h-auto select-none overflow-visible filter drop-shadow-[0_0_20px_rgba(56,189,248,0.7)]"
      >
        <defs>
          {/* Main diamond crystal translucent gradients */}
          <linearGradient id="diamond-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="facet-center" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="facet-left" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="facet-right" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#075985" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="facet-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Glowing edge filter */}
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Diamond Outer Silhouette & Facets */}
        <g stroke="#38bdf8" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
          {/* Top table edge / rim */}
          {/* Coordinates:
              Top-left: (60, 45)
              Top-mid-left: (110, 45)
              Top-mid-right: (210, 45)
              Top-right: (260, 45)
              Shoulder-left: (20, 110)
              Girdle-mid-left: (90, 125)
              Girdle-center: (160, 130)
              Girdle-mid-right: (230, 125)
              Shoulder-right: (300, 110)
              Bottom culet tip: (160, 265)
          */}

          {/* Upper Crown Facets */}
          {/* Top Left Wing */}
          <polygon
            points="60,45 20,110 90,125 110,45"
            fill="url(#facet-left)"
          />

          {/* Top Center-Left Facet */}
          <polygon
            points="110,45 90,125 160,130 160,45"
            fill="url(#facet-center)"
          />

          {/* Top Center-Right Facet */}
          <polygon
            points="160,45 160,130 230,125 210,45"
            fill="url(#diamond-top)"
          />

          {/* Top Right Wing */}
          <polygon
            points="210,45 230,125 300,110 260,45"
            fill="url(#facet-right)"
          />

          {/* Central Flat Table Highlight */}
          <polygon
            points="60,45 110,45 210,45 260,45 230,65 90,65"
            fill="#e0f2fe"
            fillOpacity="0.4"
          />

          {/* Lower Pavilion Facets (Tapering to bottom culet tip) */}
          {/* Far Left Pavilion */}
          <polygon
            points="20,110 90,125 160,265"
            fill="url(#facet-left)"
            fillOpacity="0.75"
          />

          {/* Center-Left Pavilion */}
          <polygon
            points="90,125 160,130 160,265"
            fill="url(#facet-center)"
            fillOpacity="0.85"
          />

          {/* Center-Right Pavilion */}
          <polygon
            points="160,130 230,125 160,265"
            fill="url(#facet-right)"
            fillOpacity="0.85"
          />

          {/* Far Right Pavilion */}
          <polygon
            points="230,125 300,110 160,265"
            fill="url(#facet-right)"
            fillOpacity="0.7"
          />

          {/* Inner Refraction Heart 'V' mark (seen in video: glowing inner V) */}
          <polyline
            points="110,140 160,240 210,140"
            stroke="#e0f2fe"
            strokeWidth="3.5"
            fill="none"
            style={{ filter: 'drop-shadow(0 0 8px #00f2fe)' }}
          />

          {/* Outer Perimeter Crisp Highlight */}
          <polygon
            points="60,45 260,45 300,110 160,265 20,110"
            fill="none"
            stroke="#a5f3fc"
            strokeWidth="2.8"
          />
        </g>

        {/* Specular Sparkle Star at Top Edge */}
        <g transform="translate(75, 45) scale(0.6)">
          <path
            d="M 0 -20 Q 0 0 20 0 Q 0 0 0 20 Q 0 0 -20 0 Q 0 0 0 -20"
            fill="#ffffff"
            style={{ filter: 'drop-shadow(0 0 6px #ffffff)' }}
          />
        </g>
        <g transform="translate(245, 65) scale(0.5)">
          <path
            d="M 0 -20 Q 0 0 20 0 Q 0 0 0 20 Q 0 0 -20 0 Q 0 0 0 -20"
            fill="#ffffff"
            style={{ filter: 'drop-shadow(0 0 6px #ffffff)' }}
          />
        </g>
      </svg>
    </div>
  );
};
