"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SlideFrame } from "@/components/slides/SlideFrame";
import type { Slide } from "@/lib/types";

type DeckViewerProps = {
  slides: Slide[];
  deckSlug: string;
};

/**
 * Self-paced deck viewer embedded at the top of a sermon page.
 * Prev/next arrows, thumbnail strip, arrow-key navigation, "N of M" counter.
 */
export function DeckViewer({ slides, deckSlug }: DeckViewerProps) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => Math.min(count - 1, Math.max(0, i + delta)));
    },
    [count],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Arrows on a focused clip seek the video, not the deck.
      if (e.target instanceof HTMLVideoElement) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go]);

  if (count === 0) return null;
  const slide = slides[index];
  const clips = slides.flatMap((s, i) =>
    s.html.includes("<video") ? [{ index: i, title: s.html.match(/title="([^"]*)"/)?.[1] ?? `Clip ${i + 1}` }] : [],
  );

  return (
    <section aria-label="Sermon slides" className="bg-ink">
      <div className="mx-auto max-w-5xl px-5 pt-10 pb-8 sm:px-8">
        <SlideFrame
          key={slide.position}
          html={slide.html}
          className="shadow-(--shadow-card) ring-1 ring-cream/10"
        />

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              aria-label="Previous slide"
              className="border border-cream/20 px-4 py-2 text-cream transition-transform duration-300 hover:not-disabled:-translate-x-0.5 active:not-disabled:translate-x-0 disabled:opacity-30"
            >
              <span aria-hidden>&larr;</span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={index === count - 1}
              aria-label="Next slide"
              className="border border-cream/20 px-4 py-2 text-cream transition-transform duration-300 hover:not-disabled:translate-x-0.5 active:not-disabled:translate-x-0 disabled:opacity-30"
            >
              <span aria-hidden>&rarr;</span>
            </button>
            <p className="ml-3 text-[0.85rem] tabular-nums text-ash">
              {index + 1} <span className="text-ash/60">of</span> {count}
            </p>
          </div>
          <Link href={`/slides/${deckSlug}`} className="eyebrow link-under text-lamplight">
            Open full screen <span aria-hidden>&rarr;</span>
          </Link>
        </div>

        {clips.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-cream/10 pt-5">
            <p className="eyebrow mr-1 text-lamplight">Watch the clips</p>
            {clips.map((c) => (
              <button
                key={c.index}
                type="button"
                onClick={() => setIndex(c.index)}
                aria-pressed={c.index === index}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-left text-[0.9rem] text-cream transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-lamplight active:translate-y-0 ${
                  c.index === index ? "border-lamplight" : "border-cream/20"
                }`}
              >
                <span aria-hidden className="text-lamplight">&#9654;</span>
                {c.title}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2.5 overflow-x-auto pb-2" role="tablist" aria-label="Slides">
          {slides.map((s, i) => (
            <button
              key={s.position}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}${s.html.includes("<video") ? " (video)" : ""}`}
              onClick={() => setIndex(i)}
              className={`relative w-28 shrink-0 transition-opacity duration-300 ${
                i === index
                  ? "opacity-100 outline-2 outline-lamplight"
                  : "opacity-45 hover:opacity-80"
              }`}
            >
              <SlideFrame html={s.html} className="pointer-events-none" />
              {s.html.includes("<video") && (
                <span
                  aria-hidden
                  className="absolute inset-0 grid place-items-center text-lg text-cream drop-shadow-[0_2px_6px_rgb(0_0_0/0.8)]"
                >
                  &#9654;
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
