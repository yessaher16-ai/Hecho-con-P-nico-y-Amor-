import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { HotWheelsCarSvg } from './HotWheelsCarSvg';
import bouquetImg from '../assets/images/hot_wheels_bouquet_1790741299099.jpg';
import { fireHotWheelsConfetti } from '../utils/confettiExplosion';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CardData {
  id: number;
  title: string;
  text: string;
  type: 'car-blue' | 'car-red' | 'bouquet';
}

export const CardModal: React.FC<CardModalProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const cards: CardData[] = [
    {
      id: 1,
      title: 'QUE TU CAMINO ESTÉ LLENO DE AVENTURAS',
      text: 'Curvas locas y metas cumplidas. Estaré contigo en cada una.',
      type: 'car-blue',
    },
    {
      id: 2,
      title: 'SI FUERAS UN HOT WHEELS...',
      text: 'Serías el más raro, valioso y con turbo emocional. No hay otro igual a ti en el mundo.',
      type: 'car-red',
    },
    {
      id: 3,
      title: 'CON MUCHO CARIÑO',
      text: 'Espero que este detalle ilumine tu día y te recuerde lo especial que eres para mí.',
      type: 'bouquet',
    },
    {
      id: 4,
      title: '¡FELIZ DÍA!',
      text: 'Nunca dejes de brillar con esa sonrisa tan hermosa. ¡Te quiero muchísimo!',
      type: 'bouquet',
    },
  ];

  // Trigger confetti explosion with mini Hot Wheels cars and neon sparks whenever card modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      // Slight delay to sync with modal entrance animation
      const timer = setTimeout(() => {
        fireHotWheelsConfetti();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Outer Glow container */}
      <div
        className="relative w-full max-w-sm sm:max-w-md bg-[#0a1120]/95 border-2 border-[#38bdf8] rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between text-center overflow-hidden shadow-[0_0_35px_rgba(56,189,248,0.5),inset_0_0_20px_rgba(56,189,248,0.15)]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Subtle decorative background light flare */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#00f2fe]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-[#ff4500]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Confetti celebration button (Top left) */}
        <button
          onClick={fireHotWheelsConfetti}
          title="¡Lanzar más confeti de carritos y chispas neón!"
          className="absolute top-4 left-4 p-2 text-[#ffd700] hover:text-white rounded-full bg-slate-900/70 border border-[#ffd700]/40 hover:border-[#ffd700] shadow-[0_0_12px_rgba(255,215,0,0.3)] transition-all cursor-pointer flex items-center gap-1.5 active:scale-90 group z-20"
        >
          <Sparkles className="w-4 h-4 text-[#ffd700] group-hover:rotate-12 transition-transform animate-pulse" />
          <span className="text-[10px] font-bold text-slate-300 hidden sm:inline">Confeti</span>
        </button>

        {/* Close Button X (Top right) */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 p-2 text-[#38bdf8] hover:text-white rounded-full bg-slate-900/60 border border-[#38bdf8]/40 hover:border-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.3)] transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Card Header Title */}
        <div className="w-full pt-2 min-h-[70px] flex items-center justify-center">
          <h2 className="text-base sm:text-lg font-black font-display tracking-wider uppercase text-[#38bdf8] text-glow-cyan leading-snug">
            {currentCard.title}
          </h2>
        </div>

        {/* Card Main Image / Visual Container */}
        <div className="w-full my-5 py-4 px-2 min-h-[200px] flex items-center justify-center relative">
          {currentCard.type === 'car-blue' && (
            <div className="w-full max-w-[280px] filter drop-shadow-[0_0_18px_rgba(56,189,248,0.9)] animate-float-gentle">
              <HotWheelsCarSvg color="blue" glow />
            </div>
          )}

          {currentCard.type === 'car-red' && (
            <div className="w-full max-w-[280px] filter drop-shadow-[0_0_18px_rgba(230,0,18,0.9)] animate-float-gentle">
              <HotWheelsCarSvg color="red" glow />
            </div>
          )}

          {currentCard.type === 'bouquet' && (
            <div className="relative w-52 h-52 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border border-[#38bdf8]/60 shadow-[0_0_20px_rgba(56,189,248,0.4)] group">
              <img
                src={bouquetImg}
                alt="Ramo de Hot Wheels con lazo rojo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-[#38bdf8] font-semibold border border-[#38bdf8]/30">
                <Sparkles className="w-3 h-3 text-[#ff8c00]" />
                <span>Hot Wheels</span>
              </div>
            </div>
          )}
        </div>

        {/* Card Body Text */}
        <div className="w-full px-2 min-h-[64px] flex items-center justify-center">
          <p className="text-sm sm:text-base font-semibold text-slate-200 leading-relaxed font-sans">
            {currentCard.text}
          </p>
        </div>

        {/* Navigation & Pagination Controls (Bottom) */}
        <div className="w-full mt-6 pt-3 flex items-center justify-between border-t border-slate-800/80">
          <button
            onClick={handlePrev}
            aria-label="Tarjeta anterior"
            className="p-2 text-[#38bdf8] hover:text-white rounded-full bg-slate-900/60 border border-[#38bdf8]/40 hover:border-[#38bdf8] transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Indicator Dots */}
          <div className="flex items-center gap-2">
            {cards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ir a tarjeta ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? 'w-7 bg-[#38bdf8] shadow-[0_0_10px_#00f2fe]'
                    : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Siguiente tarjeta"
            className="p-2 text-[#38bdf8] hover:text-white rounded-full bg-slate-900/60 border border-[#38bdf8]/40 hover:border-[#38bdf8] transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
