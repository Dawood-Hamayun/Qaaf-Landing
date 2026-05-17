import Image from "next/image";
import Link from "next/link";

/**
 * Section 10 — Footer.
 *
 * Quiet. The page's bottom margin. Four columns on lg (Brand · Product
 * · Data & Sources · Contact), stacking on mobile. Bottom strip carries
 * the copyright and the app store buttons.
 *
 * Data credits are real and required: Tanzil Project for the text,
 * Quranic Arabic Corpus (University of Leeds) for the frequencies.
 */
export function Footer() {
  return (
    <footer className="relative isolate border-t border-hairline/10 bg-bg-soft py-20 sm:py-24 dark:border-amber/10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label="Qaaf home"
            >
              <span className="relative inline-flex h-10 w-10 overflow-hidden rounded-[10px] shadow-[0_0_22px_-4px_rgba(232,184,106,0.6)]">
                <Image
                  src="/qaaf-mark.png"
                  alt=""
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="font-serif text-2xl italic tracking-tight text-ink">
                Qaaf
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-dim">
              Understand the Quran, one word at a time.
            </p>
          </div>

          {/* Product */}
          <FooterCol title="Product" className="lg:col-span-2">
            <FooterLink href="#how">How it works</FooterLink>
            <FooterLink href="#features">What&apos;s included</FooterLink>
            <FooterLink href="#path">The path</FooterLink>
          </FooterCol>

          {/* Data & Sources */}
          <FooterCol title="Data & Sources" className="lg:col-span-3">
            <FooterCredit label="Quranic text">Tanzil Project</FooterCredit>
            <FooterCredit label="Frequency analysis">
              Quranic Arabic Corpus, University of Leeds
            </FooterCredit>
          </FooterCol>

          {/* Contact + (downloads hidden until launch) */}
          <FooterCol title="Contact" className="lg:col-span-3">
            <FooterLink href="mailto:hello@qaaf.app">hello@qaaf.app</FooterLink>
            {/* Store badges hidden until launch. Restore by
                uncommenting the block below. */}
            {/*
            <div className="mt-5 flex flex-col gap-2.5">
              <AppStoreBadge platform="ios" />
              <AppStoreBadge platform="android" />
            </div>
            */}
            <div className="mt-5 flex flex-col gap-1">
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-amber">
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-amber/50" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-amber" />
                </span>
                Coming soon
              </span>
              <span className="text-xs text-ink-dim">
                iOS &amp; Android
              </span>
            </div>
          </FooterCol>
        </div>

        {/* Bottom strip */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-hairline/10 pt-8 sm:flex-row sm:items-center sm:gap-6 dark:border-amber/10">
          <p className="text-xs text-ink-mute">
            © 2026 Qaaf. Made with love.
          </p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-ink-mute/80">
            <span className="font-arabic text-amber" dir="rtl">
              ق
            </span>
            <span className="mx-2 inline-block h-[1px] w-4 align-middle bg-ink-mute/40" />
            For the long road
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- atoms ---------- */

function FooterCol({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h4 className="mb-4 text-[11px] uppercase tracking-[0.22em] text-amber">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {Array.isArray(children) ? (
          children.map((child, i) => <li key={i}>{child}</li>)
        ) : (
          <li>{children}</li>
        )}
      </ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-ink-dim transition-colors duration-200 hover:text-amber"
    >
      {children}
    </Link>
  );
}

function FooterCredit({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-[0.18em] text-ink-mute">
        {label}
      </span>
      <span className="text-sm text-ink-dim">{children}</span>
    </div>
  );
}

function AppStoreBadge({ platform }: { platform: "ios" | "android" }) {
  const isIos = platform === "ios";
  return (
    <a
      href={isIos ? "#download-ios" : "#download-android"}
      className="group inline-flex items-center gap-3 rounded-xl border border-hairline/15 bg-bg-card px-4 py-2.5 transition-colors hover:border-amber/40 dark:border-amber/15"
    >
      <span className="text-ink transition-colors group-hover:text-amber">
        {isIos ? <AppleIcon /> : <PlayIcon />}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[9px] uppercase tracking-[0.18em] text-ink-mute">
          {isIos ? "Download on the" : "Get it on"}
        </span>
        <span className="text-sm font-medium text-ink">
          {isIos ? "App Store" : "Google Play"}
        </span>
      </span>
    </a>
  );
}

function AppleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.05 12.04c-.02-2.18 1.78-3.22 1.86-3.27-1.01-1.48-2.59-1.68-3.15-1.7-1.34-.13-2.62.79-3.31.79-.69 0-1.74-.77-2.87-.75-1.47.02-2.83.86-3.59 2.18-1.53 2.66-.39 6.57 1.1 8.72.73 1.05 1.6 2.23 2.74 2.19 1.1-.04 1.51-.71 2.85-.71 1.32 0 1.71.71 2.87.69 1.19-.02 1.94-1.06 2.66-2.12.84-1.22 1.18-2.4 1.2-2.46-.03-.01-2.31-.89-2.33-3.56zM14.96 5.65c.6-.72 1.01-1.74.9-2.74-.87.03-1.92.58-2.54 1.31-.56.64-1.05 1.66-.91 2.64.96.07 1.96-.49 2.55-1.21z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      width="18"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M3.6 1.5c-.4.2-.6.6-.6 1.1v18.8c0 .5.2.9.6 1.1l10.4-10.5L3.6 1.5z" />
      <path d="M16.8 8.6L5.7 2.1l9.5 9.6 1.6-3.1z" opacity="0.85" />
      <path d="M16.8 15.4l-1.6-3.1-9.5 9.6 11.1-6.5z" opacity="0.75" />
      <path d="M20.4 10.5l-3.6-2-1.6 3.2 1.6 3.1 3.6-2c.7-.4.7-1.9 0-2.3z" opacity="0.95" />
    </svg>
  );
}
