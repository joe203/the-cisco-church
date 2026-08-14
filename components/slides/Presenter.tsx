"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Deck, DeckState } from "@/lib/types";
import { SlideFrame } from "./SlideFrame";

const KEY_STORAGE = "cisco-presenter-key";

type PresenterProps = {
  deck: Deck;
  initialState: DeckState;
};

type NotesByPosition = Record<number, string | null>;

/**
 * Presenter controls. The key is entered once and held in sessionStorage.
 * Slide advances are optimistic — the presenter never waits on the network —
 * and every change POSTs to the state route, which writes with the service
 * role key after verifying the presenter secret.
 */
export function Presenter({ deck, initialState }: PresenterProps) {
  const [key, setKey] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [authState, setAuthState] = useState<"unknown" | "checking" | "ok" | "bad">("unknown");
  const [notes, setNotes] = useState<NotesByPosition>({});
  const [index, setIndex] = useState(initialState.current_slide - 1);
  const [isLive, setIsLive] = useState(initialState.is_live);
  const [syncError, setSyncError] = useState(false);
  const keyRef = useRef<string | null>(null);

  const count = deck.slides.length;

  const verify = useCallback(
    async (candidate: string) => {
      setAuthState("checking");
      try {
        const res = await fetch(
          `/api/deck/${deck.slug}/state?key=${encodeURIComponent(candidate)}`,
          { cache: "no-store" },
        );
        const data = (await res.json()) as {
          notes?: { position: number; notes: string | null }[];
          current_slide?: number;
          is_live?: boolean;
        };
        if (res.ok && data.notes) {
          keyRef.current = candidate;
          setKey(candidate);
          sessionStorage.setItem(KEY_STORAGE, candidate);
          setNotes(Object.fromEntries(data.notes.map((n) => [n.position, n.notes])));
          if (typeof data.current_slide === "number") setIndex(data.current_slide - 1);
          if (typeof data.is_live === "boolean") setIsLive(data.is_live);
          setAuthState("ok");
        } else {
          setAuthState("bad");
        }
      } catch {
        setAuthState("bad");
      }
    },
    [deck.slug],
  );

  useEffect(() => {
    const stored = sessionStorage.getItem(KEY_STORAGE);
    if (stored) void verify(stored);
  }, [verify]);

  const post = useCallback(
    async (body: Record<string, unknown>) => {
      const currentKey = keyRef.current;
      if (!currentKey) return;
      try {
        const res = await fetch(`/api/deck/${deck.slug}/state`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: currentKey, ...body }),
        });
        setSyncError(!res.ok);
      } catch {
        setSyncError(true);
      }
    },
    [deck.slug],
  );

  // Optimistic navigation — update locally first, then tell the server.
  const goTo = useCallback(
    (nextIndex: number) => {
      const clamped = Math.min(count - 1, Math.max(0, nextIndex));
      setIndex(clamped);
      void post({ action: "jump", position: clamped + 1 });
    },
    [count, post],
  );

  const toggleLive = useCallback(() => {
    setIsLive((live) => {
      void post({ action: live ? "end" : "live" });
      return !live;
    });
  }, [post]);

  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => {
    if (authState !== "ok") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goTo(indexRef.current + 1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(indexRef.current - 1);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [authState, goTo]);

  /* ---------------- key gate ---------------- */
  if (authState !== "ok") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-pitch px-5">
        <form
          className="w-full max-w-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (keyInput.trim()) void verify(keyInput.trim());
          }}
        >
          <p className="eyebrow text-lamplight">Presenter</p>
          <h1 className="font-display mt-3 text-[2rem] text-cream">{deck.title}</h1>
          <label className="mt-8 block text-[0.9rem] text-ash" htmlFor="presenter-key">
            Presenter key
          </label>
          <input
            id="presenter-key"
            type="password"
            autoComplete="off"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="mt-2 w-full border border-cream/25 bg-espresso px-4 py-3 text-cream outline-none focus-visible:border-lamplight"
          />
          {authState === "bad" && (
            <p className="mt-3 text-[0.85rem] text-lamplight">
              That key didn&rsquo;t match. Check it and try again.
            </p>
          )}
          <button
            type="submit"
            disabled={authState === "checking"}
            className="btn-gold mt-6 w-full justify-center disabled:opacity-60"
          >
            {authState === "checking" ? "Checking…" : "Open presenter"}
          </button>
        </form>
      </div>
    );
  }

  /* ---------------- presenter ---------------- */
  const slide = deck.slides[index];
  const next = deck.slides[index + 1] ?? null;

  return (
    <div className="min-h-dvh bg-pitch px-4 py-4 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.9rem] font-semibold text-cream">{deck.title}</p>
        <div className="flex items-center gap-4">
          {syncError && (
            <p className="text-[0.8rem] text-lamplight">
              Sync failed — viewers may lag. Retrying on next advance.
            </p>
          )}
          <p className="text-[0.9rem] tabular-nums text-ash">
            {index + 1} / {count}
          </p>
          <button
            type="button"
            onClick={toggleLive}
            className={
              isLive
                ? "border border-lamplight bg-lamplight px-4 py-2 text-[0.8rem] font-semibold tracking-[0.14em] text-pitch uppercase transition-opacity duration-300 hover:opacity-85"
                : "border border-cream/30 px-4 py-2 text-[0.8rem] font-semibold tracking-[0.14em] text-cream uppercase transition-opacity duration-300 hover:opacity-85"
            }
          >
            {isLive ? "● Live — tap to end" : "Go live"}
          </button>
        </div>
      </header>

      <div className="mt-4 lg:grid lg:grid-cols-[2fr_1fr] lg:gap-5">
        {/* Current slide — tap left/right half to navigate */}
        <div
          className="relative cursor-pointer select-none"
          onClick={(e) => {
            const { left, width } = e.currentTarget.getBoundingClientRect();
            goTo(e.clientX - left < width / 2 ? index - 1 : index + 1);
          }}
        >
          <SlideFrame key={slide.position} html={slide.html} />
        </div>

        <div className="mt-5 lg:mt-0">
          {next ? (
            <>
              <p className="eyebrow text-ash">Next</p>
              <SlideFrame html={next.html} className="mt-2 opacity-70" />
            </>
          ) : (
            <p className="eyebrow text-ash">Last slide</p>
          )}

          <p className="eyebrow mt-6 text-lamplight">Notes</p>
          <p className="mt-2 min-h-16 text-[1.05rem] leading-relaxed text-cream">
            {notes[slide.position] ?? <span className="text-ash">No notes for this slide.</span>}
          </p>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="flex-1 border border-cream/25 py-3 text-cream disabled:opacity-30"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              disabled={index === count - 1}
              className="flex-1 bg-lamplight py-3 font-semibold text-pitch disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
