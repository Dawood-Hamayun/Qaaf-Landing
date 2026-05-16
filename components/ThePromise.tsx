"use client";

import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Section 02 — The math.
 *
 * "500 words. 80% of the Quran" — proved with two animated stats and
 * a caption that names the data source. Counters write directly to
 * the DOM via framer-motion's animate(), bypassing React state, so
 * digit transitions are buttery and don't jitter under load.
 */
export function ThePromise() {
  return (
    <section
      id="the-math"
      className="relative isolate overflow-hidden py-28 sm:py-36 lg:py-44"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-amber/25 to-transparent"
      />

      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-6 inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-amber"
        >
          <span className="inline-block h-px w-6 bg-amber/60" />
          The math
          <span className="inline-block h-px w-6 bg-amber/60" />
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="font-serif text-[2.4rem] leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
        >
          500 words.
          <br />
          <span className="text-amber">80% of the Quran.</span>
        </motion.h2>

        <div className="mt-16 flex flex-col items-center justify-center gap-14 sm:mt-20 sm:flex-row sm:gap-24 lg:gap-32">
          <BigNumber to={500} label="Words to learn" />
          <span
            aria-hidden
            className="hidden h-24 w-px bg-gradient-to-b from-transparent via-amber/30 to-transparent sm:block"
          />
          <ProgressArc percent={80} label="Of every page" />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
          className="mx-auto mt-16 max-w-2xl text-base leading-relaxed text-ink-dim sm:mt-20 sm:text-lg"
        >
          Read{" "}
          <span className="text-ink">100,000 of every 105,000</span> Quranic
          words. Not approximation. Actual frequency math, drawn from the{" "}
          <span className="text-ink">Quranic Arabic Corpus</span> at the
          University of Leeds.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
          className="mx-auto mt-6 text-sm italic leading-relaxed text-ink-mute"
        >
          Most Muslims learn 0 to 50. You&apos;ll learn 500.
        </motion.p>
      </div>
    </section>
  );
}

/**
 * Imperative count-up that bypasses React state. We hold a ref to the
 * number's <span>, watch the section come into view, then drive the
 * digit via framer's animate() with a DOM-only onUpdate. No re-renders,
 * no digit jitter, no width pumping (tabular-nums on the span handles
 * the latter).
 */
function useDomCountUp(to: number, duration = 2.0) {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-15%" });

  useEffect(() => {
    if (!inView || !numberRef.current) return;
    const node = numberRef.current;
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate(value) {
        node.textContent = Math.round(value).toString();
      },
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return { containerRef, numberRef };
}

function BigNumber({ to, label }: { to: number; label: string }) {
  const { containerRef, numberRef } = useDomCountUp(to);

  return (
    <div ref={containerRef} className="flex flex-col items-center">
      <span
        ref={numberRef}
        className="font-serif text-[5.5rem] leading-none tracking-tight text-amber sm:text-[7rem] lg:text-[8.5rem]"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        0
      </span>
      <span className="mt-4 text-xs uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </span>
    </div>
  );
}

function ProgressArc({ percent, label }: { percent: number; label: string }) {
  const { containerRef, numberRef } = useDomCountUp(percent);

  const size = 200;
  const r = 90;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div ref={containerRef} className="flex flex-col items-center">
      <div className="relative h-44 w-44 sm:h-48 sm:w-48 lg:h-52 lg:w-52">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-ink/10 dark:text-ink/15"
          />
          <motion.circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgb(var(--amber))"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: percent / 100 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 2, ease: EASE, delay: 0.25 }}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{
              filter: "drop-shadow(0 0 12px rgba(232, 184, 106, 0.55))",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-serif text-[3.25rem] leading-none tracking-tight text-amber sm:text-[3.75rem]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            <span ref={numberRef}>0</span>
            <span
              className="text-2xl sm:text-3xl"
              style={{ verticalAlign: "top" }}
            >
              %
            </span>
          </span>
        </div>
      </div>
      <span className="mt-4 text-xs uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </span>
    </div>
  );
}
