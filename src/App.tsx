import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Gift, Disc3, Camera, CameraOff } from 'lucide-react';
import { StarryBackground } from './components/StarryBackground';
import { FloatingButterflies } from './components/FloatingButterflies';
import { SunflowerBouquet } from './components/SunflowerBouquet';
import { DiamondVase } from './components/DiamondVase';
import { OrbitingCars } from './components/OrbitingCars';
import { Preloader } from './components/Preloader';
import { CardModal } from './components/CardModal';
import { CameraARView } from './components/CameraARView';
import { audioManager } from './utils/audioSynthesizer';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicMode, setMusicMode] = useState<'tokyo-drift' | 'romantic'>('tokyo-drift');
  const [beatPulse, setBeatPulse] = useState(false);

  // Camera AR Placement State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [arScale, setArScale] = useState(1.0);
  const [arPosition, setArPosition] = useState({ x: 0, y: 0 });
  const [arRotation, setArRotation] = useState(0);

  const bouquetStageRef = useRef<HTMLDivElement | null>(null);

  // Initialize beat listener
  useEffect(() => {
    audioManager.setOnBeat((step) => {
      if (step % 4 === 0) {
        setBeatPulse(true);
        setTimeout(() => setBeatPulse(false), 120);
      }
    });
  }, []);

  const handleStartAudio = () => {
    audioManager.play();
    setIsPlayingMusic(true);
  };

  const handleToggleMusic = () => {
    const newState = audioManager.toggle();
    setIsPlayingMusic(newState);
  };

  const handleSwitchMusicMode = () => {
    const nextMode = musicMode === 'tokyo-drift' ? 'romantic' : 'tokyo-drift';
    audioManager.setMode(nextMode);
    setMusicMode(nextMode);
    if (!isPlayingMusic) {
      audioManager.play();
      setIsPlayingMusic(true);
    }
  };

  const handleToggleCamera = () => {
    setIsCameraActive((prev) => !prev);
  };

  const handleResetARTransform = () => {
    setArPosition({ x: 0, y: 0 });
    setArScale(1.0);
    setArRotation(0);
  };

  return (
    <main className="fixed inset-0 w-full h-[100dvh] overflow-hidden bg-[#070a12] text-white flex flex-col justify-between items-center select-none">
      {/* --- PRELOADER --- */}
      {loading && (
        <Preloader
          onComplete={() => setLoading(false)}
          onStartAudio={handleStartAudio}
        />
      )}

      {/* --- CAMERA AR VIEW (Replaces galaxy background when active) --- */}
      <CameraARView
        isActive={isCameraActive}
        onClose={() => setIsCameraActive(false)}
        scale={arScale}
        onScaleChange={setArScale}
        position={arPosition}
        onPositionChange={setArPosition}
        rotation={arRotation}
        onRotationChange={setArRotation}
        onResetTransform={handleResetARTransform}
        bouquetContainerRef={bouquetStageRef}
      />

      {/* --- BACKGROUND LAYER: STARS & PARTICLES (Hidden when camera is active) --- */}
      {!isCameraActive && <StarryBackground />}

      {/* --- FLOATING NEON CYAN BUTTERFLIES --- */}
      {!isCameraActive && <FloatingButterflies />}

      {/* --- APP CONTAINER (Guaranteed 100dvh flex column) --- */}
      <div className="relative w-full max-w-[480px] h-full flex flex-col justify-between items-center z-10 pt-2 pb-safe pointer-events-none">
        
        {/* --- HEADER (Fixed at top) --- */}
        <header className="flex-shrink-0 w-full text-center pt-1 px-4 z-20 flex flex-col items-center pointer-events-auto">
          {/* Main Title: Golden / Orange Glowing Cursive Script */}
          <h1 className="font-script text-2xl sm:text-3xl md:text-4xl text-[#ffd700] text-glow-orange leading-tight tracking-wide px-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Feliz día de los carritos Hot Wheels
          </h1>

          {/* Subtitle: Clean glowing cyan */}
          <p className="font-script text-base sm:text-lg text-[#38bdf8] text-glow-cyan mt-0.5 tracking-wider italic drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            {isCameraActive ? '✨ Coloca tu ramo en tu espacio físico ✨' : 'Ten tu ramo'}
          </p>

          {/* Current Track Pill Tag */}
          <div className="mt-1 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 border border-[#38bdf8]/40 backdrop-blur-md shadow-lg">
            <Disc3
              className={`w-3.5 h-3.5 ${
                isPlayingMusic ? 'text-[#ff4500] animate-spin' : 'text-slate-500'
              }`}
            />
            <button
              onClick={handleSwitchMusicMode}
              title="Cambiar pista musical"
              className="text-[11px] font-bold uppercase tracking-wider text-slate-200 hover:text-[#38bdf8] transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>{musicMode === 'tokyo-drift' ? '🎵 Tokyo Drift (Teriyaki Boyz)' : '💖 Romance Neón'}</span>
              <span className="text-[9px] text-[#ff8c00] underline ml-0.5">(Cambiar)</span>
            </button>
          </div>
        </header>

        {/* --- MAIN STAGE: BOUQUET, DIAMOND VASE & ORBITING CARS --- */}
        <div
          ref={bouquetStageRef}
          style={{
            transform: isCameraActive
              ? `translate3d(${arPosition.x}px, ${arPosition.y}px, 0) scale(${arScale}) rotate(${arRotation}deg)`
              : undefined,
            transformOrigin: 'center bottom',
          }}
          className={`relative flex-1 min-h-0 w-full flex flex-col justify-center items-center overflow-visible will-change-transform px-2 ${
            isCameraActive ? 'transition-none pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          {/* Inner positioning box holding bouquet, vase and cars centered together */}
          <div className="relative w-full max-w-[380px] flex flex-col items-center justify-center">
            {/* 4 Orbiting Hot Wheels Cars with glowing particle trails */}
            <OrbitingCars />

            {/* 5 Cyan Sunflowers with organic green stems */}
            <div className="relative z-10 w-full mb-[-26px] sm:mb-[-32px]">
              <SunflowerBouquet />
            </div>

            {/* 3D Geometric Translucent Cyan Diamond Vase */}
            <div
              className={`relative z-20 w-36 sm:w-44 transition-transform duration-150 ${
                beatPulse ? 'scale-[1.03]' : 'scale-100'
              }`}
            >
              <DiamondVase />

              {/* AR Physical Contact Shadow & Holographic Reticle Ring */}
              {isCameraActive && (
                <div className="absolute -bottom-2 w-44 h-9 -translate-x-1/2 left-1/2 pointer-events-none">
                  {/* Surface shadow */}
                  <div className="absolute inset-0 bg-black/75 blur-md rounded-[100%]" />
                  {/* Glowing cyan AR placement ring */}
                  <div className="absolute inset-1 border-2 border-dashed border-[#38bdf8] rounded-[100%] animate-pulse shadow-[0_0_15px_#00f2fe]" />
                  <div className="absolute inset-2 border border-[#ff8c00]/60 rounded-[100%]" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- DOCKED FOOTER BUTTONS (Always visible at the bottom) --- */}
        <footer className="flex-shrink-0 w-full max-w-[420px] flex items-center justify-around px-4 pb-4 sm:pb-6 pt-1 z-30 pointer-events-auto">
          {/* 1. Music Pause/Play Toggle */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleToggleMusic}
              aria-label={isPlayingMusic ? 'Pausar música' : 'Reproducir música'}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 cursor-pointer ${
                isPlayingMusic
                  ? 'bg-slate-950/90 border-[#38bdf8] text-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.7),inset_0_0_12px_rgba(56,189,248,0.3)] animate-pulse-slow'
                  : 'bg-slate-950/85 border-slate-700 text-slate-400 hover:text-[#38bdf8] hover:border-[#38bdf8]'
              }`}
            >
              {isPlayingMusic ? (
                <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse text-[#38bdf8]" />
              ) : (
                <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {isPlayingMusic ? 'Música ON' : 'Música OFF'}
            </span>
          </div>

          {/* 2. CAMERA AR TOGGLE BUTTON */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleToggleCamera}
              aria-label={isCameraActive ? 'Desactivar cámara' : 'Colocar ramo en tu espacio físico'}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 cursor-pointer ${
                isCameraActive
                  ? 'bg-gradient-to-tr from-[#ff4500] to-[#ff8c00] border-[#ffd700] text-white shadow-[0_0_24px_rgba(255,69,0,0.9)] scale-105 animate-pulse'
                  : 'bg-slate-950/90 border-[#38bdf8] text-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.65),inset_0_0_12px_rgba(56,189,248,0.3)] hover:scale-105 active:scale-95'
              }`}
            >
              {isCameraActive ? (
                <CameraOff className="w-7 h-7" />
              ) : (
                <Camera className="w-7 h-7" />
              )}
            </button>
            <span className={`text-[10px] font-black uppercase tracking-wider drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] ${
              isCameraActive ? 'text-[#ffd700]' : 'text-[#38bdf8]'
            }`}>
              {isCameraActive ? 'Cámara ON' : 'Tu Espacio'}
            </span>
          </div>

          {/* 3. Gift / Cards Dedication Modal */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => setIsModalOpen(true)}
              aria-label="Ver tarjetas de dedicatoria"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-slate-950/90 border-2 border-[#38bdf8] text-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.7),inset_0_0_12px_rgba(56,189,248,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
            >
              <Gift className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform text-[#38bdf8]" />
            </button>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Carta
            </span>
          </div>
        </footer>
      </div>

      {/* --- CARD CAROUSEL MODAL (Screen 3) --- */}
      <CardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
