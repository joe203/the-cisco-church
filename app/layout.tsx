import type { Metadata } from "next";
import { Bodoni_Moda, Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";

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
    <html lang="en" className={`${bricolage.variable} ${bodoni.variable} ${figtree.variable}`}>
      <body>{children}</body>
    </html>
  );
}
