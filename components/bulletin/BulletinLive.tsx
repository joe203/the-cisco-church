"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getBrowserClient } from "@/lib/supabase/client";

/**
 * Keeps an open bulletin page current: when a bulletin is published or edited,
 * the page updates in place. RLS means the browser only hears about published
 * rows. A dropped connection is covered by StayCurrent, which refreshes the
 * page when the visitor comes back to it.
 */
export function BulletinLive() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getBrowserClient();
    if (!supabase) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const channel = supabase
      .channel("bulletins")
      .on("postgres_changes", { event: "*", schema: "cisco", table: "cisco_bulletins" }, () => {
        clearTimeout(timer);
        timer = setTimeout(() => router.refresh(), 500);
      })
      .subscribe();
    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
