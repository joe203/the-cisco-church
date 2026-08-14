import type { Metadata } from "next";
import { Bodoni_Moda, Figtree } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theciscochurch.org"),
  title: {
    default: "Cisco Church of Christ — Cisco, Texas",
    template: "%s — Cisco Church of Christ",
  },
  description:
    "A church family in Cisco, Texas. Service times, directions, and this week's sermon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodoni.variable} ${figtree.variable}`}>
      <body>{children}</body>
    </html>
  );
}
