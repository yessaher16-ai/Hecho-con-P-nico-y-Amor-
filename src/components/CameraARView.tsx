import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, FlipHorizontal, RotateCcw, ZoomIn, ZoomOut, Check, X, Download, RefreshCw, Sparkles } from 'lucide-react';

interface CameraARViewProps {
  isActive: boolean;
  onClose: () => void;
  scale: number;
  onScaleChange: (newScale: number) => void;
  position: { x: number; y: number };
  onPositionChange: (pos: { x: number; y: number }) => void;
  rotation: number;
  onRotationChange: (rot: number) => void;
  onResetTransform: () => void;
  bouquetContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const CameraARView: React.FC<CameraARViewProps> = ({
  isActive,
  onClose,
  scale,
  onScaleChange,
  position,
  onPositionChange,
  onResetTransform,
  bouquetContainerRef,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [useVirtualRoom, setUseVirtualRoom] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);

  // Gesture state for dragging
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Pinch-to-zoom distance tracking
  const initialPinchDistRef = useRef<number | null>(null);
  const initialPinchScaleRef = useRef<number>(1);

  // Start camera stream safely
  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    // Stop any existing tracks first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasPermission(false);
      return;
    }

    try {
      let stream: MediaStream;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
      } catch {
        // Fallback without constraints if specific facingMode fails
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setHasPermission(true);
      setUseVirtualRoom(false);
    } catch (err: unknown) {
      // Use warn rather than error to avoid false telemetry triggers when user denies permission
      console.warn('Camera permission status:', err);
      setHasPermission(false);
    }
  }, []);

  // Stop camera stream cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      setUseVirtualRoom(false);
      startCamera(facingMode);
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive, facingMode, startCamera, stopCamera]);

  // Flip camera between rear and front
  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Dragging event handlers for touch and mouse
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isLocked) return;
    if ((e.target as HTMLElement).closest('button, input')) return;

    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPosRef.current = { ...position };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || isLocked) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    onPositionChange({
      x: initialPosRef.current.x + dx,
      y: initialPosRef.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    }
  };

  // Touch pinch-to-zoom support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && !isLocked) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistRef.current = dist;
      initialPinchScaleRef.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistRef.current !== null && !isLocked) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / initialPinchDistRef.current;
      const newScale = Math.max(0.4, Math.min(1.8, initialPinchScaleRef.current * factor));
      onScaleChange(newScale);
    }
  };

  const handleTouchEnd = () => {
    initialPinchDistRef.current = null;
  };

  // Capture snapshot photo with bouquet in physical space
  const handleCapturePhoto = async () => {
    if (isCapturing) return;

    setIsCapturing(true);
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);

    try {
      const canvas = document.createElement('canvas');
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      canvas.width = screenW * 2;
      canvas.height = screenH * 2;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.scale(2, 2);

        // 1. Draw video background or room background
        if (hasPermission && videoRef.current && videoRef.current.readyState >= 2) {
          const video = videoRef.current;
          if (facingMode === 'user') {
            ctx.translate(screenW, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, screenW, screenH);
            ctx.setTransform(2, 0, 0, 2, 0, 0);
          } else {
            ctx.drawImage(video, 0, 0, screenW, screenH);
          }
        } else {
          // Simulated room background gradient with table
          const grad = ctx.createLinearGradient(0, 0, 0, screenH);
          grad.addColorStop(0, '#111827');
          grad.addColorStop(0.65, '#1e293b');
          grad.addColorStop(0.66, '#334155');
          grad.addColorStop(1, '#0f172a');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, screenW, screenH);
        }

        // 2. Render SVG bouquet overlay
        if (bouquetContainerRef.current) {
          const bouquetEl = bouquetContainerRef.current;
          const svgs = bouquetEl.querySelectorAll('svg');

          for (let i = 0; i < svgs.length; i++) {
            const svg = svgs[i];
            const svgRect = svg.getBoundingClientRect();
            const svgXml = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
            const svgUrl = URL.createObjectURL(svgBlob);

            await new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => {
                ctx.drawImage(img, svgRect.left, svgRect.top, svgRect.width, svgRect.height);
                URL.revokeObjectURL(svgUrl);
                resolve();
              };
              img.onerror = () => {
                URL.revokeObjectURL(svgUrl);
                resolve();
              };
              img.src = svgUrl;
            });
          }

          // Commemorative watermark
          ctx.font = 'bold 20px Montserrat, sans-serif';
          ctx.fillStyle = '#ffd700';
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 6;
          ctx.fillText('🌸 Feliz Día de los Carritos Hot Wheels 🏎️', 24, screenH - 28);
        }

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setCapturedPhotoUrl(dataUrl);
      }
    } catch (e) {
      console.warn('Snapshot capture notice:', e);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownloadPhoto = () => {
    if (!capturedPhotoUrl) return;
    const a = document.createElement('a');
    a.href = capturedPhotoUrl;
    a.download = `ramo-hot-wheels-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isActive) return null;

  return (
    <>
      {/* Background: Live Camera Stream OR Simulated Room Background */}
      <div
        className="fixed inset-0 z-0 overflow-hidden bg-black select-none pointer-events-auto"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {hasPermission && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              facingMode === 'user' ? '-scale-x-100' : ''
            }`}
          />
        )}

        {/* Realistic Virtual Room Backdrop when camera permission is unavailable or simulated */}
        {(!hasPermission || useVirtualRoom) && (
          <div className="absolute inset-0 bg-[#0c121e] flex flex-col justify-end">
            {/* Ambient Room Wall with warm lighting */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] opacity-90" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Simulated Modern Wooden Desk / Table Surface */}
            <div className="relative w-full h-[40%] bg-gradient-to-b from-[#2d2218] via-[#1f1710] to-[#120d09] border-t-4 border-[#ff8c00]/30 shadow-[0_-15px_30px_rgba(0,0,0,0.8)]">
              {/* Wood grain highlight */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,140,0,0.15),transparent_70%)]" />
              <div className="absolute top-2 left-6 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-[10px] text-amber-200/80 font-medium">
                Espacio Físico (Superficie de mesa)
              </div>
            </div>
          </div>
        )}

        {/* AR Camera HUD Viewfinder Grid */}
        <div className="absolute inset-0 pointer-events-none border-[10px] border-cyan-500/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)]">
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#38bdf8]/60" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#38bdf8]/60" />
          <div className="absolute bottom-20 left-4 w-6 h-6 border-b-2 border-l-2 border-[#38bdf8]/60" />
          <div className="absolute bottom-20 right-4 w-6 h-6 border-b-2 border-r-2 border-[#38bdf8]/60" />
        </div>

        {/* Shutter Flash Animation */}
        {flashEffect && (
          <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-ping" />
        )}
      </div>

      {/* Permission Blocked / Denied Friendly Notice (Non-blocking with virtual room fallback) */}
      {hasPermission === false && !useVirtualRoom && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 max-w-sm w-[92%] bg-slate-950/95 border border-[#38bdf8]/60 rounded-3xl p-5 text-center shadow-[0_0_35px_rgba(56,189,248,0.4)] backdrop-blur-xl">
          <div className="w-10 h-10 rounded-full bg-[#38bdf8]/15 border border-[#38bdf8]/40 mx-auto flex items-center justify-center text-[#38bdf8] mb-2.5">
            <Camera className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">
            Permiso de cámara no concedido
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Para usar la cámara en vivo, actívala tocando el candado 🔒 de tu navegador. O si lo prefieres, puedes colocar el ramo en nuestra habitación y mesa virtual:
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setUseVirtualRoom(true)}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-[#ff4500] to-[#ff8c00] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Usar Habitación Virtual</span>
            </button>

            <button
              onClick={() => startCamera(facingMode)}
              className="w-full py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-xs hover:border-[#38bdf8] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reintentar Permiso de Cámara</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-1.5 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Volver al cielo de estrellas
            </button>
          </div>
        </div>
      )}

      {/* --- FLOATING AR CONTROLS HUD (TOP & SIDEBAR) --- */}
      <div className="fixed top-3 right-3 z-30 flex flex-col gap-2 pointer-events-auto">
        {/* Flip Camera (only if camera active) */}
        {hasPermission && (
          <button
            onClick={handleToggleFacingMode}
            title="Cambiar Cámara (Frontal / Trasera)"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/85 border border-[#38bdf8]/60 text-[#38bdf8] flex items-center justify-center shadow-md backdrop-blur-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <FlipHorizontal className="w-5 h-5" />
          </button>
        )}

        {/* Reset Position */}
        <button
          onClick={onResetTransform}
          title="Centrar Ramo"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/85 border border-slate-700 text-slate-300 flex items-center justify-center backdrop-blur-md hover:text-[#38bdf8] hover:border-[#38bdf8] active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Lock/Unlock Dragging */}
        <button
          onClick={() => setIsLocked(!isLocked)}
          title={isLocked ? 'Desbloquear movimiento' : 'Fijar en esta posición'}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-95 transition-all cursor-pointer ${
            isLocked
              ? 'bg-[#ff8c00] border-[#ffd700] text-black shadow-lg font-bold'
              : 'bg-slate-900/85 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          {isLocked ? <Check className="w-5 h-5" /> : <span className="text-[9px] font-bold">FIJAR</span>}
        </button>
      </div>

      {/* Floating Instructions Tip Banner */}
      <div className="fixed top-18 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="px-3 py-1 rounded-full bg-slate-950/80 border border-[#38bdf8]/40 backdrop-blur-md shadow-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-ping" />
          <span className="text-[11px] font-semibold tracking-wide text-slate-200">
            {isLocked ? '🔒 Ramo fijado en tu espacio' : '👆 Arrastra o pellizca para colocar en tu mesa'}
          </span>
        </div>
      </div>

      {/* --- AR BOTTOM CONTROLS BAR (Above Footer) --- */}
      <div className="fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-sm flex items-center justify-between px-3.5 py-2 rounded-2xl bg-slate-950/90 border border-[#38bdf8]/50 shadow-[0_0_25px_rgba(56,189,248,0.35)] backdrop-blur-lg pointer-events-auto">
        {/* Scale Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onScaleChange(Math.max(0.4, scale - 0.1))}
            title="Reducir tamaño"
            className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-[#38bdf8] hover:border-[#38bdf8] transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono font-bold text-[#38bdf8] min-w-[34px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => onScaleChange(Math.min(1.8, scale + 0.1))}
            title="Aumentar tamaño"
            className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-[#38bdf8] hover:border-[#38bdf8] transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Shutter / Take Photo Button */}
        <button
          onClick={handleCapturePhoto}
          disabled={isCapturing}
          title="Tomar Foto en tu espacio"
          className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#ff4500] to-[#ff8c00] text-white font-bold text-xs shadow-[0_0_15px_rgba(255,69,0,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Camera className="w-4 h-4" />
          <span>Foto</span>
        </button>

        {/* Close AR / Return to Galaxy */}
        <button
          onClick={onClose}
          title="Salir del modo cámara"
          className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold hover:border-slate-500 transition-colors cursor-pointer"
        >
          Cerrar
        </button>
      </div>

      {/* --- PHOTO PREVIEW MODAL --- */}
      {capturedPhotoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in pointer-events-auto">
          <div className="relative w-full max-w-sm bg-[#0a1120] border-2 border-[#38bdf8] rounded-3xl p-5 flex flex-col items-center shadow-[0_0_35px_rgba(56,189,248,0.6)]">
            <button
              onClick={() => setCapturedPhotoUrl(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-[#38bdf8] text-glow-cyan mb-3">
              ¡Tu ramo en tu espacio real!
            </h3>

            <div className="w-full aspect-[9/16] max-h-[50vh] rounded-xl overflow-hidden border border-slate-700/80 shadow-inner mb-4">
              <img
                src={capturedPhotoUrl}
                alt="Foto del ramo Hot Wheels en tu espacio"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full flex items-center gap-3">
              <button
                onClick={handleDownloadPhoto}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4500] to-[#ff8c00] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,69,0,0.7)] flex items-center justify-center gap-1.5 hover:scale-102 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Guardar Foto</span>
              </button>
              <button
                onClick={() => setCapturedPhotoUrl(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold hover:text-white"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
