"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Section 06 — Your first six months.
 *
 * The whole timeline is rendered up-front but greyed/dimmed. As the
 * user scrolls, an amber line fills downward; a glowing marker rides
 * its leading edge. Each milestone illuminates — number, label, and
 * description — when the marker reaches it. Everything is driven from
 * a single `scrollYProgress` value via `useTransform`, so there are
 * no React re-renders and no count-up animations. Cleaner, calmer,
 * more cinematic.
 */

type Milestone = {
  time: string;
  value: number;
  description: string;
  emphasized?: boolean;
};

const MILESTONES: Milestone[] = [
  {
    time: "Week 01",
    value: 20,
    description: "The shape of the Quran starts to look familiar.",
  },
  {
    time: "Week 04",
    value: 80,
    description: "You begin to catch phrases in salah without thinking.",
  },
  {
    time: "Week 12",
    value: 250,
    description: "Whole ayahs start arriving with their meaning intact.",
  },
  {
    time: "Month 06",
    value: 500,
    description:
      "The Quran you've recited your whole life finally speaks back.",
    emphasized: true,
  },
];

export function YourSixMonths() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="path"
      ref={sectionRef}
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
          The path
          <span className="inline-block h-px w-6 bg-amber/60" />
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="font-serif text-[2.2rem] leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
        >
          Your first{" "}
          <span className="italic text-amber">six months.</span>
        </motion.h2>
      </div>

      <div className="relative mx-auto mt-20 max-w-3xl px-6 sm:mt-24 lg:mt-28">
        {/* Track + fill + marker share a single absolute wrapper so they
            sit in the same coordinate system. The marker's `top` is the
            same motion value as the fill's `height`, so it always sits
            at the exact bottom of the fill — no gap, no overshoot. */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-12 left-[28px] top-3 w-px sm:left-[34px]"
        >
          <div className="absolute inset-0 bg-ink/10 dark:bg-amber/15" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute top-0 w-px bg-amber"
          />
          <motion.div
            style={{ top: lineHeight }}
            className="absolute left-1/2 z-20 h-2 w-2 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="absolute inset-0 rounded-full bg-amber shadow-[0_0_18px_2px_rgba(232,184,106,0.7)]" />
            <span className="absolute -inset-2 rounded-full bg-amber/30 blur-md" />
          </motion.div>
        </div>

        <ol className="relative space-y-20 sm:space-y-24">
          {MILESTONES.map((m, i) => (
            <MilestoneRow
              key={m.time}
              milestone={m}
              index={i}
              total={MILESTONES.length}
              scrollProgress={scrollYProgress}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- single milestone ---------- */

function MilestoneRow({
  milestone,
  index,
  total,
  scrollProgress,
}: {
  milestone: Milestone;
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const isLast = index === total - 1;

  // Each milestone is "lit" when the scroll marker reaches its
  // vertical position. Positions are evenly spaced across the line.
  // For 4 milestones: 0, 0.33, 0.66, 1.0 — but offset slightly so
  // the first one lights as soon as the section enters and the last
  // lights as the user nears the end of the section's scroll range.
  const triggerPoint = total === 1 ? 0.5 : (index / (total - 1)) * 0.9 + 0.05;
  const fadeStart = Math.max(0, triggerPoint - 0.08);
  const fadeEnd = Math.min(1, triggerPoint + 0.04);

  // Driven directly from scrollProgress. No React state, no re-renders.
  // Tighter fade range = the number transitions sharply when scroll
  // hits its trigger, which reads as "illumination" rather than "fade".
  const opacity = useTransform(
    scrollProgress,
    [fadeStart, fadeEnd],
    [0.3, 1],
  );
  // Number color transitions from warm grey → full ink. Using
  // ink-mute (a true warm grey in the palette) instead of low-opacity
  // ink makes the dim state read clearly as "not yet lit" — the
  // transition becomes "greyed out → illuminated" rather than a
  // subtle opacity fade.
  const numberColor = useTransform(
    scrollProgress,
    [fadeStart, fadeEnd],
    ["rgb(var(--ink-mute))", "rgb(var(--ink))"],
  );
  // Amber glow halo opacity behind the number — this is the actual
  // "illumination" the user sees on the digits themselves.
  const numberGlow = useTransform(
    scrollProgress,
    [fadeStart, fadeEnd],
    [0, 1],
  );
  const labelColor = useTransform(
    scrollProgress,
    [fadeStart, fadeEnd],
    ["rgb(var(--amber) / 0.3)", "rgb(var(--amber))"],
  );
  const nodeFill = useTransform(
    scrollProgress,
    [fadeStart, fadeEnd],
    ["rgb(var(--bg-card))", "rgb(var(--amber))"],
  );
  const nodeScale = useTransform(
    scrollProgress,
    [fadeStart, fadeEnd],
    [0.75, 1],
  );
  const haloOpacity = useTransform(
    scrollProgress,
    [fadeStart, fadeEnd],
    [0, isLast ? 1 : 0],
  );

  if (reduce) {
    // Reduced-motion fallback: render everything fully lit.
    return (
      <li className="relative pl-16 sm:pl-20">
        <div
          className={[
            "absolute left-[20px] top-[8px] z-10 h-4 w-4 rounded-full border-2 border-amber bg-amber sm:left-[26px]",
            isLast ? "shadow-[0_0_20px_-2px_rgba(232,184,106,0.6)]" : "",
          ].join(" ")}
        />
        <p className="text-xs uppercase tracking-[0.22em] text-amber">
          {milestone.time}
        </p>
        <h3
          className={
            isLast
              ? "mt-2 font-serif text-[4.5rem] leading-none tracking-tight text-ink sm:text-[6rem] lg:text-[7rem]"
              : "mt-2 font-serif text-[3.25rem] leading-none tracking-tight text-ink sm:text-[4rem] lg:text-[5rem]"
          }
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {milestone.value}
          <span
            className={
              isLast
                ? "ml-3 align-baseline font-serif text-2xl italic text-amber sm:ml-4 sm:text-3xl"
                : "ml-3 align-baseline font-serif text-lg italic text-ink-mute sm:ml-3 sm:text-xl"
            }
          >
            words
          </span>
        </h3>
        <p
          className={
            isLast
              ? "mt-5 max-w-md font-serif text-lg italic leading-relaxed text-amber sm:text-xl"
              : "mt-4 max-w-md text-base leading-relaxed text-ink-dim sm:text-lg"
          }
        >
          {milestone.description}
        </p>
      </li>
    );
  }

  // One-shot "pop" the first time the milestone reaches its trigger
  // point. Detected via useMotionValueEvent so the pop fires the
  // moment the marker crosses, not on initial mount. Stays popped
  // after — we don't un-pop when scrolling back.
  const [popped, setPopped] = useState(false);
  useMotionValueEvent(scrollProgress, "change", (v) => {
    if (v >= triggerPoint && !popped) setPopped(true);
  });

  return (
    <li className="relative pl-16 sm:pl-20">
      {/* Outer wrapper that springs on pop. Nested inside is the
          scroll-driven inner wrapper. Transforms multiply, so the
          pop adds a brief scale spike on top of the smooth scroll
          interpolation. */}
      <motion.div
        animate={popped ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{
          duration: 0.55,
          ease: [0.16, 1, 0.3, 1],
          times: [0, 0.4, 1],
        }}
        className="absolute left-[20px] top-[8px] z-10 sm:left-[26px]"
      >
        <motion.div
          style={{ backgroundColor: nodeFill, scale: nodeScale }}
          className={[
            "h-4 w-4 rounded-full border-2 border-amber",
            isLast
              ? "shadow-[0_0_20px_-2px_rgba(232,184,106,0.6)]"
              : "",
          ].join(" ")}
        />

        {/* Radial burst when the milestone first illuminates */}
        {popped ? (
          <>
            <motion.span
              aria-hidden
              initial={{ scale: 0.4, opacity: 0.85 }}
              animate={{ scale: 3.2, opacity: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute inset-0 rounded-full border border-amber"
            />
            {isLast ? (
              <motion.span
                aria-hidden
                initial={{ scale: 0.4, opacity: 0.6 }}
                animate={{ scale: 5, opacity: 0 }}
                transition={{
                  duration: 1.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.15,
                }}
                className="pointer-events-none absolute inset-0 rounded-full border border-amber/60"
              />
            ) : null}
          </>
        ) : null}
      </motion.div>

      {/* Outer halo for the final milestone — illuminates with scroll */}
      {isLast ? (
        <motion.div
          aria-hidden
          style={{ opacity: haloOpacity }}
          className="absolute left-[12px] top-0 h-8 w-8 rounded-full bg-amber/30 blur-md sm:left-[18px]"
        />
      ) : null}

      {/* Time label */}
      <motion.p
        style={{ color: labelColor }}
        className="text-xs uppercase tracking-[0.22em]"
      >
        {milestone.time}
      </motion.p>

      {/* Number — sits there permanently, illuminates on scroll,
          springs a tiny pop the moment it lights up. Amber glow halo
          behind it makes the illumination read on the digits. */}
      <motion.div
        animate={popped ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
          times: [0, 0.4, 1],
        }}
        style={{ originX: 0, originY: 0.5 }}
        className="relative mt-2 inline-block"
      >
        {/* Amber glow halo behind the digits */}
        <motion.span
          aria-hidden
          style={{ opacity: numberGlow }}
          className={[
            "pointer-events-none absolute left-0 top-1/2 -z-10 -translate-y-1/2 rounded-full bg-amber/30 blur-3xl",
            isLast ? "h-40 w-40 sm:h-56 sm:w-56" : "h-28 w-28 sm:h-40 sm:w-40",
          ].join(" ")}
        />
        <motion.h3
          style={{ color: numberColor }}
          className={
            isLast
              ? "font-serif text-[4.5rem] leading-none tracking-tight sm:text-[6rem] lg:text-[7rem]"
              : "font-serif text-[3.25rem] leading-none tracking-tight sm:text-[4rem] lg:text-[5rem]"
          }
        >
          {milestone.value}
          <motion.span
            style={{ color: isLast ? labelColor : undefined }}
            className={
              isLast
                ? "ml-3 align-baseline font-serif text-2xl italic sm:ml-4 sm:text-3xl"
                : "ml-3 align-baseline font-serif text-lg italic text-ink-mute sm:ml-3 sm:text-xl"
            }
          >
            words
          </motion.span>
        </motion.h3>
      </motion.div>

      {/* Description */}
      <motion.p
        style={{ opacity }}
        className={
          isLast
            ? "mt-5 max-w-md font-serif text-lg italic leading-relaxed text-amber sm:text-xl"
            : "mt-4 max-w-md text-base leading-relaxed text-ink-dim sm:text-lg"
        }
      >
        {milestone.description}
      </motion.p>
    </li>
  );
}
