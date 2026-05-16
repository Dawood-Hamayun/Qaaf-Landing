"use client";

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Section 04 — Words you'll meet.
 *
 * The number is the hero. A giant 9,815 counts up at the visual
 * center. Five word cards fan out from inside it. Each card has a
 * front face (the word + count) and a back face (the ayah the word
 * actually lives in, with the word highlighted in amber). They
 * auto-flip in sequence, one at a time — front → back → front, then
 * the next card takes its turn. Hover any card to freeze the cycle
 * and inspect at your own pace.
 *
 * Cards arrive by being dealt from a stacked center (Section's
 * "shuffled deck" entrance), then sit and auto-flip continuously.
 */

type Ayah = {
  surah: string;
  arabicBefore: string;
  arabicWord: string;
  arabicAfter: string;
  english: string;
};

type Word = {
  arabic: string;
  transliteration: string;
  meaning: string;
  count: number;
  ayah: Ayah;
};

const WORDS: Word[] = [
  {
    arabic: "ٱللَّه",
    transliteration: "Allāh",
    meaning: "God",
    count: 2699,
    ayah: {
      surah: "Al-Fātiḥah 1:1",
      arabicBefore: "بِسْمِ ",
      arabicWord: "ٱللَّهِ",
      arabicAfter: " ٱلرَّحْمَٰنِ",
      english: "In the name of Allah, the Most Merciful.",
    },
  },
  {
    arabic: "مِن",
    transliteration: "min",
    meaning: "from, of",
    count: 3226,
    ayah: {
      surah: "Al-Baqarah 2:5",
      arabicBefore: "هُدًۭى ",
      arabicWord: "مِّن",
      arabicAfter: " رَّبِّهِمْ",
      english: "Guidance from their Lord.",
    },
  },
  {
    arabic: "قَالَ",
    transliteration: "qāla",
    meaning: "he said",
    count: 1719,
    ayah: {
      surah: "Al-Baqarah 2:32",
      arabicBefore: "",
      arabicWord: "قَالُوا۟",
      arabicAfter: " سُبْحَٰنَكَ",
      english: "They said: Glory be to You.",
    },
  },
  {
    arabic: "رَبّ",
    transliteration: "Rabb",
    meaning: "Lord",
    count: 975,
    ayah: {
      surah: "Al-Fātiḥah 1:2",
      arabicBefore: "ٱلْحَمْدُ لِلَّهِ ",
      arabicWord: "رَبِّ",
      arabicAfter: " ٱلْعَٰلَمِينَ",
      english: "All praise is for Allah, Lord of all worlds.",
    },
  },
  {
    arabic: "ٱلَّذِي",
    transliteration: "alladhī",
    meaning: "the one who",
    count: 1196,
    ayah: {
      surah: "Al-Mulk 67:2",
      arabicBefore: "",
      arabicWord: "ٱلَّذِى",
      arabicAfter: " خَلَقَ ٱلْمَوْتَ",
      english: "The One Who created death.",
    },
  },
];

const TOTAL = WORDS.reduce((sum, w) => sum + w.count, 0);

// Deal order — middle card first, then outward, like dealing tarot.
const DEAL_ORDER = [2, 1, 3, 0, 4];

// Auto-flip timings (ms).
const FLIP_HOLD_BACK = 2800; // how long the back face is shown
const FLIP_PAUSE_BETWEEN = 1100; // pause between one card flipping back and the next flipping
const FLIP_START_DELAY = 2800; // wait for deal to land before first flip
const FLIP_DURATION = 0.85; // seconds of the actual rotateY animation

export function OneWordUpClose() {
  return (
    <section
      id="words-youll-meet"
      className="relative isolate overflow-hidden py-28 sm:py-36 lg:py-44"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-amber/25 to-transparent"
      />

      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-5 inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-amber"
        >
          <span className="inline-block h-px w-6 bg-amber/60" />
          Words you&apos;ll meet
          <span className="inline-block h-px w-6 bg-amber/60" />
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="font-serif text-[2.2rem] leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
        >
          Five from{" "}
          <span className="italic text-amber">the five hundred.</span>
        </motion.h2>
      </div>

      <WordsStage />

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.8, ease: EASE, delay: 1.6 }}
        className="mx-auto mt-16 max-w-2xl px-6 text-center text-base leading-relaxed text-ink-dim sm:mt-20 sm:text-lg"
      >
        These five alone appear <span className="text-ink">9,815 times</span>{" "}
        in the Quran. About one percent of the curriculum.
      </motion.p>
    </section>
  );
}

/* ---------- stage ---------- */

function WordsStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(stageRef, { once: true, margin: "-15%" });
  const reduce = useReducedMotion();

  // Counter up.
  useEffect(() => {
    if (!inView || !numberRef.current) return;
    const node = numberRef.current;
    const controls = animate(0, TOTAL, {
      duration: 1.8,
      ease: EASE,
      onUpdate(value) {
        node.textContent = Math.round(value).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [inView]);

  // Auto-flip cycle.
  // - currentCardRef tracks which card flips next, so hover-pause
  //   doesn't reset the sequence.
  // - autoFlippedIndex is the index currently showing its back face.
  // - Hovering ANY card pauses the cycle and frees that card to
  //   show its back regardless.
  const [autoFlippedIndex, setAutoFlippedIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const currentCardRef = useRef(0);

  useEffect(() => {
    if (!inView || reduce) return;
    if (hoveredIndex !== -1) {
      // Pause the auto-flip while user is inspecting.
      setAutoFlippedIndex(-1);
      return;
    }

    const timeouts: number[] = [];

    const cycle = () => {
      // Flip current card to its back.
      setAutoFlippedIndex(currentCardRef.current);
      const tHoldBack = window.setTimeout(() => {
        // Flip it back to front.
        setAutoFlippedIndex(-1);
        const tPause = window.setTimeout(() => {
          // Advance to the next card and restart.
          currentCardRef.current =
            (currentCardRef.current + 1) % WORDS.length;
          cycle();
        }, FLIP_PAUSE_BETWEEN);
        timeouts.push(tPause);
      }, FLIP_HOLD_BACK);
      timeouts.push(tHoldBack);
    };

    const tStart = window.setTimeout(cycle, FLIP_START_DELAY);
    timeouts.push(tStart);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [inView, hoveredIndex, reduce]);

  return (
    <div
      ref={stageRef}
      className="relative mx-auto mt-16 flex w-full max-w-6xl flex-col items-center px-6 sm:mt-20"
    >
      {/* Giant 9,815 — smaller on mobile so it doesn't dominate */}
      <div className="relative flex h-[220px] w-full items-center justify-center sm:h-[300px] lg:h-[400px]">
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.92 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.1, ease: EASE }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        >
          <span
            ref={numberRef}
            className="font-serif text-[4.5rem] leading-none tracking-tight text-amber/[0.18] sm:text-[8rem] lg:text-[14rem] dark:text-amber/[0.18]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            0
          </span>
          <span className="mt-3 text-[9px] uppercase tracking-[0.22em] text-ink-mute sm:text-xs sm:tracking-[0.24em]">
            Word instances · from just five
          </span>
        </motion.div>

        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/15 blur-3xl sm:h-[360px] sm:w-[360px] lg:h-[400px] lg:w-[400px] dark:bg-amber/20"
        />
      </div>

      {/* Mobile: single-face cards that show EVERYTHING at once —
          the Arabic word AND the ayah it lives in. No flip, no
          gesture, no waiting. The flip is a desktop affordance that
          doesn't translate to touch — on mobile, showing both sides
          on the same face is cleaner and more informative. */}
      <div className="mt-6 flex w-full flex-col gap-4 sm:hidden">
        {WORDS.map((word, i) => (
          <MobileWordCard key={word.transliteration} word={word} index={i} />
        ))}
      </div>

      {/* sm+ grid — original card design with flip */}
      <div className="mt-2 hidden w-full grid-cols-3 gap-5 sm:grid lg:mt-6 lg:grid-cols-5">
        {WORDS.map((word, i) => (
          <WordCard
            key={word.transliteration}
            word={word}
            index={i}
            total={WORDS.length}
            inView={inView}
            reduce={!!reduce}
            isFlipped={autoFlippedIndex === i || hoveredIndex === i}
            onHoverStart={() => setHoveredIndex(i)}
            onHoverEnd={() => setHoveredIndex(-1)}
          />
        ))}
      </div>
    </div>
  );
}


/* ---------- mobile-only single-face card ---------- */

function MobileWordCard({ word, index }: { word: Word; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.7,
        ease: EASE,
        delay: index * 0.05,
      }}
      className="overflow-hidden rounded-2xl border border-hairline/15 bg-bg-card shadow-phone dark:border-amber/15"
    >
      {/* Header strip: position + count */}
      <div className="flex items-center justify-between border-b border-hairline/10 px-5 py-3 dark:border-amber/10">
        <span className="text-[10px] uppercase tracking-[0.22em] text-ink-mute">
          #{index + 1} of 05
        </span>
        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-amber">
          <span className="block h-1 w-1 rounded-full bg-amber" />
          {word.count.toLocaleString()}× in the Quran
        </span>
      </div>

      {/* Arabic word, centered. Fixed-height container so every card
          gets the same vertical footprint regardless of how tall the
          glyph + harakat stack is. leading-[1.4] reserves room for
          the diacritics above the baseline. */}
      <div className="flex flex-col items-center px-5 pb-7 pt-8">
        <div className="flex h-24 items-center justify-center">
          <span
            dir="rtl"
            className="font-arabic text-[3.25rem] leading-[1.4] text-ink"
          >
            {word.arabic}
          </span>
        </div>
        <p className="mt-3 font-serif text-lg italic text-ink-dim">
          {word.transliteration}
        </p>
        <p className="mt-1 text-sm text-ink-dim">{word.meaning}</p>
      </div>

      {/* Ayah preview — the "back of the card" lives here too */}
      <div className="border-t border-amber/10 bg-amber/[0.03] px-5 py-5 dark:bg-amber/[0.06]">
        <div className="mb-3 flex items-center gap-2">
          <span className="block h-px flex-1 bg-amber/20" />
          <span className="text-[9px] uppercase tracking-[0.22em] text-amber">
            {word.ayah.surah}
          </span>
          <span className="block h-px flex-1 bg-amber/20" />
        </div>
        <p
          dir="rtl"
          className="text-center font-arabic text-[1.05rem] leading-[2] text-ink-dim"
        >
          {word.ayah.arabicBefore}
          <span className="text-amber">{word.ayah.arabicWord}</span>
          {word.ayah.arabicAfter}
        </p>
        <p className="mt-2 text-center text-[12px] italic leading-relaxed text-ink-mute">
          {word.ayah.english}
        </p>
      </div>
    </motion.div>
  );
}

/* ---------- single card with flip ---------- */

function WordCard({
  word,
  index,
  total,
  inView,
  reduce,
  isFlipped,
  onHoverStart,
  onHoverEnd,
}: {
  word: Word;
  index: number;
  total: number;
  inView: boolean;
  reduce: boolean;
  isFlipped: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const mid = (total - 1) / 2;
  const offsetFromCenter = index - mid;
  const initialXPercent = -offsetFromCenter * 100;
  const initialRotate = (index % 2 === 0 ? 1 : -1) * (8 + index * 2);
  const restRotate = offsetFromCenter * 1.5;

  const dealPosition = DEAL_ORDER.indexOf(index);
  const delay = 0.85 + dealPosition * 0.14;

  return (
    <motion.div
      initial={
        reduce
          ? { opacity: 0 }
          : {
              opacity: 0,
              x: `${initialXPercent}%`,
              y: 0,
              rotate: initialRotate,
              scale: 0.78,
            }
      }
      animate={
        reduce
          ? { opacity: inView ? 1 : 0 }
          : inView
            ? {
                opacity: 1,
                x: "0%",
                y: 0,
                rotate: restRotate,
                scale: 1,
              }
            : undefined
      }
      transition={
        reduce
          ? { duration: 0.6 }
          : {
              type: "spring",
              stiffness: 180,
              damping: 22,
              mass: 1.1,
              delay,
            }
      }
      whileHover={reduce ? undefined : { y: -8, zIndex: 10 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      style={{ originX: 0.5, originY: 1 }}
      className="group relative aspect-[3/4] cursor-default"
    >
      {/* Perspective wrapper so rotateY reads as a 3D flip, not 2D shear */}
      <div
        className="relative h-full w-full"
        style={{ perspective: "1200px" }}
      >
        {/* Flip pivot. transformStyle preserve-3d keeps the back face
            on its own plane so backface-visibility works in all browsers. */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: FLIP_DURATION, ease: EASE }
          }
          style={{
            transformStyle: "preserve-3d",
            position: "relative",
            height: "100%",
            width: "100%",
          }}
        >
          <CardFace word={word} index={index} />
          <CardBack word={word} />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ---------- faces ---------- */

function CardFace({ word, index }: { word: Word; index: number }) {
  return (
    <div
      className="absolute inset-0 rounded-2xl border border-hairline/15 bg-bg-card shadow-phone dark:border-amber/15"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      <div className="flex h-full flex-col items-center justify-between px-5 py-7 text-center">
        <span className="text-[10px] uppercase tracking-[0.22em] text-ink-mute">
          #{index + 1}
        </span>

        <div className="flex flex-1 items-center justify-center">
          <span
            dir="rtl"
            className="font-arabic text-[2.75rem] leading-none text-ink sm:text-[3.25rem] lg:text-[2.75rem]"
          >
            {word.arabic}
          </span>
        </div>

        <div className="space-y-1">
          <p className="font-serif text-base italic leading-tight text-ink-dim">
            {word.transliteration}
          </p>
          <p className="text-sm leading-snug text-ink-dim">{word.meaning}</p>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-amber">
          <span className="block h-1 w-1 rounded-full bg-amber" />
          {word.count.toLocaleString()}× in the Quran
        </div>
      </div>
    </div>
  );
}

function CardBack({ word }: { word: Word }) {
  return (
    <div
      className="absolute inset-0 rounded-2xl border border-amber/40 bg-bg-card shadow-[0_30px_80px_-20px_rgba(232,184,106,0.4)]"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
      }}
    >
      <div className="flex h-full flex-col items-center justify-between px-4 py-6 text-center">
        <span className="text-[9px] uppercase tracking-[0.22em] text-amber">
          {word.ayah.surah}
        </span>

        <div className="flex flex-1 items-center justify-center">
          <p
            dir="rtl"
            className="font-arabic text-lg leading-loose text-ink-dim sm:text-xl"
          >
            {word.ayah.arabicBefore}
            <span className="text-amber">{word.ayah.arabicWord}</span>
            {word.ayah.arabicAfter}
          </p>
        </div>

        <p className="mt-3 text-[11px] italic leading-relaxed text-ink-mute sm:text-xs">
          {word.ayah.english}
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-ink-mute">
          <span className="block h-1 w-1 rounded-full bg-amber/60" />
          The verse it lives in
        </div>
      </div>
    </div>
  );
}
