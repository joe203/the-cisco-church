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
  style: ["normal", "italic"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theciscochurch.org"),
  title: {
    default: "Cisco Church — Cisco, Texas",
    template: "%s — Cisco Church",
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
    <html lang="en" className={`${bodoni.variable} ${figtree.variable}`}>
      <body>{children}</body>
    </html>
  );
}
