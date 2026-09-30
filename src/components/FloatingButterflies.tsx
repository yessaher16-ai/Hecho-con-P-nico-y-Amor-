import React, { useMemo } from 'react';

interface Butterfly {
  id: number;
  left: number; // %
  duration: number; // seconds
  delay: number; // seconds
  scale: number;
  flutterSpeed: number; // seconds
  driftOffset: number; // px
}

export const FloatingButterflies: React.FC = () => {
  const butterflies = useMemo<Butterfly[]>(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      duration: 10 + Math.random() * 8,
      delay: Math.random() * 12,
      scale: 0.65 + Math.random() * 0.5,
      flutterSpeed: 0.35 + Math.random() * 0.25,
      driftOffset: (Math.random() - 0.5) * 45,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <style>{`
        @keyframes floatUpward {
          0% {
            transform: translateY(105vh) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          50% {
            transform: translateY(50vh) translateX(25px) rotate(8deg);
          }
          75% {
            transform: translateY(25vh) translateX(-20px) rotate(-6deg);
          }
          95% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(-10vh) translateX(15px) rotate(4deg);
            opacity: 0;
          }
        }

        @keyframes flapLeft {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.25); }
        }

        @keyframes flapRight {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.25); }
        }
      `}</style>

      {butterflies.map((b) => (
        <div
          key={b.id}
          className="absolute"
          style={{
            left: `${b.left}%`,
            bottom: '-20px',
            animation: `floatUpward ${b.duration}s ease-in-out infinite`,
            animationDelay: `${b.delay}s`,
          }}
        >
          <div
            className="flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(56,189,248,0.9)]"
            style={{
              transform: `scale(${b.scale})`,
            }}
          >
            {/* Left Wing */}
            <div
              className="w-4 h-4 bg-gradient-to-tr from-[#0284c7] via-[#38bdf8] to-[#a5f3fc] rounded-tl-full rounded-br-sm opacity-90 origin-right border border-[#7dd3fc]/60"
              style={{
                animation: `flapLeft ${b.flutterSpeed}s ease-in-out infinite`,
              }}
            />

            {/* Butterfly Thorax / Center body */}
            <div className="w-[2px] h-3 bg-[#e0f2fe] rounded-full mx-[0.5px] shadow-[0_0_4px_#38bdf8]" />

            {/* Right Wing */}
            <div
              className="w-4 h-4 bg-gradient-to-tl from-[#0284c7] via-[#38bdf8] to-[#a5f3fc] rounded-tr-full rounded-bl-sm opacity-90 origin-left border border-[#7dd3fc]/60"
              style={{
                animation: `flapRight ${b.flutterSpeed}s ease-in-out infinite`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
