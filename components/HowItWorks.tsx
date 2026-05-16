"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Section 03 — How it works.
 *
 * Horizontal scroll. The section is 300vh tall and pins a single
 * viewport for its full scroll range. Inside that viewport, three
 * slides sit in a horizontal flex row that translates left as the
 * user scrolls vertically. The motion is driven directly by
 * useScroll → useTransform → x — no setActive jumps, no AnimatePresence
 * cuts. The user scrolls, the cards slide. Pure scrub.
 *
 * A persistent header lives at the top of the pinned viewport with a
 * three-dot indicator that lights up as each slide enters frame. Each
 * slide gets its own treatment (HTML picker / ayah card image / resume
 * card image) — the mix is intentional, not inconsistency.
 */

type Slide = {
  index: string;
  title: string;
  body: string;
  Visual: () => React.ReactNode;
};

const SLIDES: Slide[] = [
  {
    index: "01",
    title: "Choose your pace",
    body: "Three words today, or just one. Whatever you'll actually do.",
    Visual: SessionPickerVisual,
  },
  {
    index: "02",
    title: "Meet the word",
    body: "Arabic. Transliteration. Meaning. The root it grows from, and the ayah where it lives.",
    Visual: AyahVisual,
  },
  {
    index: "03",
    title: "Return tomorrow",
    body: "We remember where you left off. You don't have to.",
    Visual: ResumeVisual,
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Three slides side by side. x goes 0vw → -200vw across the full
  // scroll range. A small clamp at start/end so the row doesn't slide
  // before/after the section is actually in the viewport.
  const x = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    ["0vw", "0vw", "-200vw", "-200vw"],
  );

  // Active slide for the dot indicator + step counter.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v < 0.38 ? 0 : v < 0.71 ? 1 : 2;
    if (next !== active) setActive(next);
  });

  return (
    <section
      id="how"
      ref={sectionRef}
      className="relative"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Header — pinned at top of the sticky viewport */}
        <div className="mx-auto w-full max-w-6xl px-6 pt-20 sm:pt-24 lg:pt-28">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-[0.22em] text-amber">
                The practice
              </span>
              <span className="block h-px w-12 bg-amber/30" />
            </div>
            <StepIndicator active={active} count={SLIDES.length} />
          </div>
        </div>

        {/* Slides — translateX driven by scrollYProgress */}
        <div className="flex flex-1 items-center">
          <motion.div
            style={reduce ? undefined : { x }}
            className="flex h-full items-center"
          >
            {SLIDES.map((slide, i) => (
              <Slide
                key={slide.index}
                slide={slide}
                index={i}
                total={SLIDES.length}
                scrollProgress={scrollYProgress}
                reduce={!!reduce}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- atoms ---------- */

function StepIndicator({ active, count }: { active: number; count: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-serif text-sm italic text-ink-mute">
        <span className="text-amber">
          {String(active + 1).padStart(2, "0")}
        </span>
        <span className="ml-1.5 text-ink-mute/60 not-italic">
          / {String(count).padStart(2, "0")}
        </span>
      </span>
      <div className="flex gap-1.5">
        {Array.from({ length: count }).map((_, i) => (
          <motion.span
            key={i}
            animate={{
              width: i === active ? 24 : 6,
              backgroundColor:
                i === active
                  ? "rgb(var(--amber))"
                  : i < active
                    ? "rgb(var(--amber) / 0.5)"
                    : "rgb(var(--ink) / 0.15)",
            }}
            transition={{ duration: 0.4, ease: EASE }}
            className="block h-[3px] rounded-full"
          />
        ))}
      </div>
    </div>
  );
}

function Slide({
  slide,
  index,
  total,
  scrollProgress,
  reduce,
}: {
  slide: Slide;
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
  reduce: boolean;
}) {
  const { Visual } = slide;

  // The point in scrollProgress at which THIS slide is dead-centered
  // in the viewport. Slide 0 is centered at progress 0, slide 1 at 0.5,
  // slide 2 at 1. (For 3 slides.)
  const center = total === 1 ? 0.5 : index / (total - 1);
  const window = 0.5; // how far on either side this slide is "active"

  // Each slide fades/scales based on distance from its center. Kept
  // intentionally subtle — neighbors stay readable so the section
  // doesn't feel like flashbulbs when scrolling. Pop the focused
  // card, gently soften the others.
  const opacity = useTransform(
    scrollProgress,
    [center - window, center, center + window],
    [0.55, 1, 0.55],
  );
  const scale = useTransform(
    scrollProgress,
    [center - window, center, center + window],
    [0.94, 1, 0.94],
  );
  const y = useTransform(
    scrollProgress,
    [center - window, center, center + window],
    [16, 0, 16],
  );

  return (
    <div className="flex h-full w-screen flex-shrink-0 items-center">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20">
        {/* Text */}
        <motion.div
          style={reduce ? undefined : { opacity, y }}
          className="order-2 lg:order-1"
        >
          <p className="mb-4 font-serif text-base italic text-amber">
            Step {slide.index}
            <span className="ml-2 text-ink-mute/60 not-italic">/ 03</span>
          </p>
          <h3 className="font-serif text-4xl leading-[1.04] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
            {slide.title}
          </h3>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-dim sm:text-lg">
            {slide.body}
          </p>
          <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-ink-mute/70">
            Scroll to continue
            <span className="ml-2 inline-block animate-pulse text-amber">↓</span>
          </p>
        </motion.div>

        {/* Visual */}
        <motion.div
          style={reduce ? undefined : { opacity, scale }}
          className="relative order-1 mx-auto flex h-[460px] w-full max-w-[440px] items-center justify-center lg:order-2 lg:h-[560px]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-2 -inset-y-4 -z-10 rounded-[2rem] bg-amber/15 blur-3xl dark:bg-amber/20"
          />
          <Visual />
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- visuals ---------- */

function SessionPickerVisual() {
  const options = [
    { n: 2, sub: "Gentle" },
    { n: 3, sub: "Steady", recommended: true },
    { n: 5, sub: "Faster" },
  ];

  return (
    <div className="relative w-full max-w-[400px]">
      <div className="rounded-[1.75rem] border border-hairline/15 bg-bg-card p-6 shadow-phone sm:p-7 dark:border-amber/15">
        <p className="text-[10px] uppercase tracking-[0.22em] text-amber">
          Daily practice
        </p>
        <h4 className="mt-3 font-serif text-2xl leading-tight tracking-tight text-ink sm:text-[1.7rem]">
          How many words, each day?
        </h4>
        <p className="mt-2 text-sm italic leading-relaxed text-ink-dim">
          About 10 minutes a day. At 3 words, the full 500 takes around 5
          months.
        </p>
        <div className="mt-5 flex flex-col gap-2.5">
          {options.map((opt) => (
            <div
              key={opt.n}
              className={[
                "flex items-center justify-between rounded-2xl border px-4 py-3 text-left",
                opt.recommended
                  ? "border-amber/60 bg-amber/[0.06] dark:bg-amber/[0.10]"
                  : "border-hairline/15 dark:border-amber/10",
              ].join(" ")}
            >
              <div>
                <div className="font-serif text-lg leading-tight text-ink">
                  {opt.n} words a day
                </div>
                <div className="mt-0.5 text-xs italic text-ink-mute">
                  {opt.sub}
                </div>
              </div>
              {opt.recommended ? (
                <span className="rounded-full border border-amber/40 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-amber">
                  Recommended
                </span>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber px-5 py-3 text-sm font-medium text-bg shadow-glow">
          Continue
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function AyahVisual() {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group relative w-full max-w-[440px]"
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-phone"
        style={{ aspectRatio: "1344/824" }}
      >
        <Image
          src="/mockups/word-ayah-light.jpeg"
          alt="A word in the verse where it lives"
          fill
          sizes="440px"
          unoptimized
          className="object-cover dark:hidden"
        />
        <Image
          src="/mockups/word-ayah-dark.jpeg"
          alt="A word in the verse where it lives"
          fill
          sizes="440px"
          unoptimized
          className="hidden object-cover dark:block"
        />
        {/* Amber wash on hover — the card "warms up" under the cursor */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-amber/0 transition-colors duration-500 group-hover:bg-amber/[0.06]"
        />
      </div>
      {/* Underglow that intensifies on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-4 -bottom-4 -z-10 h-12 rounded-[50%] bg-amber/30 opacity-50 blur-2xl transition-opacity duration-500 group-hover:opacity-90"
      />
    </motion.div>
  );
}

function ResumeVisual() {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group relative w-full max-w-[440px]"
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-phone"
        style={{ aspectRatio: "1344/896" }}
      >
        <Image
          src="/mockups/resume-card-light.jpeg"
          alt="Right where you left off"
          fill
          sizes="440px"
          unoptimized
          className="object-cover dark:hidden"
        />
        <Image
          src="/mockups/resume-card-dark.jpeg"
          alt="Right where you left off"
          fill
          sizes="440px"
          unoptimized
          className="hidden object-cover dark:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-amber/0 transition-colors duration-500 group-hover:bg-amber/[0.06]"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-4 -bottom-4 -z-10 h-12 rounded-[50%] bg-amber/30 opacity-50 blur-2xl transition-opacity duration-500 group-hover:opacity-90"
      />
    </motion.div>
  );
}
