"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Section 05 — Built for the long road.
 *
 * Six tiles in a 2×3 grid. The visual treatment is intentionally
 * spartan — no card borders, no shadow stacks. The grid itself is
 * marked only by thin hairlines (Tailwind divide), like ruled paper.
 * Each tile carries:
 *   · A custom inline SVG icon, hand-tuned per concept (not Lucide).
 *   · A short title in serif.
 *   · A one-line subtitle in muted ink.
 *
 * Tiles reveal in a diagonal wave (row + col stagger). Hover lifts
 * the tile 4px, blooms a soft amber underglow, and triggers the
 * icon's own micro-animation (each one is a different verb — the
 * cloud lands, the bars pulse, the door opens).
 */

type Tile = {
  title: string;
  subtitle: string;
  Icon: () => React.ReactNode;
};

const TILES: Tile[] = [
  {
    title: "Works offline",
    subtitle: "Download once. Practice anywhere.",
    Icon: OfflineIcon,
  },
  {
    title: "No streaks",
    subtitle: "Practice when you can. Progress is always there.",
    Icon: NoStreaksIcon,
  },
  {
    title: "Quran-grade typography",
    subtitle: "Amiri Quran, set with the care this Book deserves.",
    Icon: CalligraphyIcon,
  },
  {
    title: "Ayah by ayah",
    subtitle: "Every word, in the verse it lives in.",
    Icon: AyahIcon,
  },
  {
    title: "No account, no email",
    subtitle: "Open the app. Begin. That's it.",
    Icon: OpenDoorIcon,
  },
  {
    title: "Open about everything",
    subtitle: "Where our data comes from, who reviews it, how we built it.",
    Icon: TransparencyIcon,
  },
];

export function BuiltForLongRoad() {
  return (
    <section
      id="features"
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
          The long road
          <span className="inline-block h-px w-6 bg-amber/60" />
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="font-serif text-[2.2rem] leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
        >
          Built for{" "}
          <span className="italic text-amber">the long road.</span>
        </motion.h2>
      </div>

      {/* Grid */}
      <div className="mx-auto mt-16 max-w-6xl px-6 sm:mt-20 lg:mt-24">
        <div className="grid grid-cols-1 divide-y divide-hairline/15 overflow-hidden rounded-2xl border border-hairline/15 sm:grid-cols-2 sm:divide-x lg:grid-cols-3 dark:divide-amber/10 dark:border-amber/10">
          {TILES.map((tile, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const delay = (row + col) * 0.09;
            return (
              <TileCard
                key={tile.title}
                tile={tile}
                index={i}
                delay={delay}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- single tile ---------- */

function TileCard({
  tile,
  index,
  delay,
}: {
  tile: Tile;
  index: number;
  delay: number;
}) {
  const reduce = useReducedMotion();
  const Icon = tile.Icon;

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className="group relative overflow-hidden p-8 sm:p-9"
    >
      {/* Amber underglow on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber/0 via-amber/0 to-amber/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 30% 0%, rgb(var(--amber) / 0.08), transparent 60%)",
        }}
      />

      <div className="relative flex h-full flex-col">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center text-amber transition-transform duration-500 ease-out group-hover:scale-105">
          <Icon />
        </div>

        <h3 className="font-serif text-xl leading-tight tracking-tight text-ink sm:text-2xl">
          {tile.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-ink-dim sm:text-[15px]">
          {tile.subtitle}
        </p>

        {/* Tile index for a subtle "card 03 of 06" feel */}
        <span className="mt-6 text-[10px] uppercase tracking-[0.22em] text-ink-mute/70">
          0{index + 1} / 06
        </span>
      </div>
    </motion.div>
  );
}

/* ---------- custom SVG icons ----------
   Each is 28×28 viewBox, stroke-current at 1.5px. Animations are
   activated by the parent's `group` class on hover.                  */

function OfflineIcon() {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      {/* Cloud */}
      <path d="M8 13a4 4 0 0 1 .7-7.9 6 6 0 0 1 11.3 2.6A4 4 0 0 1 20 16" />
      {/* Download arrow inside — moves on hover */}
      <g className="transition-transform duration-500 ease-out group-hover:translate-y-[2px]">
        <path d="M14 12v8" />
        <path d="M10.5 16.5L14 20l3.5-3.5" />
      </g>
    </svg>
  );
}

function NoStreaksIcon() {
  // Infinity loop. Quietly says "always there, no break."
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      <path d="M5 14c0-2.5 2-4.5 4.5-4.5 1.7 0 3 .9 4 2.4l1 1.5c1 1.5 2.3 2.4 4 2.4 2.5 0 4.5-2 4.5-4.5s-2-4.5-4.5-4.5c-1.7 0-3 .9-4 2.4l-1 1.5c-1 1.5-2.3 2.4-4 2.4C7 13.5 5 11.5 5 9" />
    </svg>
  );
}

function CalligraphyIcon() {
  // A stylized ق letter drawn with two paths — the body + the two
  // dots. On hover, the dots gently lift.
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      {/* Two dots above (the ق diacritic) */}
      <g className="transition-transform duration-500 ease-out group-hover:-translate-y-[2px]">
        <circle cx="11" cy="6" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="6" r="0.9" fill="currentColor" stroke="none" />
      </g>
      {/* Letter body — bowl opening downward */}
      <path d="M9 11c0 4 2.5 7 6 7s6-3 6-7" />
      <path d="M21 11v3" />
      <path d="M9 11v3" />
    </svg>
  );
}

function AyahIcon() {
  // Open book / verse layout. Two stacked lines on each leaf, with
  // a small amber dot marking a highlighted word.
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      {/* Book spine + pages */}
      <path d="M14 8v15" />
      <path d="M14 8c-2-2-5-2-8-2v15c3 0 6 0 8 2" />
      <path d="M14 8c2-2 5-2 8-2v15c-3 0-6 0-8 2" />
      {/* Highlighted word on left page */}
      <path
        d="M7 11h4"
        className="text-amber transition-opacity duration-500 group-hover:opacity-100"
        stroke="currentColor"
        opacity="0.5"
      />
      <path d="M7 14h3" opacity="0.4" />
      <path d="M18 11h3" opacity="0.4" />
      <path d="M18 14h2" opacity="0.4" />
    </svg>
  );
}

function OpenDoorIcon() {
  // An open doorway. The door panel swings further open on hover.
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      {/* Door frame */}
      <path d="M7 22V6h14v16" />
      <path d="M5 22h18" />
      {/* Door panel — pivots on hover */}
      <g
        className="origin-top-right transition-transform duration-500 ease-out group-hover:-rotate-[8deg]"
        style={{ transformOrigin: "21px 6px" }}
      >
        <path d="M21 6 12 8v14l9-1" />
        <circle cx="14" cy="15" r="0.8" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

function TransparencyIcon() {
  // A window with four panes. On hover, one pane brightens.
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      <rect x="5" y="5" width="18" height="18" rx="1.5" />
      <path d="M14 5v18" />
      <path d="M5 14h18" />
      {/* Top-right pane brightens on hover */}
      <rect
        x="14"
        y="5"
        width="9"
        height="9"
        fill="currentColor"
        stroke="none"
        className="opacity-0 transition-opacity duration-500 group-hover:opacity-15"
      />
    </svg>
  );
}
