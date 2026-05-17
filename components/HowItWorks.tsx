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
 * Two completely different layouts, picked at runtime:
 *
 *   MobileHowItWorks (default + < lg)
 *     · Plain vertical stack. Each slide reveals on whileInView.
 *     · No sticky parent, no useScroll subscription, no scroll-driven
 *       transforms, no blur-3xl.
 *     · Smooth on any iPhone, including older A-series silicon, because
 *       the browser is just doing native vertical scroll.
 *
 *   DesktopHowItWorks (≥ lg, post-hydration)
 *     · Scroll-pinned 300vh section with horizontal slide.
 *     · Adds a "Scroll ↓" cue at the bottom-center so people understand
 *       that vertical scrolling drives the horizontal motion.
 *     · The cue fades out as you reach the last slide.
 *
 * Why two components instead of CSS-only swap? Because hiding the
 * desktop tree with `display:none` doesn't stop React from running
 * `useScroll` and its rAF subscription. The mobile lag was largely
 * because every phone was still paying for that subscription even
 * though the desktop layout was invisible. Conditional render
 * unmounts it entirely.
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

  // Default to mobile on first paint (SSR + pre-hydration) so phones
  // never even briefly mount the scroll-pin tree. Desktop users see
  // mobile layout for one frame before the swap — acceptable.
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

/* ---------- mobile ---------- */

/**
 * Mobile experience: native CSS snap carousel.
 *
 * Why this and not a vertical stack:
 *   · The horizontal motion was part of the wow on desktop. Losing it
 *     entirely on mobile felt flat. A snap carousel preserves the
 *     "three crafted screens" feeling without the lag of scroll-pinning.
 *   · Native `scroll-snap-type: x mandatory` is GPU-accelerated by the
 *     browser. There is no JS scroll subscription, no useScroll, no
 *     per-frame transform. Old A-series iPhones handle it without
 *     dropped frames.
 *   · The gesture is unambiguous. Horizontal cards with peek edges
 *     and a swipe arrow tell the user "swipe sideways" the moment
 *     the section enters view, eliminating the original "I didn't
 *     know I had to scroll down" confusion.
 *
 * What gives it the wow:
 *   · Neighbor cards peek in on each side, so the carousel reads as
 *     a stack you're moving through rather than discrete slides.
 *   · Active card scales to 1 with a soft amber underglow. Inactive
 *     cards sit at scale 0.92 with reduced opacity, so the active
 *     one visibly "lifts." Transitions are CSS-only (transform +
 *     opacity), which composite without paint cost.
 *   · A morphing stepper at the bottom (dot → bar for the active
 *     step) gives instant feedback as you swipe.
 *   · A subtle "Swipe →" hint pulses above the carousel until you
 *     interact, then fades out.
 *
 * Active state is driven by IntersectionObserver against the scroll
 * track. It fires only on threshold crossings (3 events per full
 * sweep), not every frame.
 */
