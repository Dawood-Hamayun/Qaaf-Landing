"use client";

import { motion, useReducedMotion } from "framer-motion";

// Subtle Arabic glyphs scattered across the hero's background, like
// motes in candlelight. They're all high-frequency words from the
// Quran's vocabulary — the things Qaaf actually teaches — so the
// surface itself hints at the content.
//
// Positions are tuned to avoid the central column where the headline
// and phones live. Opacity stays low so the layer reads as texture,
// not content.
const GLYPHS = [
  { char: "ٱللَّٰه", x: "6%", y: "14%", size: 84, rotate: -8, dur: 11 },
  { char: "رَبّ", x: "90%", y: "10%", size: 64, rotate: 6, dur: 9 },
  { char: "نُور", x: "4%", y: "44%", size: 72, rotate: 4, dur: 13 },
  { char: "يَوْم", x: "92%", y: "40%", size: 56, rotate: -5, dur: 10 },
  { char: "قَالَ", x: "13%", y: "72%", size: 60, rotate: 3, dur: 12 },
  { char: "كِتَاب", x: "85%", y: "70%", size: 70, rotate: -3, dur: 14 },
  { char: "خَيْر", x: "20%", y: "26%", size: 44, rotate: 5, dur: 10 },
  { char: "آيَة", x: "78%", y: "26%", size: 46, rotate: -4, dur: 11 },
  { char: "إِلَٰه", x: "8%", y: "88%", size: 50, rotate: 2, dur: 13 },
  { char: "مَلِك", x: "88%", y: "88%", size: 50, rotate: -6, dur: 9 },
];

export function FloatingGlyphs() {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {GLYPHS.map((g, i) => (
        <motion.span
          key={i}
          className="absolute font-arabic select-none text-amber-deep/[0.18] dark:text-amber/[0.11]"
          style={{
            left: g.x,
            top: g.y,
            fontSize: g.size,
            transform: `rotate(${g.rotate}deg)`,
            filter: "blur(1.5px)",
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0 }}
          animate={
            reduce
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  y: [0, -8, 0],
                }
          }
          transition={
            reduce
              ? { duration: 1.5, delay: 0.4 + i * 0.06 }
              : {
                  opacity: { duration: 2, delay: 0.4 + i * 0.06 },
                  y: {
                    duration: g.dur,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.4,
                  },
                }
          }
        >
          {g.char}
        </motion.span>
      ))}
    </div>
  );
}
