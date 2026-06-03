import type { Metadata } from "next";
import { Fraunces, Figtree, Amiri } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

// Absolute base URL used to resolve relative paths in OG/Twitter meta.
// Social platforms (LinkedIn, Twitter, iMessage, Slack) need fully
// qualified image URLs, so Next.js prefixes them with this.
const SITE_URL = "https://getqaaf.com";
const SITE_NAME = "Qaaf";
const SITE_TITLE = "Qaaf · Learn 500 words of the Quran";
const SITE_DESCRIPTION =
  "Five hundred words. Eighty percent of the Quran. Meet the Book, one word at a time. Gently, daily, with you the whole way.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/getqaaf-landing.png",
        // Standard OG card size. If your image is a different size,
        // update these so previews don't crop awkwardly.
        width: 1200,
        height: 630,
        alt: "Qaaf · Learn 500 words of the Quran",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/getqaaf-landing.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${figtree.variable} ${amiri.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
