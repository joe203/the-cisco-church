"use client";

import DOMPurify from "isomorphic-dompurify";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Deck, DeckState } from "@/lib/types";
import { SlideFrame } from "./SlideFrame";

const KEY_STORAGE = "cisco-presenter-key";

type PresenterProps = {
  deck: Deck;
  initialState: DeckState;
};

type NotesByPosition = Record<number, string | null>;

/** Clicker + keyboard bindings. Presentation clickers send PageUp/PageDown. */
const NEXT_KEYS = ["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"];
const PREV_KEYS = ["ArrowLeft", "ArrowUp", "PageUp", "Backspace"];

function OutlineHtml({ html, className = "" }: { html: string; className?: string }) {
  const clean = useMemo(
    () =>
      DOMPurify.sanitize(html, {
        FORBID_TAGS: ["script", "style", "iframe", "form", "input", "img"],
        FORBID_ATTR: ["onerror", "onclick", "onload", "style"],
      }),
    [html],
  );
  return (
    <div
      className={`text-[0.95rem] leading-[1.7] [&_em]:italic [&_p+p]:mt-2 [&_strong]:font-semibold [&_strong]:text-lamplight ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

/**
 * The controller: a locked slide preview centered on top, the full sermon
 * outline scrolling beneath it. Tap any outline segment to put that slide
 * on the screen; the current segment stays highlighted so you never lose
 * your place. Key is entered once and held in sessionStorage. Advances are
 * optimistic — the presenter never waits on the network.
 */
export function Presenter({ deck, initialState }: PresenterProps) {
  const [keyInput, setKeyInput] = useState("");
  const [authState, setAuthState] = useState<"unknown" | "checking" | "ok" | "bad">("unknown");
  const [notes, setNotes] = useState<NotesByPosition>({});
  const [index, setIndex] = useState(initialState.current_slide - 1);
  const [isLive, setIsLive] = useState(initialState.is_live);
  const [isBlank, setIsBlank] = useState(initialState.is_blank);
  const [syncError, setSyncError] = useState(false);
  const keyRef = useRef<string | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

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
          is_blank?: boolean;
        };
        if (res.ok && data.notes) {
          keyRef.current = candidate;
          sessionStorage.setItem(KEY_STORAGE, candidate);
          setNotes(Object.fromEntries(data.notes.map((n) => [n.position, n.notes])));
          if (typeof data.current_slide === "number") setIndex(data.current_slide - 1);
          if (typeof data.is_live === "boolean") setIsLive(data.is_live);
          if (typeof data.is_blank === "boolean") setIsBlank(data.is_blank);
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

  const goTo = useCallback(
    (nextIndex: number) => {
      const clamped = Math.min(count - 1, Math.max(0, nextIndex));
      setIndex(clamped);
      void post({ action: "jump", position: clamped + 1 });
    },
    [count, post],
  );

  const toggleBlank = useCallback(() => {
    setIsBlank((b) => !b);
    void post({ action: "blank" });
  }, [post]);

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
      if (NEXT_KEYS.includes(e.key)) {
        e.preventDefault();
        goTo(indexRef.current + 1);
      } else if (PREV_KEYS.includes(e.key)) {
        e.preventDefault();
        goTo(indexRef.current - 1);
      } else if (e.key === "b" || e.key === "B" || e.key === ".") {
        e.preventDefault();
        toggleBlank();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [authState, goTo, toggleBlank]);

  // Keep the highlighted outline segment in view as the sermon advances.
  useEffect(() => {
    if (authState !== "ok") return;
    itemRefs.current[index]?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [authState, index]);

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
          <p className="eyebrow text-lamplight">Controls</p>
          <h1 className="font-display mt-3 text-[2rem] text-cream">{deck.title}</h1>
          <label className="mt-8 block text-[0.9rem] text-ash" htmlFor="presenter-key">
            Key
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
            {authState === "checking" ? "Checking…" : "Open controls"}
          </button>
        </form>
      </div>
    );
  }

  /* ---------------- controller ---------------- */
  const slide = deck.slides[index];
  const isBackgroundOnly = slide.html.trim() === "";

  return (
    <div className="flex h-dvh flex-col bg-pitch">
      {/* Locked header: centered preview + controls. The outline scrolls
          in its own region beneath, so this never leaves the screen. */}
      <header className="border-b border-cream/10 px-4 pt-3 pb-3">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-baseline justify-between gap-3 pb-2">
            <p className="truncate text-[0.85rem] font-semibold text-cream">{deck.title}</p>
            <p className="text-[0.85rem] tabular-nums text-ash">
              {index + 1} / {count}
              {slide.bg && <span className="ml-2 text-lamplight">{slide.bg}</span>}
            </p>
          </div>

          <div
            className="relative cursor-pointer select-none"
            onClick={(e) => {
              const { left, width } = e.currentTarget.getBoundingClientRect();
              goTo(e.clientX - left < width * 0.25 ? index - 1 : index + 1);
            }}
          >
            <SlideFrame key={slide.position} html={slide.html} className="preview" />
            {(isBackgroundOnly || isBlank) && (
              <p className="eyebrow absolute inset-0 flex items-center justify-center text-[0.6rem] text-ash">
                {isBlank ? "Screen blanked" : "Background only"}
              </p>
            )}
            <p className="eyebrow absolute top-2 right-2 rounded-sm border border-cream/20 bg-pitch/70 px-1.5 py-1 text-[0.55rem] text-cream/80">
              tap = next
            </p>
          </div>

          <div className="mt-2.5 flex gap-2">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="flex-1 border border-cream/25 py-3 text-[0.95rem] text-cream transition-opacity duration-300 active:opacity-70 disabled:opacity-30"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              disabled={index === count - 1}
              className="flex-[1.6] bg-lamplight py-3 text-[0.95rem] font-semibold text-pitch transition-opacity duration-300 active:opacity-80 disabled:opacity-30"
            >
              Next →
            </button>
            <button
              type="button"
              onClick={toggleBlank}
              className={
                isBlank
                  ? "flex-1 border border-lamplight bg-lamplight py-3 text-[0.9rem] font-semibold text-pitch"
                  : "flex-1 border border-cream/25 py-3 text-[0.9rem] text-cream transition-opacity duration-300 active:opacity-70"
              }
            >
              Blank
            </button>
            <button
              type="button"
              onClick={toggleLive}
              className={
                isLive
                  ? "flex-1 border border-lamplight bg-lamplight py-3 text-[0.9rem] font-semibold text-pitch"
                  : "flex-1 border border-cream/25 py-3 text-[0.9rem] text-cream transition-opacity duration-300 active:opacity-70"
              }
            >
              {isLive ? "● Live" : "Go live"}
            </button>
          </div>

          {syncError && (
            <p className="mt-2 text-[0.8rem] text-lamplight">
              Sync failed — the screen may lag. Retrying on the next tap.
            </p>
          )}
        </div>
      </header>

      {/* The outline — scrolls behind the locked header. */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-[45vh]">
        <div className="mx-auto w-full max-w-2xl">
          <h2 className="eyebrow pb-3 text-lamplight">Outline — tap a segment to show its slide</h2>
          {deck.slides.map((s, k) => {
            const noteText = notes[s.position];
            const isCurrent = k === index;
            return (
              <div
                key={s.position}
                ref={(el) => {
                  itemRefs.current[k] = el;
                }}
                onClick={() => goTo(k)}
                className={`mb-1 cursor-pointer rounded-r-sm border-l-2 py-3 pr-2 pl-4 transition-colors duration-150 ${
                  isCurrent
                    ? "border-lamplight bg-lamplight/10"
                    : "border-cream/15 hover:bg-cream/5"
                }`}
              >
                <p className={`eyebrow pb-1.5 text-[0.6rem] ${isCurrent ? "text-lamplight" : "text-ash/70"}`}>
                  {k + 1}
                  {s.bg && <span className="ml-2">{s.bg}</span>}
                  {s.html.trim() === "" && <span className="ml-2">background only</span>}
                </p>
                {s.outline_html ? (
                  <OutlineHtml html={s.outline_html} className="text-cream/90" />
                ) : (
                  <p className="text-[0.95rem] leading-[1.7] whitespace-pre-wrap text-cream/90">
                    {noteText || `Slide ${k + 1}`}
                  </p>
                )}
                {s.outline_html && noteText && (
                  <p className="mt-2 text-[0.8rem] leading-relaxed whitespace-pre-wrap text-ash italic">
                    {noteText}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
