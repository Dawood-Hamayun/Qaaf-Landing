"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const BEEHIIV_FORM_ID = "f01889ed-5917-4902-860e-bbdf7ec97e3b";

/**
 * "Coming soon" + custom newsletter form.
 *
 * Single pill container with input + flush submit button — modern,
 * tactile, mobile-friendly. The pill turns amber on focus, the
 * button morphs through three states (idle → loading → done) with
 * spring physics. On success, the entire form crossfades into a
 * thank-you message.
 *
 * POSTs to /api/subscribe (Next.js API route) which forwards to
 * Beehiiv when an API key is available.
 */
export function ComingSoonForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), formId: BEEHIIV_FORM_ID }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Kicker */}
      <div className="flex items-center justify-center gap-2.5 text-[10px] uppercase tracking-[0.22em] text-amber">
        <span className="inline-block h-px w-6 bg-amber/60" />
        Coming soon
        <span className="inline-block h-px w-6 bg-amber/60" />
      </div>

      <p className="mt-3 text-center font-serif text-[15px] italic leading-relaxed text-ink-dim sm:text-lg">
        We&apos;ll send one quiet message the day Qaaf opens.
      </p>

      {/* Form / success state */}
      <div className="mt-6">
        <AnimatePresence mode="wait" initial={false}>
          {status === "success" ? (
            <SuccessState key="success" />
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
              onSubmit={handleSubmit}
            >
              <FormPill
                email={email}
                setEmail={setEmail}
                status={status}
              />

              {status === "error" ? (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-center text-xs text-ink-mute"
                >
                  Something went wrong. Please try again.
                </motion.p>
              ) : null}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- success state ---------- */

function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 22,
        mass: 0.9,
      }}
      className="relative flex flex-col items-center gap-4 rounded-3xl border border-amber/30 bg-amber/[0.04] px-6 py-8 text-center shadow-[0_20px_60px_-20px_rgba(232,184,106,0.45)] dark:bg-amber/[0.08]"
    >
      {/* Soft amber bloom that breathes behind the whole card */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-amber/20 blur-2xl"
      />

      {/* Animated checkmark inside an amber circle */}
      <SuccessMark />

      {/* Arabic salam — appears with stagger */}
      <motion.p
        dir="rtl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.65 }}
        className="font-arabic text-[1.35rem] leading-tight text-amber"
      >
        ٱلسَّلَامُ عَلَيْكُمْ
      </motion.p>

      {/* JazakAllah khayr — main thank-you */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.8 }}
        className="font-serif text-xl italic leading-tight text-ink sm:text-2xl"
      >
        JazakAllah khayr.
      </motion.p>

      {/* Sub-message */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.95 }}
        className="text-sm leading-relaxed text-ink-dim sm:text-base"
      >
        We&apos;ll write when Qaaf opens.
      </motion.p>
    </motion.div>
  );
}

function SuccessMark() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 18,
        delay: 0.15,
      }}
      className="relative"
    >
      <svg
        viewBox="0 0 80 80"
        className="h-16 w-16"
        fill="none"
        aria-hidden
      >
        {/* Ring draws first */}
        <motion.circle
          cx="40"
          cy="40"
          r="36"
          stroke="rgb(var(--amber))"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.2,
          }}
          style={{
            transformOrigin: "center",
            transform: "rotate(-90deg)",
          }}
        />
        {/* Then the checkmark */}
        <motion.path
          d="M26 41 L36 51 L55 30"
          stroke="rgb(var(--amber))"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.55,
          }}
        />
      </svg>
      {/* Drop shadow under the mark */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 rounded-full bg-amber/30 blur-xl"
      />
    </motion.div>
  );
}

/* ---------- the pill ---------- */

function FormPill({
  email,
  setEmail,
  status,
}: {
  email: string;
  setEmail: (v: string) => void;
  status: "idle" | "loading" | "success" | "error";
}) {
  const loading = status === "loading";
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={[
        // Container: one pill with input + flush button inside. Border
        // animates to amber on focus.
        "relative flex h-14 items-center overflow-hidden rounded-full border bg-bg-card transition-all duration-300",
        focused
          ? "border-amber/60 shadow-[0_0_0_4px_rgba(232,184,106,0.08)]"
          : "border-hairline/20 dark:border-amber/15",
      ].join(" ")}
    >
      <input
        type="email"
        name="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder="your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={loading}
        aria-label="Email address"
        className="h-full flex-1 bg-transparent pl-5 pr-2 text-[15px] text-ink placeholder:text-ink-mute/70 outline-none sm:pl-6"
      />

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={loading ? undefined : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 26 }}
        className={[
          "relative m-1 inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-amber px-5 text-[14px] font-medium text-bg shadow-[0_4px_14px_-4px_rgba(232,184,106,0.6)]",
          "transition-all duration-300 hover:shadow-[0_8px_24px_-6px_rgba(232,184,106,0.8)]",
          "disabled:cursor-wait",
          "sm:px-6 sm:text-[15px]",
        ].join(" ")}
        aria-label="Notify me when Qaaf opens"
      >
        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Spinner />
              <span className="hidden sm:inline">Sending</span>
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span>Notify me</span>
              <ArrowRight />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

/* ---------- micro icons ---------- */

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 1-9 9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

