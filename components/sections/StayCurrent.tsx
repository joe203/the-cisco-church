"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CHECK_EVERY_MS = 2 * 60 * 1000;
const REFRESH_AFTER_AWAY_MS = 30 * 1000;
const RELOADED_KEY = "site-build-reloaded";

/** True when reloading the page right now would interrupt the visitor. */
function isBusy() {
  if (document.activeElement?.matches("input, textarea, select, iframe, [contenteditable]")) return true;
  if (document.querySelector("dialog[open]")) return true;
  const fillingForm = [...document.querySelectorAll("form")].some((form) => form.closest("dialog")?.open ?? true);
  if (fillingForm) return true;
  return [...document.querySelectorAll<HTMLMediaElement>("video, audio")].some((m) => !m.paused && !m.muted);
}

/** One reload per release, so a mismatch can never become a reload loop. */
function claimReload(build: string) {
  try {
    if (sessionStorage.getItem(RELOADED_KEY) === build) return false;
    sessionStorage.setItem(RELOADED_KEY, build);
  } catch {
    // Storage blocked: the reload below is still safe, the page just loads fresh.
  }
  return true;
}

/**
 * Keeps a page that has been sitting open current. Coming back to the tab
 * refreshes its content in place; a new day (announcements and events roll over
 * by date) does the same; and a new release of the site reloads the page, waiting
 * if the visitor is typing, in a dialog, or playing something with sound.
 */
export function StayCurrent({ build, day }: { build: string; day: string }) {
  const router = useRouter();

  useEffect(() => {
    let currentDay = day;
    let hiddenAt = 0;

    // Next.js turns router.refresh() into a full reload once a new release is up,
    // so the release check has to come first or it would wipe a half-filled form.
    async function check(refresh = false) {
      try {
        const res = await fetch("/api/site-version", { cache: "no-store" });
        if (!res.ok) return;
        const latest = (await res.json()) as { build: string; day: string };
        if (latest.build !== build) {
          if (!isBusy() && claimReload(latest.build)) window.location.reload();
          return;
        }
        if (refresh || latest.day !== currentDay) {
          currentDay = latest.day;
          router.refresh();
        }
      } catch {
        // Offline or mid-deploy: the next check tries again.
      }
    }

    function onVisibility() {
      if (document.visibilityState === "hidden") {
        hiddenAt = Date.now();
        return;
      }
      check(Date.now() - hiddenAt > REFRESH_AFTER_AWAY_MS);
    }

    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) check(true);
    }

    const timer = setInterval(() => {
      if (document.visibilityState === "visible") check();
    }, CHECK_EVERY_MS);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [build, day, router]);

  return null;
}
