import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-serif",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Inventure Communications",
    template: "%s | Inventure Communications",
  },
  description:
    "Inventure Communications is a Strategic Communications & Public Affairs firm advising institutions across the Middle East on reputation, media, and stakeholder engagement.",
  keywords: [
    "Strategic Communications",
    "Public Affairs",
    "Middle East",
    "Media Production",
    "Corporate Communications",
    "ESG Communications",
  ],
  authors: [{ name: "Inventure Communications" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Inventure Communications",
    title: "Inventure Communications — Strategic Communications & Public Affairs",
    description:
      "Institutional communications counsel for decision-makers across the Middle East.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inventure Communications",
    description:
      "Strategic Communications & Public Affairs for institutional audiences in the Middle East.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexSerif.variable} min-h-screen antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
