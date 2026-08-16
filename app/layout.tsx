import type { Metadata } from "next";
import { Archivo, Bodoni_Moda, Bricolage_Grotesque, Figtree, Newsreader } from "next/font/google";
import "./globals.css";

/* Presentation faces — the sermon title art uses exactly two families, and
   so does every slide: Archivo (heavy grotesque display + spaced labels)
   and Newsreader (the italic tagline serif). Nothing else. */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theciscochurch.org"),
  title: {
    default: "The Cisco Church — Cisco, Texas",
    template: "%s — The Cisco Church",
  },
  description:
    "Something new is happening in Cisco. Worship with the Cisco Church of Christ — Sundays at 10:30, 1701 Avenue N. Service times, directions, and this week's sermon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${bodoni.variable} ${figtree.variable} ${archivo.variable} ${newsreader.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
