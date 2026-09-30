import confetti from 'canvas-confetti';

// Cached shapes
let cachedShapes: confetti.Shape[] | null = null;

function getConfettiShapes(): confetti.Shape[] {
  if (cachedShapes) return cachedShapes;

  const shapes: confetti.Shape[] = [];

  // 1. Sleek Hot Wheels Sports Car Vector Path
  try {
    if (typeof confetti.shapeFromPath === 'function') {
      const carPath = confetti.shapeFromPath({
        path: 'M 2 14 C 2 14 4 9 8 8 C 12 7 17 3 25 3 C 33 3 37 7 42 8 C 47 9 52 10 56 12 C 58 13 58 16 56 17 C 53 18 51 16 49 14 C 46 12 43 14 41 17 C 31 17 23 17 17 17 C 15 14 12 12 9 14 C 7 16 5 18 2 17 Z',
      });
      shapes.push(carPath);

      // 2. 4-point Neon Spark Vector Path
      const sparkPath = confetti.shapeFromPath({
        path: 'M 12 0 L 14.5 9.5 L 24 12 L 14.5 14.5 L 12 24 L 9.5 14.5 L 0 12 L 9.5 9.5 Z',
      });
      shapes.push(sparkPath);

      // 3. Curved Diamond Spark
      const diamondSparkPath = confetti.shapeFromPath({
        path: 'M 12 1 Q 12 12 23 12 Q 12 12 12 23 Q 12 12 1 12 Q 12 12 12 1 Z',
      });
      shapes.push(diamondSparkPath);
    }
  } catch (err) {
    console.warn('Custom path confetti not supported on this browser, using text/geometry fallback:', err);
  }

  // 4. Emoji shapes: Racing Car 🏎️ and Golden Sparkles ✨
  try {
    if (typeof confetti.shapeFromText === 'function') {
      const carEmoji = confetti.shapeFromText({ text: '🏎️', scalar: 2.2 });
      const smallCarEmoji = confetti.shapeFromText({ text: '🚗', scalar: 1.8 });
      const sparkEmoji = confetti.shapeFromText({ text: '✨', scalar: 1.9 });
      shapes.push(carEmoji, smallCarEmoji, sparkEmoji);
    }
  } catch (err) {
    console.warn('Text confetti not supported:', err);
  }

  // Standard geometric shapes fallback
  shapes.push('circle', 'square');

  cachedShapes = shapes;
  return shapes;
}

/**
 * Triggers a vibrant, multi-stage explosion of small Hot Wheels cars and neon sparks.
 */
export function fireHotWheelsConfetti() {
  const shapes = getConfettiShapes();

  // Neon palette matching Hot Wheels & Cyan aesthetic
  const neonColors = [
    '#00f2fe', // Neon Cyan
    '#38bdf8', // Sky Cyan
    '#ff4500', // Hot Wheels Flame Red-Orange
    '#ff8c00', // Neon Orange
    '#ffd700', // Electric Gold
    '#e60012', // Hot Wheels Red
    '#ec4899', // Neon Pink Spark
  ];

  // 1. Immediate central burst
  confetti({
    particleCount: 50,
    spread: 90,
    origin: { x: 0.5, y: 0.45 },
    colors: neonColors,
    shapes: shapes,
    scalar: 1.4,
    zIndex: 99999,
    ticks: 240,
    gravity: 0.85,
    startVelocity: 38,
    drift: 0,
  });

  // 2. Left and Right synchronized side cannons (bursting inward like fireworks)
  setTimeout(() => {
    // Left side cannon
    confetti({
      particleCount: 35,
      angle: 60,
      spread: 65,
      origin: { x: 0.15, y: 0.6 },
      colors: ['#ff4500', '#ffd700', '#00f2fe', '#e60012'],
      shapes: shapes,
      scalar: 1.6,
      zIndex: 99999,
      ticks: 280,
      gravity: 0.75,
      startVelocity: 42,
    });

    // Right side cannon
    confetti({
      particleCount: 35,
      angle: 120,
      spread: 65,
      origin: { x: 0.85, y: 0.6 },
      colors: ['#00f2fe', '#38bdf8', '#ff8c00', '#ffd700'],
      shapes: shapes,
      scalar: 1.6,
      zIndex: 99999,
      ticks: 280,
      gravity: 0.75,
      startVelocity: 42,
    });
  }, 220);

  // 3. Gentle shower of drifting neon cars & sparks falling from the top
  setTimeout(() => {
    confetti({
      particleCount: 30,
      spread: 120,
      origin: { x: 0.5, y: 0.1 },
      colors: neonColors,
      shapes: shapes,
      scalar: 1.3,
      zIndex: 99999,
      ticks: 300,
      gravity: 0.55,
      startVelocity: 18,
      drift: 0.1,
    });
  }, 500);
}
