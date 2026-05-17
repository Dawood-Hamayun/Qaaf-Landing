"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Section 03 — How it works.
 *
 * Why a vertical chapter layout (not horizontal scroll or carousel):
 *   · People skim landing pages by flicking their thumb. Anything that
 *     demands a different gesture (horizontal scroll, swipe carousel,
 *     scroll-pinned section) gets skipped or skimmed past without
 *     registering.
 *   · The wow should ride on the user's existing scroll motion, not
 *     ask them to discover a new interaction.
 *   · Vertical reveals stay buttery on every device because there is
 *     no scroll subscription anywhere in this component. Every
 *     animation is a single-fire `whileInView` on a compositor-only
 *     transform (translate / scale / opacity). Old iPhones handle
 *     this without a dropped frame.
 *
 * What gives it the wow:
 *   · Each step is a full-bleed chapter with a giant ghost step
 *     number sitting behind the content like a printed page number,
 *     fading in as the chapter enters.
 *   · The visual enters from the side with a subtle 3D tilt that
 *     resolves to flat. Reads like a card being laid down on a table.
 *   · The chapter title rises into place, then an amber accent line
 *     draws horizontally beneath it like a calligrapher's stroke.
 *   · The body text settles last, with a soft delay.
 *   · Alternating left/right on desktop gives visual rhythm. On
 *     mobile, everything stacks centered.
 *   · A delicate vertical hairline at the far-left of the desktop
 *     layout connects the three chapters as one continuous journey.
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
  return (
    <section
      id="how"
      className="relative overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      {/* Section kicker + title */}
      <header className="mx-auto mb-20 max-w-3xl px-5 text-center sm:mb-24 sm:px-6 lg:mb-32">
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
          className="font-serif text-[2.1rem] leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
        >
          Three small steps.{" "}
          <span className="italic text-amber">That&apos;s it.</span>
        </motion.h2>
      </header>

      {/* Chapter stack. A delicate amber hairline runs through the left
          gutter on lg+ to tie the chapters together as one journey. */}
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-12 left-6 top-12 hidden w-px bg-gradient-to-b from-transparent via-amber/25 to-transparent lg:block"
        />
        <div className="flex flex-col gap-28 sm:gap-36 lg:gap-44">
          {SLIDES.map((slide, i) => (
            <StepChapter key={slide.index} slide={slide} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- one chapter ---------- */

function StepChapter({ slide, index }: { slide: Slide; index: number }) {
  const reduce = useReducedMotion();
  const isEven = index % 2 === 0;
  const Visual = slide.Visual;

  return (
    <article className="relative">
      {/* Giant ghost step number sitting behind the content like a
          printed page number. Different corner per chapter so the page
          feels composed rather than templated. */}
      <motion.span
        aria-hidden
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
        whileInView={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.3, ease: EASE }}
        className={`pointer-events-none absolute -top-10 z-0 select-none font-serif text-[7.5rem] leading-none tracking-tight text-amber/[0.07] sm:-top-14 sm:text-[11rem] lg:-top-20 lg:text-[15rem] dark:text-amber/[0.08] ${
          isEven ? "right-0 sm:-right-2" : "left-0 sm:-left-2"
        }`}
      >
        {slide.index}
      </motion.span>

      <div
        className={`relative z-10 grid items-center gap-12 sm:gap-16 lg:grid-cols-2 lg:gap-20`}
      >
        {/* Text block */}
        <div
          className={`order-2 text-center lg:text-left ${
            isEven ? "lg:order-1" : "lg:order-2"
          }`}
        >
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

          <motion.h3
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
            className="mt-3 font-serif text-[2rem] leading-[1.04] tracking-tight text-ink sm:text-[2.6rem] lg:text-[3.2rem]"
          >
            {slide.title}
          </motion.h3>

          {/* Calligraphic amber stroke that draws beneath the title */}
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
            className={`mt-5 block h-px w-20 origin-left bg-gradient-to-r from-amber/80 to-amber/0 sm:w-28 ${
              isEven ? "mx-auto lg:mx-0" : "mx-auto lg:ml-0 lg:mr-auto"
            }`}
            aria-hidden
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
            className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-ink-dim sm:text-base lg:mx-0 lg:text-lg"
          >
            {slide.body}
          </motion.p>
        </div>

        {/* Visual */}
        <div
          className={`order-1 mx-auto w-full max-w-[420px] lg:max-w-[440px] ${
            isEven ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <div className="relative">
            {/* Soft amber underglow. blur-xl (not blur-3xl) so mobile
                GPUs don't choke. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-6 -bottom-3 -z-10 h-12 rounded-full bg-amber/35 blur-xl"
            />

            <motion.div
              initial={
                reduce
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: 30,
                      scale: 0.96,
                      rotateX: 6,
                    }
              }
              whileInView={
                reduce
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      rotateX: 0,
                    }
              }
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1.05, ease: EASE }}
              style={{ transformPerspective: 1200 }}
            >
              <Visual />
            </motion.div>
          </div>
        </div>
      </div>
    </article>
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
    <div className="relative w-full max-w-[440px]">
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
