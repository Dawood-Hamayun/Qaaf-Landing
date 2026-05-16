"use client";

import { motion } from "framer-motion";

/**
 * Shared App Store / Google Play badge. Used in the hero and the
 * final CTA so both bookends of the page offer the same concrete
 * action. Both platforms share the EXACT same structure — same
 * height, padding, icon container, typography, and hover spring —
 * so the pair reads as one unified CTA.
 */
export function StoreBadge({ platform }: { platform: "ios" | "android" }) {
  const isIos = platform === "ios";
  return (
    <motion.a
      href={isIos ? "#download-ios" : "#download-android"}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className="group inline-flex h-[50px] w-[160px] items-center justify-center gap-2.5 rounded-xl bg-ink px-3 text-bg shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] transition-shadow duration-300 hover:shadow-[0_18px_50px_-12px_rgba(232,184,106,0.35)] sm:h-[52px] sm:w-[180px] sm:gap-3 sm:px-5"
      aria-label={isIos ? "Download on the App Store" : "Get it on Google Play"}
    >
      {/* Fixed-width icon slot so both badges' text columns align
          identically. Each icon fills the same visual footprint
          regardless of its native bounding box. */}
      <span className="flex h-5 w-5 shrink-0 items-center justify-center sm:h-6">
        {isIos ? <AppleIcon /> : <PlayIcon />}
      </span>
      <span className="flex flex-col leading-tight text-left">
        <span className="whitespace-nowrap text-[8px] uppercase tracking-[0.14em] text-bg/65 sm:text-[9px] sm:tracking-[0.16em]">
          {isIos ? "Download on the" : "Get it on"}
        </span>
        <span className="text-[14px] font-semibold leading-tight tracking-tight sm:text-[15px]">
          {isIos ? "App Store" : "Google Play"}
        </span>
      </span>
    </motion.a>
  );
}

function AppleIcon() {
  // viewBox sized to the actual glyph extents so the apple silhouette
  // fills its bounding box. Combined with the 24×20 render size, it
  // ends up visually equal in weight to the Play triangle below.
  return (
    <svg width="20" height="22" viewBox="0 0 22 24" fill="currentColor" aria-hidden>
      <path d="M15.5 12c0-2 1.6-2.9 1.7-3-.9-1.3-2.4-1.5-2.9-1.5-1.2-.1-2.4.7-3 .7s-1.6-.7-2.6-.7c-1.3 0-2.6.8-3.3 2C3.9 11.9 4.9 15.5 6.3 17.5c.7 1 1.5 2 2.5 2 1 0 1.4-.6 2.6-.6 1.2 0 1.6.6 2.6.6 1.1 0 1.8-1 2.4-2 .8-1.1 1.1-2.2 1.1-2.2-.1 0-2.1-.8-2.1-3.3zM13.5 6.2c.5-.7.9-1.6.8-2.5-.8 0-1.7.5-2.3 1.2-.5.6-1 1.5-.8 2.4.9.1 1.8-.4 2.3-1.1z" />
    </svg>
  );
}

function PlayIcon() {
  // Google Play triangle drawn at the same visual height as Apple
  // (h-5 in the slot above). The slight asymmetry comes from the
  // shape itself — the triangle leans right.
  return (
    <svg width="18" height="22" viewBox="0 0 22 24" fill="currentColor" aria-hidden>
      <path d="M3.3 2.3c-.3.2-.5.6-.5 1v17.4c0 .4.2.8.5 1l9.5-9.7L3.3 2.3z" />
      <path d="M15.4 8.8 4.7 2.6l8.8 9 1.9-2.8z" opacity="0.85" />
      <path d="M15.4 15.2 13.5 12.4l-8.8 9 10.7-6.2z" opacity="0.75" />
      <path d="M18.8 10.7l-3.4-1.9-1.9 3 1.9 2.8 3.4-1.9c.7-.4.7-1.6 0-2z" opacity="0.95" />
    </svg>
  );
}
