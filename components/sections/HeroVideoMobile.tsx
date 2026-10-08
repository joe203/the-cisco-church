"use client";

import { useEffect, useRef, useState } from "react";
import { heroMobile } from "@/lib/heroMedia";

type NetworkInfo = { saveData?: boolean; effectiveType?: string; downlink?: number };

/**
 * The desktop hero video on phones, only when the connection can carry it.
 * Hero.tsx paints the still of Joe preaching first; this loads the same
 * footage on top of it and fades it in once it is actually playing. If the
 * link stalls, it fades back to the still instead of showing a frozen frame.
 *
 * Skipped entirely (no bytes downloaded) for reduced-motion, data-saver, 2G,
 * or a reported downlink under 0.8 Mbps. iOS reports none of that, so there it
 * relies on the video's own playing/waiting events: slow link = never "playing"
 * = the still stays.
 */
export function HeroVideoMobile() {
  const [load, setLoad] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 1023px)");
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    // 3G labels are common on healthy LTE (the label keys off latency), so only
    // 2G and an explicit low-bandwidth estimate skip the download up front; the
    // playing/waiting events below catch everything else.
    const weakLink =
      Boolean(conn?.saveData) ||
      conn?.effectiveType === "slow-2g" ||
      conn?.effectiveType === "2g" ||
      (conn?.downlink !== undefined && conn.downlink < 0.8);

    const update = () => setLoad(narrow.matches && !noMotion.matches && !weakLink);
    // Let the still paint first so the video never competes with it.
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

  useEffect(() => {
    const v = videoRef.current;
    if (!load || !v) return;
    v.muted = true;
    v.defaultMuted = true;
    // A blocked autoplay (e.g. iOS low-power mode) leaves the still up.
    v.play().catch(() => {});
  }, [load]);

  if (!load) return null;

  return (
    <video
      ref={videoRef}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${
        playing ? "opacity-100" : "opacity-0"
      }`}
      style={{ objectPosition: heroMobile.focus }}
      src={heroMobile.video}
      aria-hidden
      tabIndex={-1}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onPlaying={() => setPlaying(true)}
      onWaiting={() => setPlaying(false)}
      onStalled={() => setPlaying(false)}
    />
  );
}
