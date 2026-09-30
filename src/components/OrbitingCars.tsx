import React, { useEffect, useRef, useState } from 'react';
import { HotWheelsCarSvg } from './HotWheelsCarSvg';

interface CarOrbiter {
  id: number;
  color: 'blue' | 'red';
  a: number;       // Semi-major axis
  b: number;       // Semi-minor axis
  tilt: number;    // Angle tilt of orbit in radians
  speed: number;   // Angular velocity
  phase: number;   // Initial angle
  cx: number;      // Center X offset %
  cy: number;      // Center Y offset %
}

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
  color: 'blue' | 'red';
}

export const OrbitingCars: React.FC = () => {
  // Define 4 cars with different orbits as seen in the video
  const carsConfig: CarOrbiter[] = [
    // Car 1: Blue outer loop
    { id: 1, color: 'blue', a: 160, b: 90, tilt: -0.45, speed: 0.016, phase: 0, cx: 50, cy: 46 },
    // Car 2: Red outer loop (trailing blue car 1)
    { id: 2, color: 'red', a: 160, b: 90, tilt: -0.45, speed: 0.016, phase: Math.PI * 0.4, cx: 50, cy: 46 },
    // Car 3: Blue inner diagonal loop
    { id: 3, color: 'blue', a: 140, b: 75, tilt: 0.55, speed: 0.018, phase: Math.PI * 1.1, cx: 50, cy: 52 },
    // Car 4: Red inner diagonal loop (trailing blue car 3)
    { id: 4, color: 'red', a: 140, b: 75, tilt: 0.55, speed: 0.018, phase: Math.PI * 1.5, cx: 50, cy: 52 },
  ];

  const [carPositions, setCarPositions] = useState<
    {
      id: number;
      color: 'blue' | 'red';
      x: number;
      y: number;
      angle: number;
      scale: number;
      isFront: boolean;
    }[]
  >([]);

  const [trails, setTrails] = useState<TrailPoint[]>([]);
  const anglesRef = useRef<number[]>(carsConfig.map((c) => c.phase));
  const trailsRef = useRef<TrailPoint[]>([]);
  const frameCountRef = useRef(0);

  useEffect(() => {
    let animId: number;

    const animate = () => {
      frameCountRef.current++;
      const newPositions = carsConfig.map((cfg, idx) => {
        // Increment angle
        anglesRef.current[idx] += cfg.speed;
        const theta = anglesRef.current[idx];

        // Ellipse coordinates before tilt
        const rawX = cfg.a * Math.cos(theta);
        const rawY = cfg.b * Math.sin(theta);

        // Apply rotation tilt
        const cosT = Math.cos(cfg.tilt);
        const sinT = Math.sin(cfg.tilt);
        const x = rawX * cosT - rawY * sinT;
        const y = rawX * sinT + rawY * cosT;

        // Tangent derivative for car heading
        const dRawX = -cfg.a * Math.sin(theta);
        const dRawY = cfg.b * Math.cos(theta);
        const dx = dRawX * cosT - dRawY * sinT;
        const dy = dRawX * sinT + dRawY * cosT;
        const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

        // Depth: sin(theta) determines front vs back of the bouquet
        const isFront = Math.sin(theta) > 0;
        const scale = isFront ? 0.95 + Math.sin(theta) * 0.15 : 0.78 + (Math.sin(theta) + 1) * 0.08;

        // Add trail particle every 3 frames
        if (frameCountRef.current % 3 === 0) {
          trailsRef.current.push({
            x: 50 + (x / 400) * 100,
            y: cfg.cy + (y / 550) * 100,
            opacity: 0.9,
            color: cfg.color,
          });
        }

        return {
          id: cfg.id,
          color: cfg.color,
          x: 50 + (x / 400) * 100,
          y: cfg.cy + (y / 550) * 100,
          angle: angleDeg,
          scale,
          isFront,
        };
      });

      // Decay trails
      trailsRef.current = trailsRef.current
        .map((t) => ({ ...t, opacity: t.opacity - 0.035 }))
        .filter((t) => t.opacity > 0.05);

      if (frameCountRef.current % 2 === 0) {
        setTrails([...trailsRef.current]);
      }

      setCarPositions(newPositions);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {/* Light particle trails */}
      {trails.map((t, idx) => (
        <div
          key={idx}
          className="absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${t.x}%`,
            top: `${t.y}%`,
            width: `${t.color === 'blue' ? 5 : 6}px`,
            height: `${t.color === 'blue' ? 5 : 6}px`,
            backgroundColor: t.color === 'blue' ? '#38bdf8' : '#ff4500',
            opacity: t.opacity,
            boxShadow:
              t.color === 'blue'
                ? `0 0 10px #00f2fe, 0 0 18px #38bdf8`
                : `0 0 10px #ff4500, 0 0 18px #ffd700`,
            transition: 'opacity 0.1s linear',
          }}
        />
      ))}

      {/* Orbiting Hot Wheels cars */}
      {carPositions.map((car) => (
        <div
          key={car.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 will-change-transform pointer-events-none transition-all duration-75"
          style={{
            left: `${car.x}%`,
            top: `${car.y}%`,
            width: '92px',
            zIndex: car.isFront ? 35 : 5,
            transform: `translate(-50%, -50%) rotate(${car.angle}deg) scale(${car.scale})`,
            opacity: car.isFront ? 1 : 0.8,
            filter: car.isFront
              ? car.color === 'blue'
                ? 'drop-shadow(0 0 14px rgba(56, 189, 248, 0.95))'
                : 'drop-shadow(0 0 14px rgba(230, 0, 18, 0.95))'
              : 'drop-shadow(0 0 6px rgba(0, 0, 0, 0.5))',
          }}
        >
          <HotWheelsCarSvg color={car.color} />
        </div>
      ))}
    </div>
  );
};
