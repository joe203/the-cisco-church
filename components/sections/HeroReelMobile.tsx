"use client";

import { useEffect, useRef, useState } from "react";
import { heroReelMobile, type HeroReelItem } from "@/lib/heroMedia";

const PAN_VARS: Record<string, React.CSSProperties> = {
  left: { "--kenburns-x": "-2%", "--kenburns-y": "0%" } as React.CSSProperties,
  right: { "--kenburns-x": "2%", "--kenburns-y": "0%" } as React.CSSProperties,
  up: { "--kenburns-x": "0%", "--kenburns-y": "-2%" } as React.CSSProperties,
  down: { "--kenburns-x": "0%", "--kenburns-y": "2%" } as React.CSSProperties,
};

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

/**
 * Phone-sized hero reel: rotates real moments (stills with a slow drift, short
 * muted clips) in the photo slot under the headline. Hero.tsx paints the first
 * still itself, so this renders nothing until the page has loaded and the
 * visitor is eligible — reduced motion or data-saver / 2G keeps that still.
 * The next clip is fetched ahead of its turn so a cut never waits on the network.
 */
export function HeroReelMobile({ items = heroReelMobile }: { items?: HeroReelItem[] }) {
  const [eligible, setEligible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 1023px)");
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    const slowLink = Boolean(conn?.saveData) || /(^|-)2g$/.test(conn?.effectiveType ?? "");

    const update = () => setEligible(narrow.matches && !noMotion.matches && !slowLink);
    // Let the first still paint before any video bytes compete with it.
    if (document.readyState === "complete") update();
    else window.addEventListener("load", update, { once: true });

    narrow.addEventListener("change", update);
    noMotion.addEventListener("change", update);
    return () => {
      window.removeEventListener("load", update);
      narrow.removeEventListener("change", update);
      noMotion.removeEventListener("change", update);
    };
  }, []);

  const item = items[index] ?? items[0];

  useEffect(() => {
    if (!eligible || items.length < 2) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % items.length), item.duration * 1000);
    return () => clearTimeout(id);
  }, [eligible, index, item, items.length]);

  // Warm the HTTP cache with the next clip while the current beat plays.
  useEffect(() => {
    if (!eligible) return;
    const next = items[(index + 1) % items.length];
    if (next?.type === "video") {
      fetch(next.file, { priority: "low" } as RequestInit).catch(() => {});
    }
  }, [eligible, index, items]);

  if (!eligible || items.length === 0) return null;

  return (
    <div key={`${index}-${item.file}`} className="hero-mobile-layer absolute inset-0">
      {item.type === "video" ? (
        <HeroMobileVideo item={item} />
      ) : (
        <div
          className="hero-reel-kenburns absolute inset-0"
          style={{ ...PAN_VARS[item.pan], "--kenburns-duration": `${item.duration + 0.6}s` } as React.CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.file}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: item.focus ?? "50% 40%" }}
          />
        </div>
      )}
    </div>
  );
}

function HeroMobileVideo({ item }: { item: Extract<HeroReelItem, { type: "video" }> }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    // A blocked autoplay (e.g. iOS low-power mode) just leaves the poster frame up.
    v.play().catch(() => {});
  }, [item]);

  return (
    <video
      ref={ref}
      className="h-full w-full object-cover"
      style={{ objectPosition: item.focus ?? "50% 40%" }}
      src={item.file}
      poster={item.poster}
      aria-hidden
      tabIndex={-1}
      autoPlay
      muted
      playsInline
      preload="auto"
    />
  );
}
