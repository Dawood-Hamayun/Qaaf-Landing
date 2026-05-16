"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FloatingGlyphs } from "./FloatingGlyphs";
import { PhoneFrame } from "./PhoneFrame";
import { StoreBadge } from "./StoreBadge";

const EASE = [0.22, 1, 0.36, 1] as const;

// Animation choreography:
//   0.00 – 0.85s   Center phone fades in, large (scale 1.35), parked at
//                  viewport center via y=-22vh translate. Page otherwise empty.
//   0.85 – 1.05s   Held. Glow blooms.
//   1.05 – 2.50s   Center phone descends to its layout slot AND zooms out.
//                  Simultaneously:
//                   · Side phones emerge from BEHIND center, sliding outward
//                     just enough that their outer two-thirds peek out tilted.
//                   · Text cascades top-down.
//   2.70s+         Settled. Subtle float kicks in.
//
// Phone layout: all three are absolute, anchored at left-1/2 so their
// transforms are measured against the row's horizontal center. This lets
// the side phones start exactly behind the center phone and slide outward
// without absolute pixel math.
export function Hero() {
  const reduce = useReducedMotion();

  const TEXT_BASE_DELAY = 1.1;
  const fadeUp = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: reduce ? { opacity: 1 } : { opacity: 1, y: 0 },
    transition: {
      duration: 0.85,
      ease: EASE,
      delay: TEXT_BASE_DELAY + i * 0.08,
    },
  });

  return (
    <section className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden pb-12 pt-32 sm:pt-36 lg:pt-36">
      {/* Candlelight glow */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgb(var(--amber) / 0.55), rgb(var(--amber) / 0.08) 55%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grain"
      />

      <FloatingGlyphs />

      <div className="mx-auto w-full max-w-6xl px-6">
        {/* Top copy */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            {...fadeUp(0)}
            className="font-serif text-[2.4rem] leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.75rem]"
          >
            Understand the Quran{" "}
            <span className="italic text-amber">in its own language.</span>
          </motion.h1>

          <motion.p
            {...fadeUp(1)}
            className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-ink-dim sm:text-lg"
          >
            Qaaf teaches the{" "}
            <span className="text-ink">500 words</span> that make up roughly{" "}
            <span className="text-ink">80% of the Quran</span>. Five minutes a
            day. Native audio, classical root analysis, real verses.
          </motion.p>

          <motion.p
            {...fadeUp(2)}
            className="mx-auto mt-4 max-w-lg text-balance text-sm italic leading-relaxed text-ink-mute sm:text-base"
          >
            Made for the Muslim who&apos;s recited these ayahs their whole life,
            and is ready to know what they mean.
          </motion.p>

          <motion.div
            {...fadeUp(3)}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <StoreBadge platform="ios" />
            <StoreBadge platform="android" />
          </motion.div>

          {/* Mono reassurance under CTAs — the low-commitment USP. */}
          <motion.p
            {...fadeUp(4)}
            className="mx-auto mt-5 font-mono text-[11px] tracking-wide text-ink-mute"
          >
            No account required. Your first word is free, forever.
          </motion.p>

          {/* Trust badges — small credibility row */}
          <motion.div
            {...fadeUp(5)}
            className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.18em] text-ink-mute"
          >
            <TrustBadge icon={<ShieldIcon />}>Tanzil-verified text</TrustBadge>
            <span className="hidden h-1 w-1 rounded-full bg-ink-mute/40 sm:inline-block" />
            <TrustBadge icon={<EyeOffIcon />}>No tracking, ever</TrustBadge>
            <span className="hidden h-1 w-1 rounded-full bg-ink-mute/40 sm:inline-block" />
            <TrustBadge icon={<KeyIcon />}>No account needed</TrustBadge>
          </motion.div>
        </div>

        {/* Phones — stacked, anchored at the row's horizontal center.
            Side phones start hidden behind the center phone and slide
            outward just enough to peek out tilted. */}
        <div className="relative mx-auto mt-10 h-[440px] max-w-5xl sm:mt-12 sm:h-[480px] lg:h-[520px]">
          {/* Left card */}
          <motion.div
            initial={
              reduce
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    x: "-50%",
                    y: 30,
                    scale: 0.55,
                    rotate: 0,
                  }
            }
            animate={
              reduce
                ? { opacity: 1, x: "-50%" }
                : {
                    opacity: 1,
                    x: "-125%",
                    y: 0,
                    scale: 1,
                    rotate: -9,
                  }
            }
            transition={{ duration: 1.3, ease: EASE, delay: 1.3 }}
            style={{ originX: 0.5, originY: 0.5 }}
            className="absolute bottom-2 left-1/2 z-10 hidden w-[36%] max-w-[210px] sm:block sm:w-[26%] lg:w-[22%]"
          >
            <div className="animate-float [animation-delay:-2s]">
              <PhoneFrame
                srcLight="/mockups/weekly-summary-light.jpeg"
                srcDark="/mockups/weekly-summary-dark.jpeg"
                alt="Weekly summary showing gentle progress"
              />
            </div>
          </motion.div>

          {/* Right card */}
          <motion.div
            initial={
              reduce
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    x: "-50%",
                    y: 30,
                    scale: 0.55,
                    rotate: 0,
                  }
            }
            animate={
              reduce
                ? { opacity: 1, x: "-50%" }
                : {
                    opacity: 1,
                    x: "25%",
                    y: 0,
                    scale: 1,
                    rotate: 9,
                  }
            }
            transition={{ duration: 1.3, ease: EASE, delay: 1.45 }}
            style={{ originX: 0.5, originY: 0.5 }}
            className="absolute bottom-2 left-1/2 z-10 hidden w-[36%] max-w-[210px] sm:block sm:w-[26%] lg:w-[22%]"
          >
            <div className="animate-float [animation-delay:-4s]">
              <PhoneFrame
                srcLight="/mockups/home-light.jpeg"
                srcDark="/mockups/Home-Dark.jpeg"
                alt="Today's three words, waiting"
              />
            </div>
          </motion.div>

          {/* Center phone — Phase 1: viewport-centered, large.
              Phase 2: descends and zooms out into the row. */}
          <motion.div
            initial={
              reduce
                ? { opacity: 0, x: "-50%" }
                : { opacity: 0, x: "-50%", scale: 0.96, y: "-22vh" }
            }
            animate={
              reduce
                ? { opacity: 1, x: "-50%", scale: 1, y: 0 }
                : {
                    opacity: [0, 1, 1, 1],
                    x: "-50%",
                    scale: [0.96, 1.32, 1.32, 1],
                    y: ["-22vh", "-22vh", "-22vh", "0vh"],
                  }
            }
            transition={
              reduce
                ? { duration: 0.8, ease: EASE }
                : {
                    duration: 2.5,
                    ease: EASE,
                    times: [0, 0.34, 0.42, 1],
                  }
            }
            style={{ originX: 0.5, originY: 0.5 }}
            className="absolute bottom-2 left-1/2 z-20 w-[68%] max-w-[280px] sm:w-[36%] sm:max-w-[250px] lg:w-[28%]"
          >
            <motion.div
              initial={{ y: 0 }}
              animate={reduce ? { y: 0 } : { y: [0, -8, 0] }}
              transition={
                reduce
                  ? undefined
                  : {
                      duration: 6,
                      ease: "easeInOut",
                      repeat: Infinity,
                      delay: 2.8,
                    }
              }
            >
              <PhoneFrame
                srcLight="/mockups/Allah-light.jpeg"
                srcDark="/mockups/Allah-Dark.jpeg"
                alt="The word Allāh. Appears 2,699 times in the Quran"
                priority
              />
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

/* ---------- hero atoms ---------- */

function TrustBadge({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-amber">{icon}</span>
      {children}
    </span>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A11 11 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="8" cy="15" r="4" />
      <path d="M10.85 12.15 19 4" />
      <path d="m18 5 2 2" />
      <path d="m15 8 2 2" />
    </svg>
  );
}

