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
import { useEffect, useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Section 03 — How it works.
 *
 * Two layouts, picked at runtime after hydration:
 *
 *   MobileHowItWorks (default + below lg)
 *     · Vertical "chapter" stack. Each step is a self-contained
 *       chapter with a giant ghost step number, cinematic entrance,
 *       and an amber stroke that draws beneath the title.
 *     · No scroll subscriptions, no sticky, no horizontal scroll.
 *       Every animation is a single-fire `whileInView` on a
 *       compositor-only transform. Silky on iPhone and old hardware.
 *     · Rides on the user's existing scroll motion. People who skim
 *       still see the reveal because it happens naturally as the
 *       section passes through the viewport.
 *
 *   DesktopHowItWorks (lg+ post-hydration)
 *     · Scroll-pinned 300vh section with horizontal slide.
 *     · A "Keep scrolling ↓" cue at the bottom-center of the pinned
 *       viewport tells the user that vertical scroll drives the
 *       horizontal motion. The cue fades as you approach the last slide.
 *     · Desktop input devices (mouse wheel, trackpad) handle this
 *       pattern gracefully, and the wow of horizontal motion is part
 *       of the section's identity.
 *
 * Why two components instead of CSS-only swap: `display: none` does
 * not unmount the React tree, so `useScroll` would still subscribe to
 * scroll events on phones. The conditional render unmounts the desktop
 * tree entirely on mobile so phones pay zero cost for the pinned
 * layout they will never see.
 */

export function HowItWorks() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // SSR + pre-hydration paints mobile so phones never even briefly
  // mount the scroll-pin tree.
  if (!mounted || !isDesktop) return <MobileHowItWorks />;
  return <DesktopHowItWorks />;
}

/* ---------- shared data ---------- */

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

/* ---------- mobile: vertical chapters ---------- */

function MobileHowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden py-24 sm:py-32">
      {/* Section kicker + title */}
      <header className="mx-auto mb-20 max-w-3xl px-5 text-center sm:mb-24 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-5 flex items-center justify-center gap-2.5 text-[10px] uppercase tracking-[0.22em] text-amber sm:text-xs"
        >
          <span className="inline-block h-px w-6 bg-amber/60" />
          The practice
          <span className="inline-block h-px w-6 bg-amber/60" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="font-serif text-[2.1rem] leading-[1.05] tracking-tight text-ink sm:text-5xl"
        >
          Three small steps.{" "}
          <span className="italic text-amber">That&apos;s it.</span>
        </motion.h2>
      </header>

      {/* Chapter stack */}
      <div className="relative mx-auto max-w-3xl px-5 sm:px-6">
        <div className="flex flex-col gap-28 sm:gap-36">
          {SLIDES.map((slide, i) => (
            <StepChapter key={slide.index} slide={slide} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepChapter({ slide, index }: { slide: Slide; index: number }) {
  const reduce = useReducedMotion();
  const isEven = index % 2 === 0;
  const Visual = slide.Visual;

  return (
    <article className="relative">
      {/* Giant ghost step number */}
      <motion.span
        aria-hidden
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
        whileInView={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.3, ease: EASE }}
        className={`pointer-events-none absolute -top-10 z-0 select-none font-serif text-[7.5rem] leading-none tracking-tight text-amber/[0.07] sm:-top-14 sm:text-[11rem] dark:text-amber/[0.08] ${
          isEven ? "right-0 sm:-right-2" : "left-0 sm:-left-2"
        }`}
      >
        {slide.index}
      </motion.span>

      <div className="relative z-10 flex flex-col items-center gap-10 text-center sm:gap-14">
        {/* Step badge */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-serif text-sm italic text-amber sm:text-base"
        >
          Step {slide.index}
          <span className="ml-2 text-ink-mute/60 not-italic">/ 03</span>
        </motion.p>

        {/* Title */}
        <div className="flex flex-col items-center">
          <motion.h3
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.9, delay: 0.05, ease: EASE }}
            className="font-serif text-[2rem] leading-[1.04] tracking-tight text-ink sm:text-[2.6rem]"
          >
            {slide.title}
          </motion.h3>

          {/* Calligraphic amber stroke */}
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
            className="mt-5 block h-px w-20 origin-center bg-gradient-to-r from-amber/0 via-amber/80 to-amber/0 sm:w-28"
            aria-hidden
          />
        </div>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="max-w-md text-[15px] leading-relaxed text-ink-dim sm:text-base"
        >
          {slide.body}
        </motion.p>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-[400px]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-6 -bottom-3 -z-10 h-12 rounded-full bg-amber/35 blur-xl"
          />
          <motion.div
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 30, scale: 0.96, rotateX: 6 }
            }
            whileInView={
              reduce
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1, rotateX: 0 }
            }
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.05, ease: EASE }}
            style={{ transformPerspective: 1200 }}
          >
            <Visual />
          </motion.div>
        </div>
      </div>
    </article>
  );
}

