import React, { useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDuration: number;
  delay: number;
}

export const StarryBackground: React.FC = () => {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 90 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() < 0.2 ? 2.5 : Math.random() < 0.6 ? 1.8 : 1.2,
      opacity: 0.35 + Math.random() * 0.65,
      twinkleDuration: 2 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#070a12]">
      {/* Deep atmospheric navy gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,rgba(14,35,65,0.45),rgba(7,10,18,1)_85%)]" />

      {/* Subtle warm ember / neon drift accent in lower center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes shootingStar {
          0% {
            transform: translateX(0) translateY(0) rotate(-35deg) scaleX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateX(-40px) translateY(30px) rotate(-35deg) scaleX(1);
          }
          30% {
            transform: translateX(-160px) translateY(120px) rotate(-35deg) scaleX(0.5);
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow:
              star.size > 2
                ? '0 0 4px #bae6fd, 0 0 8px #38bdf8'
                : '0 0 2px #e0f2fe',
            animation: `twinkle ${star.twinkleDuration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Occasional Shooting Star */}
      <div
        className="absolute top-[18%] right-[15%] w-24 h-[1.5px] bg-gradient-to-l from-transparent via-[#38bdf8] to-white rounded-full pointer-events-none"
        style={{
          animation: 'shootingStar 7s ease-in-out infinite 2s',
          filter: 'drop-shadow(0 0 6px #00f2fe)',
        }}
      />
      <div
        className="absolute top-[32%] right-[40%] w-20 h-[1.5px] bg-gradient-to-l from-transparent via-[#ff8c00] to-white rounded-full pointer-events-none"
        style={{
          animation: 'shootingStar 9s ease-in-out infinite 5s',
          filter: 'drop-shadow(0 0 6px #ff4500)',
        }}
      />
    </div>
  );
};