function MobileHowItWorks() {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the highest intersection ratio above the
        // threshold. Avoids flicker when two cards are partially visible.
        let best: { idx: number; ratio: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = Number((entry.target as HTMLElement).dataset.idx);
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { idx, ratio: entry.intersectionRatio };
          }
        }
        if (best) setActive(best.idx);
      },
      {
        root,
        // Multiple thresholds so we get a clean activation as the card
        // crosses the midline of the viewport.
        threshold: [0.5, 0.7, 0.9],
      }
    );

    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function goTo(i: number) {
    setHasInteracted(true);
    const el = slideRefs.current[i];
    el?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  function handleScroll() {
    if (!hasInteracted) setHasInteracted(true);
  }

  return (
    <section id="how" className="relative py-16 sm:py-20">
      {/* Header */}
      <div className="mx-auto mb-8 max-w-3xl px-5 sm:mb-10 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.22em] text-amber">
            The practice
          </span>
          <span className="block h-px w-8 bg-amber/30" />
        </div>
        <h2 className="mt-4 font-serif text-[1.9rem] leading-[1.06] tracking-tight text-ink sm:text-[2.2rem]">
          Three small steps.{" "}
          <span className="italic text-amber">That&apos;s it.</span>
        </h2>
      </div>

      {/* Swipe hint — fades out after first interaction */}
      <div
        className="mb-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.22em] text-ink-mute transition-opacity duration-500"
        style={{ opacity: hasInteracted ? 0 : 1 }}
        aria-hidden
      >
        <span>Swipe</span>
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-flex text-amber"
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
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </motion.span>
      </div>

      {/* Carousel track. Native scroll-snap, no JS scroll handler. */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onTouchStart={handleScroll}
        className="no-scrollbar flex snap-x snap-mandatory scroll-smooth overflow-x-auto overscroll-x-contain pb-6 pt-2"
        style={{
          // iOS momentum scroll — the implicit default in modern Safari
          // is fine, but this hint keeps it consistent in older WKWebViews.
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Leading spacer so the first card snaps to center */}
        <div
          aria-hidden
          className="shrink-0"
          style={{ width: "calc((100vw - min(22rem, 88vw)) / 2)" }}
        />

        {SLIDES.map((slide, i) => (
          <article
            key={slide.index}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            data-idx={i}
            className="snap-center shrink-0 px-2"
            style={{ width: "min(22rem, 88vw)" }}
          >
            <SnapCard slide={slide} active={i === active} />
          </article>
        ))}

        {/* Trailing spacer so the last card snaps to center */}
        <div
          aria-hidden
          className="shrink-0"
          style={{ width: "calc((100vw - min(22rem, 88vw)) / 2)" }}
        />
      </div>

      {/* Morphing stepper. Tap a dot to jump. */}
      <div className="mx-auto mt-4 flex max-w-3xl items-center justify-center gap-2 px-5">
        {SLIDES.map((_, i) => {
          const isActive = i === active;
          const isPast = i < active;
          return (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to step ${i + 1}`}
              className="group flex h-6 items-center justify-center px-1"
            >
              <span
                className="block h-[3px] rounded-full transition-all duration-500"
                style={{
                  width: isActive ? 32 : 8,
                  backgroundColor: isActive
                    ? "rgb(var(--amber))"
                    : isPast
                      ? "rgb(var(--amber) / 0.45)"
                      : "rgb(var(--ink) / 0.18)",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Step counter beneath the dots — gives the "3 of 3" finality feel */}
      <p className="mt-3 text-center font-serif text-sm italic text-ink-mute">
        <span className="text-amber">{String(active + 1).padStart(2, "0")}</span>
        <span className="ml-1.5 text-ink-mute/60 not-italic">
          / {String(SLIDES.length).padStart(2, "0")}
        </span>
      </p>
    </section>
  );
}

/* ---------- mobile snap card ----------
   One card in the carousel. Active state is just a transform + opacity
   change, both compositor-only operations. The amber underglow is a
   small `blur-xl` (not blur-3xl) which mobile GPUs handle without
   breaking a sweat. */

function SnapCard({ slide, active }: { slide: Slide; active: boolean }) {
  const { Visual } = slide;
  return (
    <div
      className="relative will-change-transform"
      style={{
        transform: active ? "scale(1)" : "scale(0.92)",
        opacity: active ? 1 : 0.55,
        transition:
          "transform 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Soft amber halo — visible only when this card is the active one */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 -bottom-2 -z-10 h-14 rounded-full blur-xl transition-opacity duration-500"
        style={{
          background: "rgb(var(--amber) / 0.35)",
          opacity: active ? 1 : 0,
        }}
      />

      {/* Card surface */}
      <div className="rounded-3xl border border-hairline/15 bg-bg-card p-5 sm:p-6 dark:border-amber/15">
        <p className="font-serif text-sm italic text-amber">
          Step {slide.index}
          <span className="ml-2 text-ink-mute/60 not-italic">/ 03</span>
        </p>
        <h3 className="mt-2 font-serif text-[1.55rem] leading-[1.12] tracking-tight text-ink sm:text-[1.75rem]">
          {slide.title}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-dim sm:text-[15px]">
          {slide.body}
        </p>

        {/* Visual — constrained so it never overflows the card */}
        <div className="mt-5 flex items-center justify-center">
          <div className="w-full max-w-[280px]">
            <Visual />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- desktop ---------- */

function DesktopHowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    ["0vw", "0vw", "-200vw", "-200vw"],
  );

  // Scroll cue fades out as the user nears the last slide.
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

        {/* Scroll-down cue. Tells the user vertical scroll drives the
            horizontal motion. Fades out near the last slide. */}
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

/* ---------- atoms ---------- */

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
    <div className="group relative w-full max-w-[440px]">
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-phone"
        style={{ aspectRatio: "1344/824" }}
      >
        <Image
          src="/mockups/word-ayah-light.jpeg"
          alt="A word in the verse where it lives"
          fill
          sizes="(min-width: 1024px) 440px, (min-width: 640px) 400px, 90vw"
          className="object-cover dark:hidden"
        />
        <Image
          src="/mockups/word-ayah-dark.jpeg"
          alt="A word in the verse where it lives"
          fill
          sizes="(min-width: 1024px) 440px, (min-width: 640px) 400px, 90vw"
          className="hidden object-cover dark:block"
        />
      </div>
    </div>
  );
}

function ResumeVisual() {
  return (
    <div className="group relative w-full max-w-[440px]">
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-phone"
        style={{ aspectRatio: "1344/896" }}
      >
        <Image
          src="/mockups/resume-card-light.jpeg"
          alt="Right where you left off"
          fill
          sizes="(min-width: 1024px) 440px, (min-width: 640px) 400px, 90vw"
          className="object-cover dark:hidden"
        />
        <Image
          src="/mockups/resume-card-dark.jpeg"
          alt="Right where you left off"
          fill
          sizes="(min-width: 1024px) 440px, (min-width: 640px) 400px, 90vw"
          className="hidden object-cover dark:block"
        />
      </div>
    </div>
  );
}