/* ---------- desktop: scroll-pinned horizontal ---------- */

function DesktopHowItWorks() {
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

  // The "Keep scrolling ↓" cue fades out as the user nears the last slide.
  const cueOpacity = useTransform(scrollYProgress, [0, 0.55, 0.8], [1, 1, 0]);

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
        {/* Header */}
        <div className="mx-auto w-full max-w-6xl px-6 pt-28">
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

        {/* Slides */}
        <div className="flex flex-1 items-center">
          <motion.div
            style={
              reduce
                ? undefined
                : {
                    x,
                    willChange: "transform",
                  }
            }
            className="flex h-full items-center"
          >
            {SLIDES.map((slide, i) => (
              <DesktopSlide
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

        {/* Scroll-down cue */}
        <motion.div
          aria-hidden
          style={reduce ? undefined : { opacity: cueOpacity }}
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ScrollCue />
        </motion.div>
      </div>
    </section>
  );
}

function ScrollCue() {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] uppercase tracking-[0.28em] text-ink-mute">
        Keep scrolling
      </span>
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="text-amber"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </div>
  );
}

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

function DesktopSlide({
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
  const center = total === 1 ? 0.5 : index / (total - 1);
  const window = 0.5;

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
    <div className="flex h-full w-screen shrink-0 items-center">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 items-center gap-20 px-6">
        <motion.div
          style={reduce ? undefined : { opacity, y }}
          className="order-1"
        >
          <p className="mb-4 font-serif text-base italic text-amber">
            Step {slide.index}
            <span className="ml-2 text-ink-mute/60 not-italic">/ 03</span>
          </p>
          <h3 className="font-serif text-[3.5rem] leading-[1.04] tracking-tight text-ink">
            {slide.title}
          </h3>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-dim">
            {slide.body}
          </p>
        </motion.div>

        <motion.div
          style={reduce ? undefined : { opacity, scale }}
          className="relative order-2 mx-auto flex h-[560px] w-full max-w-[440px] items-center justify-center"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-2 -inset-y-4 -z-10 rounded-[2rem] bg-amber/20 blur-3xl"
          />
          <Visual />
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- visuals (shared by both layouts) ---------- */

function SessionPickerVisual() {
  const options = [
    { n: 2, sub: "Gentle" },
    { n: 3, sub: "Steady", recommended: true },
    { n: 5, sub: "Faster" },
  ];

  return (
    <div className="relative w-full max-w-[420px]">
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
    <div className="relative w-full max-w-[440px]">
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-phone"
        style={{ aspectRatio: "1344/824" }}
      >
        {/* `priority` preloads the image at first paint via
            <link rel="preload">. Without it, the lazy-loader waits
            until the slide translates into view — too late for the
            desktop horizontal scroll where slides 2 and 3 sit at
            x: 100vw / 200vw on page load. */}
        <Image
          src="/mockups/word-ayah-light.jpeg"
          alt="A word in the verse where it lives"
          fill
          priority
          sizes="(min-width: 1024px) 440px, (min-width: 640px) 400px, 90vw"
          className="object-cover dark:hidden"
        />
        <Image
          src="/mockups/word-ayah-dark.jpeg"
          alt="A word in the verse where it lives"
          fill
          priority
          sizes="(min-width: 1024px) 440px, (min-width: 640px) 400px, 90vw"
          className="hidden object-cover dark:block"
        />
      </div>
    </div>
  );
}

function ResumeVisual() {
  return (
    <div className="relative w-full max-w-[440px]">
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-phone"
        style={{ aspectRatio: "1344/896" }}
      >
        <Image
          src="/mockups/resume-card-light.jpeg"
          alt="Right where you left off"
          fill
          priority
          sizes="(min-width: 1024px) 440px, (min-width: 640px) 400px, 90vw"
          className="object-cover dark:hidden"
        />
        <Image
          src="/mockups/resume-card-dark.jpeg"
          alt="Right where you left off"
          fill
          priority
          sizes="(min-width: 1024px) 440px, (min-width: 640px) 400px, 90vw"
          className="hidden object-cover dark:block"
        />
      </div>
    </div>
  );
}
