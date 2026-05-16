"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Section 08 — A note from the maker.
 *
 * No big card, no photo, no stock "About the founder" treatment.
 * Just a hand-letter feel: narrow column, larger serif body, each
 * paragraph fading in on its own scroll-trigger. Signature at the
 * bottom, italic, with location. Reads like a personal letter
 * inside a magazine spread.
 */

const PARAGRAPHS: string[] = [
  "I'm a Pakistani developer who's recited the Quran since I was a child without understanding most of it. For years I told myself I'd learn properly. I'd take a class, I'd buy the books, I'd start tomorrow. Tomorrow never came.",
  "What worked, eventually, was something small. A few words a day. No course to enroll in, no class to attend, no perfect time to start. Just one word, then another, then another.",
  "Qaaf is what I wish had existed when I was younger. It's built carefully and slowly, the way the Quran asks to be approached. There's no team, no investors, no growth targets. Just one developer in Rawalpindi, trying to make something true.",
  "If it helps you the way it's helped me, alhamdulillah. That's everything.",
];

export function FounderNote() {
  const reduce = useReducedMotion();

  return (
    <section
      id="note"
      className="relative isolate overflow-hidden py-28 sm:py-36 lg:py-44"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-amber/25 to-transparent"
      />

      {/* A single, very large faded ق sits as a watermark behind the
          column — like the illuminated initial in a manuscript page. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.5, ease: EASE }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none font-arabic text-[18rem] leading-none text-amber/[0.06] sm:text-[24rem] lg:text-[30rem] dark:text-amber/[0.10]"
        dir="rtl"
      >
        ق
      </motion.div>

      <div className="mx-auto max-w-2xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-5 inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-amber"
        >
          <span className="inline-block h-px w-6 bg-amber/60" />
          A note
          <span className="inline-block h-px w-6 bg-amber/60" />
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="font-serif text-[2rem] italic leading-[1.1] tracking-tight text-ink sm:text-[2.5rem] lg:text-[3rem]"
        >
          A note, before you begin.
        </motion.h2>

        <div className="mt-10 space-y-6 sm:mt-14 sm:space-y-7">
          {PARAGRAPHS.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
              whileInView={
                reduce ? { opacity: 1 } : { opacity: 1, y: 0 }
              }
              viewport={{ once: true, margin: "-12%" }}
              transition={{
                duration: 0.8,
                ease: EASE,
                delay: 0.2 + i * 0.12,
              }}
              className="font-serif text-lg leading-relaxed text-ink-dim sm:text-xl sm:leading-[1.7]"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        {/* Signature */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 1, ease: EASE, delay: 0.8 }}
          className="mt-12 flex flex-col items-end gap-1 sm:mt-16"
        >
          <span className="font-serif text-2xl italic text-ink sm:text-3xl">
            Dawood
          </span>
          <span className="text-xs uppercase tracking-[0.22em] text-ink-mute">
            Rawalpindi, 2026
          </span>
        </motion.div>
      </div>
    </section>
  );
}
