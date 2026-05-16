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
      className="group inline-flex h-[52px] min-w-[160px] items-center justify-center gap-3 rounded-xl bg-ink px-5 text-bg shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] transition-shadow duration-300 hover:shadow-[0_18px_50px_-12px_rgba(232,184,106,0.35)]"
      aria-label={isIos ? "Download on the App Store" : "Get it on Google Play"}
    >
      <span className="flex h-6 w-6 items-center justify-center">
        {isIos ? <AppleIcon /> : <PlayIcon />}
      </span>
      <span className="flex flex-col leading-tight text-left">
        <span className="text-[9px] uppercase tracking-[0.16em] text-bg/65">
          {isIos ? "Download on the" : "Get it on"}
        </span>
        <span className="text-[15px] font-semibold leading-tight tracking-tight">
          {isIos ? "App Store" : "Google Play"}
        </span>
      </span>
    </motion.a>
  );
}

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 12.04c-.02-2.18 1.78-3.22 1.86-3.27-1.01-1.48-2.59-1.68-3.15-1.7-1.34-.13-2.62.79-3.31.79-.69 0-1.74-.77-2.87-.75-1.47.02-2.83.86-3.59 2.18-1.53 2.66-.39 6.57 1.1 8.72.73 1.05 1.6 2.23 2.74 2.19 1.1-.04 1.51-.71 2.85-.71 1.32 0 1.71.71 2.87.69 1.19-.02 1.94-1.06 2.66-2.12.84-1.22 1.18-2.4 1.2-2.46-.03-.01-2.31-.89-2.33-3.56zM14.96 5.65c.6-.72 1.01-1.74.9-2.74-.87.03-1.92.58-2.54 1.31-.56.64-1.05 1.66-.91 2.64.96.07 1.96-.49 2.55-1.21z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.6 1.5c-.4.2-.6.6-.6 1.1v18.8c0 .5.2.9.6 1.1l10.4-10.5L3.6 1.5z" />
      <path d="M16.8 8.6 5.7 2.1l9.5 9.6 1.6-3.1z" opacity="0.85" />
      <path d="M16.8 15.4 15.2 12.3l-9.5 9.6 11.1-6.5z" opacity="0.75" />
      <path d="M20.4 10.5l-3.6-2-1.6 3.2 1.6 3.1 3.6-2c.7-.4.7-1.9 0-2.3z" opacity="0.95" />
    </svg>
  );
}
