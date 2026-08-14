"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import type { Deck, DeckState } from "@/lib/types";
import { SlideFrame } from "./SlideFrame";

type LiveViewerProps = {
  deck: Deck;
  initialState: DeckState;
};

/**
 * Fullscreen viewer. While the deck is live it follows the presenter's
 * cursor over Supabase Realtime, with a 5s poll as belt-and-suspenders —
 * a dropped socket mid-service must never strand a projected screen.
 * When not live, it becomes self-paced.
 */
export function LiveViewer({ deck, initialState }: LiveViewerProps) {
  const [state, setState] = useState<DeckState>(initialState);
  const [selfIndex, setSelfIndex] = useState(initialState.current_slide - 1);
  const stateRef = useRef(state);
  stateRef.current = state;

  const count = deck.slides.length;
  const isLive = state.is_live;
  const index = isLive
    ? Math.min(count - 1, Math.max(0, state.current_slide - 1))
    : Math.min(count - 1, Math.max(0, selfIndex));

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
            });
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [deck.id]);

  // 5-second poll fallback
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/deck/${deck.slug}/state`, { cache: "no-store" });
        if (!res.ok) return;
        const next = (await res.json()) as DeckState;
        const prev = stateRef.current;
        if (next.current_slide !== prev.current_slide || next.is_live !== prev.is_live) {
          setState({ current_slide: next.current_slide, is_live: next.is_live });
        }
      } catch {
        // Network hiccup — realtime or the next poll will catch up.
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [deck.slug]);

  // Self-paced navigation when not live
  const go = useCallback(
    (delta: number) => {
      setSelfIndex((i) => Math.min(count - 1, Math.max(0, i + delta)));
    },
    [count],
  );

  useEffect(() => {
    if (isLive) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isLive, go]);

  // Entering live mode: hand the cursor to the presenter.
  useEffect(() => {
    if (isLive) setSelfIndex(state.current_slide - 1);
  }, [isLive, state.current_slide]);

  const slide = deck.slides[index];
  if (!slide) return null;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-pitch">
      <div
        className="relative w-full max-w-[calc(100dvh*16/9)]"
        onClick={
          isLive
            ? undefined
            : (e) => {
                const { left, width } = e.currentTarget.getBoundingClientRect();
                go(e.clientX - left < width / 2 ? -1 : 1);
              }
        }
      >
        <SlideFrame key={slide.position} html={slide.html} />
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 flex items-center justify-between px-5 py-4">
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
            Self-paced — tap or use arrow keys
          </p>
        )}
      </div>
    </div>
  );
}
