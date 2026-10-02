"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { heroReel, type HeroReelItem } from "@/lib/heroMedia";

const PAN_VARS: Record<string, React.CSSProperties> = {
  left: { "--kenburns-x": "-2%", "--kenburns-y": "0%" } as React.CSSProperties,
  right: { "--kenburns-x": "2%", "--kenburns-y": "0%" } as React.CSSProperties,
  up: { "--kenburns-x": "0%", "--kenburns-y": "-2%" } as React.CSSProperties,
  down: { "--kenburns-x": "0%", "--kenburns-y": "2%" } as React.CSSProperties,
};

/**
 * Desktop-only rotating hero background — cycles through lib/heroMedia.ts,
 * cutting cleanly between video clips and Ken-Burns stills. Renders nothing
 * on narrow viewports or when the visitor prefers reduced motion; the plain
 * static photo underneath (rendered by Hero.tsx) stays visible instead.
 *
 * Every item — video or still — advances on a plain timer keyed to its
 * `duration`. Video also gets a best-effort "ended" listener so the cut
 * lands on the clip's actual last frame when playback behaves normally,
 * but the timer is what guarantees the reel never gets stuck on one frame
 * if autoplay is delayed/blocked or a clip fails to load.
 */
export function HeroReel({ items = heroReel }: { items?: HeroReelItem[] }) {
  const [eligible, setEligible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEligible(desktop.matches && !noMotion.matches);
    update();
    desktop.addEventListener("change", update);
    noMotion.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      noMotion.removeEventListener("change", update);
    };
  }, []);

  const item = items[index] ?? items[0];
  // One video on its own just loops natively — no timer, no cut.
  const single = items.length === 1;

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!eligible || single) return;
    const speed = item.type === "video" ? (item.speed ?? 1) : 1;
    const ms = (item.duration / speed) * 1000 + 800; // +buffer past the ended/timer race
    const id = setTimeout(advance, ms);
    return () => clearTimeout(id);
  }, [eligible, single, index, item, advance]);

  if (!eligible || items.length === 0) return null;

  return (
    <div className="absolute inset-0">
      <div key={`${item.type}-${item.file}`} className="hero-reel-layer absolute inset-0">
        {item.type === "video" ? (
          <HeroReelVideo item={item} loop={single} onEnded={advance} />
        ) : (
          <div
            className="hero-reel-kenburns absolute inset-0"
            style={{ ...PAN_VARS[item.pan], "--kenburns-duration": `${item.duration}s` } as React.CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.file}
              alt={item.alt}
              className="h-full w-full object-cover"
              style={{ objectPosition: item.focus ?? "50% 35%" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function HeroReelVideo({
  item,
  loop,
  onEnded,
}: {
  item: Extract<HeroReelItem, { type: "video" }>;
  loop: boolean;
  onEnded: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.playbackRate = item.speed ?? 1;
    // Autoplay can be silently blocked; the parent's safety timer covers
    // that case regardless, so a rejected play() is fine to ignore here.
    v.play().catch(() => {});
  }, [item]);

  return (
    <video
      ref={videoRef}
      className="h-full w-full object-cover"
      style={{ objectPosition: item.focus ?? "50% 35%" }}
      src={item.file}
      poster={item.poster}
      title={item.alt}
      autoPlay
      muted
      loop={loop}
      playsInline
      preload="auto"
      onEnded={onEnded}
    />
  );
}
