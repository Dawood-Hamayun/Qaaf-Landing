"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  size?: "md" | "lg";
  className?: string;
};

/**
 * The site's primary call-to-action. Designed to feel deliberate:
 *   · Persistent ember glow that breathes (subtle, never distracting).
 *   · Spring-scale on hover and tap so the cursor feels seen.
 *   · A soft amber sheen sweeps across once on hover.
 *   · The arrow nudges forward on hover. Tiny detail, big difference.
 *
 * All visual effects are GPU-friendly: transforms, filters, gradients.
 * No layout thrash.
 */
export function PrimaryCTA({ href, children, size = "lg", className }: Props) {
  // Vertical metrics are tuned so both CTAs in the hero render at the
  // exact same height (text-base + py-3.5 = 48px; sm:text-lg keeps line
  // height proportional). Don't change without updating the secondary.
  const padding =
    size === "lg" ? "px-7 py-3.5 text-base sm:text-lg" : "px-5 py-2.5 text-sm";

  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 26, mass: 0.6 }}
      className={[
        "group relative inline-flex select-none items-center justify-center overflow-hidden rounded-full",
        // Transparent border so the box-model matches the secondary CTA
        // (which has a 1px border). Without this, both CTAs end up 2px apart.
        "border border-transparent bg-amber font-medium text-bg",
        "shadow-[0_10px_40px_-12px_rgba(232,184,106,0.65),0_0_0_0_rgba(232,184,106,0)]",
        "transition-[box-shadow,filter] duration-300 ease-out",
        "hover:shadow-[0_18px_60px_-12px_rgba(232,184,106,0.85),0_0_40px_-4px_rgba(232,184,106,0.5)]",
        "hover:brightness-[1.04]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        padding,
        className ?? "",
      ].join(" ")}
    >
      {/* Persistent ember halo behind the button. */}
      <motion.span
        aria-hidden
        className="absolute -inset-1 -z-10 rounded-full bg-amber/40 blur-xl"
        animate={{ opacity: [0.45, 0.65, 0.45] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* One-shot sheen sweep on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/4 w-1/2 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[260%] group-hover:opacity-100"
      />

      <span className="relative z-10">{children}</span>

      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10 ml-2 transition-transform duration-300 ease-out group-hover:translate-x-1"
      >
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </motion.a>
  );
}
