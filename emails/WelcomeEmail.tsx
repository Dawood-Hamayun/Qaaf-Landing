import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

/**
 * Welcome email sent the moment someone signs up on getqaaf.com.
 *
 * Tone: quiet, warm, no marketing voice. Reads like a personal note.
 * Visual: cream background, serif headline in deep ink, single amber
 * accent. Renders cleanly in Gmail/Apple Mail/Outlook (no external
 * fonts, no flexbox, table-based layout via @react-email).
 *
 * No "click here" buttons. No CTA. The whole point of the email is to
 * say "we got you, we'll write again when Qaaf opens." Anything more
 * would betray the promise of the form copy.
 */
export function WelcomeEmail({ firstWord = "Qaaf" }: { firstWord?: string }) {
  return (
    <Html>
      <Head />
      <Preview>
        JazakAllah for joining. We&apos;ll write one quiet message the day
        {" "}{firstWord} opens.
      </Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Brand mark */}
          <Section style={brandSection}>
            <Text style={brandGlyph} lang="ar" dir="rtl">
              ق
            </Text>
            <Text style={brandWord}>Qaaf</Text>
          </Section>

          {/* Headline */}
          <Text style={headline}>
            JazakAllah <span style={headlineItalic}>khayran.</span>
          </Text>

          {/* Body */}
          <Text style={paragraph}>
            You&apos;re on the list. That&apos;s the whole step.
          </Text>

          <Text style={paragraph}>
            Qaaf is being built slowly, on purpose. When the app is ready, you
            will get one quiet message from us. Not a launch sequence. Not a
            countdown. One note, the day the door opens.
          </Text>

          <Text style={paragraph}>
            Until then, here is the small idea behind the whole thing:
          </Text>

          {/* Quoted promise */}
          <Section style={quoteBlock}>
            <Text style={quoteText}>
              Five hundred words make up roughly eighty percent of the Quran.
              Learn them gently, and the Book begins to open in its own voice.
            </Text>
          </Section>

          <Text style={paragraph}>
            That&apos;s the promise. We&apos;ll see you soon, in shaa Allah.
          </Text>

          <Text style={signoff}>
            With salaam,
            <br />
            The Qaaf team
          </Text>

          <Hr style={hr} />

          {/* Footer */}
          <Section>
            <Text style={footerText}>
              You&apos;re receiving this because you signed up at{" "}
              <Link href="https://getqaaf.com" style={footerLink}>
                getqaaf.com
              </Link>
              . If this wasn&apos;t you, just ignore. We won&apos;t write again
              until the app is live.
            </Text>
            <Text style={footerMeta}>
              Qaaf <span style={footerDot}>·</span> Understand the Quran, one
              word at a time
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;

/* ---------- styles ----------
   Inline objects because email clients strip <style> tags. Table-friendly,
   no flex/grid. Hex colors only (CSS variables don't render in Gmail).   */

const CREAM = "#f2e9d8";
const CREAM_SOFT = "#ece1cc";
const INK = "#1a1612";
const INK_DIM = "#5b5043";
const INK_MUTE = "#8a7d6c";
const AMBER = "#c89a4f"; // slightly deeper than the on-screen amber for paper

const body: React.CSSProperties = {
  backgroundColor: CREAM,
  margin: 0,
  padding: "40px 0",
  fontFamily:
    "ui-serif, Georgia, 'Times New Roman', Times, serif",
  color: INK,
  WebkitFontSmoothing: "antialiased",
};

const container: React.CSSProperties = {
  margin: "0 auto",
  padding: "48px 40px 36px",
  maxWidth: "560px",
  backgroundColor: "#fbf6ea",
  borderRadius: "14px",
  border: `1px solid ${CREAM_SOFT}`,
};

const brandSection: React.CSSProperties = {
  textAlign: "center" as const,
  marginBottom: "40px",
};

const brandGlyph: React.CSSProperties = {
  fontFamily: "'Amiri', 'Scheherazade New', serif",
  fontSize: "44px",
  color: AMBER,
  lineHeight: "1",
  margin: "0 0 8px 0",
  fontWeight: 400,
};

const brandWord: React.CSSProperties = {
  fontSize: "13px",
  letterSpacing: "0.22em",
  textTransform: "uppercase" as const,
  color: INK_MUTE,
  margin: 0,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
};

const headline: React.CSSProperties = {
  fontSize: "32px",
  lineHeight: "1.15",
  letterSpacing: "-0.01em",
  color: INK,
  margin: "0 0 28px 0",
  fontWeight: 400,
  textAlign: "left" as const,
};

const headlineItalic: React.CSSProperties = {
  fontStyle: "italic",
  color: AMBER,
};

const paragraph: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "1.65",
  color: INK_DIM,
  margin: "0 0 18px 0",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
};

const quoteBlock: React.CSSProperties = {
  borderLeft: `2px solid ${AMBER}`,
  paddingLeft: "20px",
  margin: "24px 0 28px 0",
};

const quoteText: React.CSSProperties = {
  fontSize: "17px",
  lineHeight: "1.6",
  color: INK,
  fontStyle: "italic",
  margin: 0,
  fontFamily: "ui-serif, Georgia, 'Times New Roman', Times, serif",
};

const signoff: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: INK_DIM,
  margin: "28px 0 0 0",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
};

const hr: React.CSSProperties = {
  border: "none",
  borderTop: `1px solid ${CREAM_SOFT}`,
  margin: "36px 0 24px 0",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  lineHeight: "1.6",
  color: INK_MUTE,
  margin: "0 0 12px 0",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
};

const footerLink: React.CSSProperties = {
  color: AMBER,
  textDecoration: "underline",
};

const footerMeta: React.CSSProperties = {
  fontSize: "10px",
  letterSpacing: "0.22em",
  textTransform: "uppercase" as const,
  color: INK_MUTE,
  margin: 0,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
};

const footerDot: React.CSSProperties = {
  margin: "0 6px",
  color: AMBER,
};
