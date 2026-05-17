"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";

/**
 * "Coming soon" block + custom newsletter form, wired to /api/subscribe
 * which adds the email to a Resend Audience and sends a Qaaf-branded
 * welcome email.
 *
 * Three visual states:
 *   · idle / submitting / error  — single rounded input + amber submit
 *     button. Errors slide in below in a small amber-tinted strip.
 *   · success                    — the whole field is replaced by a
 *     JazakAllah confirmation with a soft amber checkmark.
 *
 * Design choices:
 *   · Single pill-shaped row on all sizes. Button is just an arrow on
 *     mobile, label appears at sm+.
 *   · Input focus ring uses the candlelight amber.
 *   · Submit is disabled while idle if the email is empty/invalid so the
 *     CTA never lies. Once typing starts, it lights up.
 *   · After success we don't reset the form. The success state is final
 *     for this view (user signed up, message delivered).
 */
export function ComingSoonForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  const isValid = EMAIL_RE.test(email.trim());
  const submitting = status === "submitting";
  const succeeded = status === "success";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid || submitting || succeeded) return;

    setStatus("submitting");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        alreadySubscribed?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(
          data.error ?? "Something went sideways. Please try again."
        );
        return;
      }

      setAlreadySubscribed(Boolean(data.alreadySubscribed));
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Network hiccup. Please try again.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Kicker */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex items-center justify-center gap-2.5 text-[10px] uppercase tracking-[0.22em] text-amber"
      >
        <span className="inline-block h-px w-6 bg-amber/60" />
        Coming soon
        <span className="inline-block h-px w-6 bg-amber/60" />
      </motion.div>

      {/* Sub-copy */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="mt-3 text-center font-serif text-[15px] italic leading-relaxed text-ink-dim sm:text-lg"
      >
        We&apos;ll send one quiet message the day Qaaf opens.
      </motion.p>

      {/* Form / success swap */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        className="mt-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          {succeeded ? (
            <SuccessState
              key="success"
              alreadySubscribed={alreadySubscribed}
            />
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              noValidate
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative"
            >
              <div
                className={`group relative flex h-14 items-center rounded-full border bg-bg-card/70 backdrop-blur transition-all duration-300 ${
                  status === "error"
                    ? "border-red-400/40 dark:border-red-300/30"
                    : "border-hairline/15 focus-within:border-amber/60 focus-within:shadow-[0_0_0_4px_rgb(232_184_106_/_0.12)] dark:border-amber/15"
                }`}
              >
                <label htmlFor="subscribe-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="subscribe-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") {
                      setStatus("idle");
                      setErrorMsg(null);
                    }
                  }}
                  disabled={submitting}
                  required
                  className="h-full flex-1 bg-transparent pl-5 pr-2 text-[15px] text-ink placeholder:text-ink-mute/60 outline-none disabled:opacity-60 sm:pl-6 sm:text-base"
                />

                <button
                  type="submit"
                  disabled={!isValid || submitting}
                  aria-label="Notify me when Qaaf opens"
                  className="mr-1.5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-amber px-4 text-sm font-medium text-bg shadow-[0_8px_24px_-10px_rgba(232,184,106,0.6)] transition-all duration-300 hover:shadow-[0_14px_36px_-10px_rgba(232,184,106,0.85)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:px-5"
                >
                  {submitting ? (
                    <Spinner />
                  ) : (
                    <>
                      <span className="hidden sm:inline">Notify me</span>
                      <ArrowIcon />
                    </>
                  )}
                </button>
              </div>

              {/* Error message strip */}
              <AnimatePresence>
                {status === "error" && errorMsg ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p
                      role="alert"
                      className="mt-2.5 px-2 text-xs text-red-400 dark:text-red-300"
                    >
                      {errorMsg}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Quiet reassurance line */}
              <p className="mt-3 text-center text-[10px] uppercase tracking-[0.18em] text-ink-mute/70">
                No tracking. No spam. One message at launch.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ---------- success state ---------- */

function SuccessState({
  alreadySubscribed,
}: {
  alreadySubscribed: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative overflow-hidden rounded-2xl border border-amber/25 bg-amber/[0.06] px-5 py-5 text-center"
    >
      {/* Soft amber halo behind the check */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/3 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(closest-side, rgb(var(--amber) / 0.35), transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center">
        <CheckBloom />

        <p className="mt-3 font-serif text-[1.35rem] leading-tight text-ink sm:text-2xl">
          JazakAllah <span className="italic text-amber">khayran.</span>
        </p>

        <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-dim sm:text-[15px]">
          {alreadySubscribed
            ? "You're already on the list. We'll write the day Qaaf opens."
            : "You're on the list. Look for a quiet note from us in your inbox now, and one more the day Qaaf opens."}
        </p>
      </div>
    </motion.div>
  );
}

/* ---------- icons ---------- */

function ArrowIcon() {
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
      className="transition-transform duration-300 group-hover:translate-x-0.5"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

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

function CheckBloom() {
  return (
    <motion.span
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.55, ease: EASE, delay: 0.05 }}
      className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber/15"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-amber"
        aria-hidden
      >
        <motion.path
          d="M5 12.5l4.5 4.5L19 7.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
        />
      </svg>
    </motion.span>
  );
}
