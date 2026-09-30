import React, { useEffect, useState } from 'react';
import { HotWheelsCarSvg } from './HotWheelsCarSvg';

interface PreloaderProps {
  onComplete: () => void;
  onStartAudio: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete, onStartAudio }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'loading' | 'typewriter' | 'exiting'>('loading');
  const [typedText, setTypedText] = useState('');
  const fullText = 'FELIZ DÍA DE LOS CARRITOS HOT WHEELS, MI AMOR';

  // Smooth loading progression from 0 to 100%
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Faster start, steady middle, smooth ending
      const step = current < 30 ? 2 : current < 80 ? 3 : 2;
      current += step;

      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);

        // Transition to typewriter greeting (as seen in the video at 00:03)
        setTimeout(() => {
          setStage('typewriter');
        }, 400);
      } else {
        setProgress(current);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (stage === 'typewriter') {
      let charIdx = 0;
      const typeTimer = setInterval(() => {
        charIdx++;
        setTypedText(fullText.slice(0, charIdx));
        if (charIdx >= fullText.length) {
          clearInterval(typeTimer);
          // Wait 2.2 seconds then fade out to bouquet, or user can click anywhere
          setTimeout(() => {
            handleEnterScene();
          }, 2200);
        }
      }, 55);
      return () => clearInterval(typeTimer);
    }
  }, [stage]);

  const handleEnterScene = () => {
    if (stage === 'exiting') return;
    onStartAudio();
    setStage('exiting');
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  return (
    <div
      onClick={handleEnterScene}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070a12] transition-opacity duration-700 cursor-pointer ${
        stage === 'exiting' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Starry Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.8),#070a12_80%)]" />

      {/* --- STAGE 1: PROGRESS BAR & ACCELERATING CAR --- */}
      {stage === 'loading' && (
        <div className="relative w-full max-w-sm px-6 flex flex-col items-center z-10">
          {/* Blue Hot Wheels Sports Car positioned above progress bar, driving with progress */}
          <div className="w-full relative h-20 mb-2">
            <div
              className="absolute bottom-0 w-32 -translate-x-1/2 transition-all duration-100 ease-out"
              style={{
                left: `${Math.max(16, Math.min(84, progress))}%`,
              }}
            >
              <HotWheelsCarSvg color="blue" glow />
              {/* Exhaust flame/sparks */}
              <div className="absolute -left-3 bottom-3 w-4 h-2 bg-gradient-to-r from-transparent via-[#ff8c00] to-[#ffd700] rounded-full blur-[1px] animate-pulse" />
            </div>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-3 bg-slate-900/90 rounded-full overflow-hidden p-[2px] border border-slate-700/50 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#ff4500] via-[#ff8c00] to-[#ffd700] transition-all duration-100 ease-out"
              style={{
                width: `${progress}%`,
                boxShadow: '0 0 15px #ff4500, 0 0 30px #ff8c00',
              }}
            />
          </div>

          {/* Percentage Counter */}
          <div className="mt-5 text-2xl font-black font-display tracking-wider text-[#ff8c00] drop-shadow-[0_0_10px_rgba(255,140,0,0.8)]">
            {progress}%
          </div>

          {/* Text: "Acelerando..." */}
          <div className="mt-2 text-sm font-bold uppercase tracking-widest text-slate-300 italic flex items-center gap-1">
            <span>Acelerando</span>
            <span className="inline-block animate-pulse">.</span>
            <span className="inline-block animate-pulse delay-100">.</span>
            <span className="inline-block animate-pulse delay-200">.</span>
          </div>

          <div className="mt-6 text-[11px] text-slate-500 font-medium">
            (Toca en cualquier lugar para saltar)
          </div>
        </div>
      )}

      {/* --- STAGE 2: INTERLUDE TYPEWRITER WITH RED CAR (Exact from TikTok video) --- */}
      {stage === 'typewriter' && (
        <div className="relative w-full max-w-md px-6 flex flex-col items-center justify-center text-center z-10 animate-fade-in">
          {/* Red Hot Wheels Sports Car with glowing fiery halo */}
          <div className="w-48 mb-8 relative filter drop-shadow-[0_0_20px_rgba(230,0,18,0.8)] animate-float-gentle">
            <HotWheelsCarSvg color="red" glow />
          </div>

          {/* Typewriter Text with blinking neon cursor */}
          <h2 className="text-xl md:text-2xl font-black font-display tracking-wider text-[#ff8c00] drop-shadow-[0_0_12px_rgba(255,69,0,0.9)] max-w-xs leading-relaxed">
            {typedText}
            <span className="inline-block w-1.5 h-6 bg-[#ff8c00] ml-1.5 translate-y-1 animate-pulse shadow-[0_0_8px_#ff8c00]" />
          </h2>

          <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-[#38bdf8] animate-pulse">
            Toca la pantalla para recibir tu ramo 💐
          </p>
        </div>
      )}
    </div>
  );
};
