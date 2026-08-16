"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { getBrowserClient } from "@/lib/supabase/client";
import type { Deck, DeckState } from "@/lib/types";
import { SlideFrame } from "./SlideFrame";

type LiveViewerProps = {
  deck: Deck;
  initialState: DeckState;
};

/**
 * The screen. While the deck is live it follows the presenter's cursor —
 * Supabase Realtime when configured, with a 2s poll as belt-and-suspenders;
 * a dropped socket mid-service must never strand a projected screen. When
 * not live, it becomes self-paced.
 *
 * Decks may define looping background layers (video or image), keyed per
 * slide; the active layer cross-fades when a slide switches keys. Blank
 * drops the slide content and leaves the background running.
 */
export function LiveViewer({ deck, initialState }: LiveViewerProps) {
  const [state, setState] = useState<DeckState>(initialState);
  const [selfIndex, setSelfIndex] = useState(initialState.current_slide - 1);
  const stateRef = useRef(state);
  stateRef.current = state;
  const rootRef = useRef<HTMLDivElement>(null);

  const count = deck.slides.length;
  const isLive = state.is_live;
  const index = isLive
    ? Math.min(count - 1, Math.max(0, state.current_slide - 1))
    : Math.min(count - 1, Math.max(0, selfIndex));

  const bgKeys = Object.keys(deck.backgrounds);
  const hasMedia = bgKeys.length > 0;

  // Realtime subscription
  useEffect(() => {
    const supabase = getBrowserClient();
    if (!supabase) return;
    const channel = supabase
      .channel(`deck-${deck.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "cisco",
          table: "cisco_deck_state",
          filter: `deck_id=eq.${deck.id}`,
        },
        (payload) => {
          const next = payload.new as Partial<DeckState>;
          if (typeof next.current_slide === "number") {
            setState({
              current_slide: next.current_slide,
              is_live: Boolean(next.is_live),
              is_blank: Boolean(next.is_blank),
            });
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [deck.id]);

  // 2-second poll fallback — also the primary sync path pre-Supabase.
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/deck/${deck.slug}/state`, { cache: "no-store" });
        if (!res.ok) return;
        const next = (await res.json()) as DeckState;
        const prev = stateRef.current;
        if (
          next.current_slide !== prev.current_slide ||
          next.is_live !== prev.is_live ||
          next.is_blank !== prev.is_blank
        ) {
          setState({
            current_slide: next.current_slide,
            is_live: next.is_live,
            is_blank: Boolean(next.is_blank),
          });
        }
      } catch {
        // Network hiccup — realtime or the next poll will catch up.
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [deck.slug]);

  // Self-paced navigation when not live
  const go = useCallback(
    (delta: number) => {
      setSelfIndex((i) => Math.min(count - 1, Math.max(0, i + delta)));
    },
    [count],
  );

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void rootRef.current?.requestFullscreen?.();
    }
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
        return;
      }
      if (isLive) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") go(1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") go(-1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isLive, go, toggleFullscreen]);

  // Entering live mode: hand the cursor to the presenter.
  useEffect(() => {
    if (isLive) setSelfIndex(state.current_slide - 1);
  }, [isLive, state.current_slide]);

  // Cross-fade between slides via the View Transitions API. Skipped for
  // video-background decks (the snapshot would freeze the loop) and for
  // reduced-motion users; both fall back to an instant swap.
  const [shownIndex, setShownIndex] = useState(index);
  useEffect(() => {
    if (shownIndex === index) return;
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => {
        finished: Promise<void>;
        ready: Promise<void>;
        updateCallbackDone: Promise<void>;
      };
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !hasMedia && !reduced) {
      const transition = doc.startViewTransition(() => {
        flushSync(() => setShownIndex(index));
      });
      // Advancing again mid-fade skips the running transition, rejecting
      // these promises. That is expected — swallow it so a fast presenter
      // never fills the console with errors during a service.
      const ignore = () => {};
      transition.finished.catch(ignore);
      transition.ready.catch(ignore);
      transition.updateCallbackDone.catch(ignore);
    } else {
      setShownIndex(index);
    }
  }, [index, shownIndex, hasMedia]);

  const slide = deck.slides[shownIndex] ?? deck.slides[index];
  if (!slide) return null;

  const activeBg = slide.bg && deck.backgrounds[slide.bg] ? slide.bg : bgKeys[0];
  const blanked = isLive && state.is_blank;

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-pitch"
    >
      {/* Background layers — all mounted, active one faded in. */}
      {bgKeys.map((bgKey) => {
        const layer = deck.backgrounds[bgKey];
        const on = bgKey === activeBg;
        const cls = `absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          on ? "opacity-100" : "opacity-0"
        }`;
        return layer.video ? (
          <video
            key={bgKey}
            className={cls}
            src={layer.video}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden
          />
        ) : layer.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- decorative full-bleed layer
          <img key={bgKey} className={cls} src={layer.image} alt="" aria-hidden />
        ) : null;
      })}
      {hasMedia && (
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(rgb(13_9_6/0.45),rgb(13_9_6/0.45))] [box-shadow:inset_0_0_30vh_12vh_rgb(13_9_6/0.55)]"
        />
      )}

      {/* Slide content */}
      <div
        className={`relative z-10 w-full max-w-[calc(100dvh*16/9)] transition-opacity duration-500 ${
          blanked ? "opacity-0" : "opacity-100"
        }`}
        onClick={
          isLive
            ? undefined
            : (e) => {
                const { left, width } = e.currentTarget.getBoundingClientRect();
                go(e.clientX - left < width / 2 ? -1 : 1);
              }
        }
      >
        <SlideFrame
          key={slide.position}
          html={slide.html}
          className={hasMedia ? "on-media" : ""}
        />
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex items-center justify-between px-5 py-4">
        <p className="text-[0.8rem] tabular-nums text-ash/70">
          {index + 1} / {count}
        </p>
        {isLive ? (
          <p className="eyebrow flex items-center gap-2 text-lamplight">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-lamplight" aria-hidden />
            Live
          </p>
        ) : (
          <p className="text-[0.8rem] text-ash/70">
            Self-paced — tap or use arrow keys · F fullscreen
          </p>
        )}
      </div>
    </div>
  );
}
