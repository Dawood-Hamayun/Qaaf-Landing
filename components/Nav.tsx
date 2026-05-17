import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-6 sm:py-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative inline-flex h-9 w-9 overflow-hidden rounded-[10px] shadow-[0_0_20px_-4px_rgba(232,184,106,0.6)]">
            <Image
              src="/qaaf-mark.png"
              alt="Qaaf"
              width={64}
              height={64}
              priority
              className="h-full w-full object-cover"
            />
          </span>
          <span className="font-serif text-2xl italic tracking-tight text-ink">
            Qaaf
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="#how"
            className="hidden rounded-full px-3 py-1.5 text-sm text-ink-dim transition hover:text-ink sm:inline-block"
          >
            How it works
          </Link>
          {/* "Open Qaaf" CTA hidden until launch — uncomment when the
              app is live. */}
          {/*
          <Link
            href="#download"
            className="rounded-full bg-amber px-4 py-2 text-sm font-medium text-bg shadow-glow transition hover:brightness-105"
          >
            Open Qaaf
          </Link>
          */}
          <span className="hidden rounded-full border border-amber/30 bg-amber/[0.06] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-amber sm:inline-block">
            Coming soon
          </span>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
