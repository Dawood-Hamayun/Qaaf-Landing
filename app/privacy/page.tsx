import type { Metadata } from "next";
import Link from "next/link";

// Contact address published in the policy — must be a working inbox so
// data-deletion requests reach you.
const CONTACT_EMAIL = "dawoodhamayun2015@gmail.com";
const LAST_UPDATED = "18 June 2026";

export const metadata: Metadata = {
  title: "Privacy Policy · Qaaf",
  description:
    "How Qaaf handles your information. Qaaf works offline, needs no account, and does not collect personal data for advertising or tracking.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-xl text-ink-deep sm:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-dim">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <Link
          href="/"
          className="text-sm font-medium text-amber transition-colors hover:text-amber-soft"
        >
          ← Qaaf
        </Link>

        <h1 className="mt-8 font-serif text-4xl text-ink-deep sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-ink-mute">Last updated: {LAST_UPDATED}</p>

        <p className="mt-8 text-[15px] leading-relaxed text-ink-dim">
          Qaaf (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the app&rdquo;) is
          operated by Dawood Hamayun (Red Space Labs). This policy explains how
          the Qaaf mobile application handles your information. Qaaf is
          privacy-first: it works offline, requires no account, and does not
          collect personal information for advertising or tracking.
        </p>

        <Section title="Information we do not collect">
          <p>
            We do not require an account and do not ask for your name, email,
            phone number, contacts, photos, precise location, or browsing
            activity. We do not use advertising or third-party ad-tracking.
          </p>
        </Section>

        <Section title="Information stored on your device">
          <p>
            Your learning progress, streaks, settings, reminder preferences, and
            any name you optionally enter during onboarding are stored locally on
            your device only. We cannot access this data, and uninstalling the
            app removes it.
          </p>
        </Section>

        <Section title="In-app purchases">
          <p>
            Qaaf offers optional &ldquo;Supporter&rdquo; purchases (an annual
            subscription and a lifetime unlock) processed by the Apple App Store
            and Google Play. We never receive or store your payment card
            details &mdash; those are handled entirely by Apple and Google.
          </p>
          <p>
            We use RevenueCat, Inc. to manage and restore purchases. RevenueCat
            processes purchase information (such as purchase history and an
            anonymous app-generated identifier) and basic device/OS information,
            solely to deliver and restore your purchase across devices &mdash;
            not for advertising. See{" "}
            <a
              href="https://www.revenuecat.com/privacy"
              className="text-amber underline underline-offset-2 hover:text-amber-soft"
              target="_blank"
              rel="noreferrer"
            >
              RevenueCat&rsquo;s privacy policy
            </a>
            . Apple and Google process transactions under their own privacy
            policies.
          </p>
        </Section>

        <Section title="Notifications">
          <p>
            If you enable reminders, Qaaf schedules local notifications on your
            device. They are generated on-device and send no data to us or any
            server.
          </p>
        </Section>

        <Section title="Data sharing">
          <p>
            We do not sell your data. We do not share personal information with
            third parties except the purchase processors above (RevenueCat,
            Apple, Google), strictly to operate in-app purchases.
          </p>
        </Section>

        <Section title="Data retention and deletion">
          <p>
            Progress and settings live on your device and are removed when you
            uninstall. To request deletion of purchase-related data associated
            with your anonymous identifier, contact us at the email below.
          </p>
        </Section>

        <Section title="Children&rsquo;s privacy">
          <p>
            Qaaf is not directed to children under 13. We do not knowingly
            collect personal information from children.
          </p>
        </Section>

        <Section title="Security">
          <p>Data transmitted for purchases is encrypted in transit.</p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this policy; changes will be posted on this page with a
            new &ldquo;Last updated&rdquo; date.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Dawood Hamayun (Red Space Labs) &mdash;{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-amber underline underline-offset-2 hover:text-amber-soft"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </Section>
      </div>
    </main>
  );
}
