import React from 'react';

interface SunflowerProps {
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  delay?: number;
}

const SingleSunflower: React.FC<SunflowerProps> = ({
  x,
  y,
  scale = 1,
  rotation = 0,
  delay = 0,
}) => {
  const petalCount = 20;
  const outerPetals = Array.from({ length: petalCount });
  const innerPetals = Array.from({ length: petalCount });

  return (
    // Outer translation and scaling - DO NOT apply CSS keyframe transforms here to prevent browser override
    <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotation})`}>
      {/* Inner animated group rotating gently around center (0, 0) */}
      <g
        style={{
          transformOrigin: '0px 0px',
          animation: `flowerGentleSway 5s ease-in-out infinite alternate ${delay}s`,
        }}
        className="filter drop-shadow-[0_0_14px_rgba(56,189,248,0.7)]"
      >
        {/* Soft background aura */}
        <circle cx="0" cy="0" r="75" fill="#38bdf8" opacity="0.15" filter="blur(8px)" />

        {/* Outer Petals Ring */}
        <g>
          {outerPetals.map((_, i) => {
            const angle = (i * 360) / petalCount;
            return (
              <path
                key={`outer-${i}`}
                d="M 0 -24 
                   C -10 -44, -12 -72, 0 -92 
                   C 12 -72, 10 -44, 0 -24 Z"
                fill="url(#petal-cyan-outer)"
                stroke="#0284c7"
                strokeWidth="0.8"
                transform={`rotate(${angle})`}
              />
            );
          })}
        </g>

        {/* Inner Petals Ring (Staggered offset) */}
        <g>
          {innerPetals.map((_, i) => {
            const angle = (i * 360) / petalCount + 360 / (petalCount * 2);
            return (
              <path
                key={`inner-${i}`}
                d="M 0 -20 
                   C -8 -38, -10 -62, 0 -80 
                   C 10 -62, 8 -38, 0 -20 Z"
                fill="url(#petal-cyan-inner)"
                stroke="#38bdf8"
                strokeWidth="0.6"
                transform={`rotate(${angle})`}
              />
            );
          })}
        </g>

        {/* Center Floral Disk Rim (Luminous pollen dots) */}
        <circle
          cx="0"
          cy="0"
          r="28"
          fill="#075985"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeDasharray="3 3"
        />

        {/* Dark Obsidian Core Disc */}
        <circle cx="0" cy="0" r="24" fill="#050b14" stroke="#0e7490" strokeWidth="1.8" />

        {/* Seed Core Pattern / Texture */}
        {Array.from({ length: 14 }).map((_, i) => {
          const ringAngle = (i * 360) / 14;
          const rad = (ringAngle * Math.PI) / 180;
          return (
            <circle
              key={`seed-1-${i}`}
              cx={Math.cos(rad) * 16}
              cy={Math.sin(rad) * 16}
              r="1.6"
              fill="#38bdf8"
              opacity="0.85"
            />
          );
        })}
        {Array.from({ length: 9 }).map((_, i) => {
          const ringAngle = (i * 360) / 9 + 20;
          const rad = (ringAngle * Math.PI) / 180;
          return (
            <circle
              key={`seed-2-${i}`}
              cx={Math.cos(rad) * 9}
              cy={Math.sin(rad) * 9}
              r="1.4"
              fill="#a5f3fc"
              opacity="0.9"
            />
          );
        })}
        <circle cx="0" cy="0" r="3.5" fill="#38bdf8" />
      </g>
    </g>
  );
};

export const SunflowerBouquet: React.FC = () => {
  return (
    <div className="relative w-full max-w-[420px] mx-auto select-none pointer-events-none flex items-center justify-center">
      <svg
        viewBox="0 0 500 500"
        className="w-full h-auto max-h-[38vh] sm:max-h-[44vh] overflow-visible drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
      >
        <defs>
          <linearGradient id="petal-cyan-outer" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="40%" stopColor="#38bdf8" />
            <stop offset="85%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>

          <linearGradient id="petal-cyan-inner" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0369a1" />
            <stop offset="45%" stopColor="#00f2fe" />
            <stop offset="90%" stopColor="#a5f3fc" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          <linearGradient id="stem-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="45%" stopColor="#059669" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>

          <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="60%" stopColor="#047857" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>

          <style>{`
            @keyframes flowerGentleSway {
              0% { transform: rotate(-1.5deg); }
              100% { transform: rotate(1.5deg); }
            }
          `}</style>
        </defs>

        {/* --- STEMS (Emerging from Diamond Vase neck at bottom center: x=250, y=470) --- */}
        <g stroke="url(#stem-grad)" strokeLinecap="round">
          {/* Stem 1: Far Left (To x=115, y=270) */}
          <path
            d="M 242 465 Q 165 385 115 270"
            strokeWidth="11"
            fill="none"
          />

          {/* Stem 2: Upper Mid Left (To x=175, y=170) */}
          <path
            d="M 246 465 Q 198 320 175 170"
            strokeWidth="12"
            fill="none"
          />

          {/* Stem 3: Top Center (To x=250, y=115) */}
          <path
            d="M 250 465 L 250 118"
            strokeWidth="13"
            fill="none"
          />

          {/* Stem 4: Upper Mid Right (To x=325, y=170) */}
          <path
            d="M 254 465 Q 302 320 325 170"
            strokeWidth="12"
            fill="none"
          />

          {/* Stem 5: Far Right (To x=385, y=270) */}
          <path
            d="M 258 465 Q 335 385 385 270"
            strokeWidth="11"
            fill="none"
          />
        </g>

        {/* --- LEAVES --- */}
        <g fill="url(#leaf-grad)" stroke="#10b981" strokeWidth="1.2">
          {/* Left Leaves */}
          <path
            d="M 180 345 Q 115 350 95 390 Q 150 400 190 360 Z"
            className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.35)]"
          />
          {/* Right Leaves */}
          <path
            d="M 320 345 Q 385 350 405 390 Q 350 400 310 360 Z"
            className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.35)]"
          />
          {/* Lower Center Leaves */}
          <path
            d="M 225 395 Q 165 415 175 445 Q 235 430 245 410 Z"
          />
          <path
            d="M 275 395 Q 335 415 325 445 Q 265 430 255 410 Z"
          />
        </g>

        {/* --- 5 GLOWING CYAN SUNFLOWERS (Firmly placed on their stem tips) --- */}
        {/* 1. Far Left Sunflower */}
        <SingleSunflower
          x={115}
          y={270}
          scale={0.78}
          rotation={-22}
          delay={0.2}
        />

        {/* 2. Upper Mid Left Sunflower */}
        <SingleSunflower
          x={175}
          y={170}
          scale={0.86}
          rotation={-10}
          delay={0.5}
        />

        {/* 3. Top Center Sunflower (Main Apex) */}
        <SingleSunflower
          x={250}
          y={115}
          scale={0.96}
          rotation={0}
          delay={0}
        />

        {/* 4. Upper Mid Right Sunflower */}
        <SingleSunflower
          x={325}
          y={170}
          scale={0.86}
          rotation={10}
          delay={0.7}
        />

        {/* 5. Far Right Sunflower */}
        <SingleSunflower
          x={385}
          y={270}
          scale={0.78}
          rotation={22}
          delay={0.4}
        />
      </svg>
    </div>
  );
};
