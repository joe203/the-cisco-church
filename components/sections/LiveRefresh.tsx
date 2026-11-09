"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Keeps an open page current: when any of `tables` changes in the database,
 * the page updates in place. RLS means the browser only hears about rows the
 * public may read (e.g. published bulletins). The Supabase client loads after
 * the page is up, so it never delays first paint. A dropped connection is
 * covered by StayCurrent, which refreshes the page when the visitor returns.
 */
export function LiveRefresh({ tables }: { tables: string[] }) {
  const router = useRouter();
  const key = tables.join(",");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    import("@/lib/supabase/client").then(({ getBrowserClient }) => {
      const supabase = getBrowserClient();
      if (!supabase || cancelled) return;
      const channel = supabase.channel(`live:${key}`);
      for (const table of key.split(",")) {
        channel.on("postgres_changes", { event: "*", schema: "cisco", table }, () => {
          clearTimeout(timer);
          timer = setTimeout(() => router.refresh(), 500);
        });
      }
      channel.subscribe();
      cleanup = () => {
        supabase.removeChannel(channel);
      };
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      cleanup?.();
    };
  }, [key, router]);

  return null;
}
