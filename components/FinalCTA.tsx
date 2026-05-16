"use client";

import { motion, useReducedMotion } from "framer-motion";
import { StoreBadge } from "./StoreBadge";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Section 09 — Final CTA.
 *
 * The page's close. Short. Confident. One amber CTA. The amber bloom
 * behind it is bigger and brighter than anywhere else on the page —
 * this is the candle the rest of the page was lit from.
 */
export function FinalCTA() {
  const reduce = useReducedMotion();

  return (
    <section
      id="begin"
      className="relative isolate overflow-hidden py-32 sm:py-40 lg:py-48"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-amber/25 to-transparent"
      />

      {/* The big amber bloom — the candle */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.8, ease: EASE }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/25 blur-3xl dark:bg-amber/30"
      />

      {/* A single softly breathing ق behind the headline */}
      {!reduce ? (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          animate={{ y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 1.5, ease: EASE },
            y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
          className="pointer-events-none absolute left-1/2 top-[20%] -z-10 -translate-x-1/2 select-none font-arabic text-[10rem] leading-none text-amber/[0.10] sm:text-[14rem] lg:text-[18rem] dark:text-amber/[0.14]"
          dir="rtl"
        >
          ق
        </motion.div>
      ) : null}

      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={
            reduce ? { opacity: 1 } : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="font-serif text-[2.4rem] leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.75rem]"
        >
          Five hundred words{" "}
          <span className="italic text-amber">are waiting.</span>
        </motion.h2>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={
            reduce ? { opacity: 1 } : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <StoreBadge platform="ios" />
          <StoreBadge platform="android" />
        </motion.div>

        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={
            reduce ? { opacity: 1 } : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
          className="mx-auto mt-6 font-mono text-[11px] tracking-wide text-ink-mute"
        >
          No account. Your first word is free.
        </motion.p>
      </div>
    </section>
  );
}
