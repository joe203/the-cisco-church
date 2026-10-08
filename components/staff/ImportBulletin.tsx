"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { formatDate } from "@/lib/format";

type Failure = { text: string; date?: string; canReplace?: boolean };

export function ImportBulletin({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<Failure | null>(null);

  async function upload(replace: boolean) {
    if (!file) return;
    setBusy(true);
    setFailure(null);
    const body = new FormData();
    body.set("file", file);
    if (replace) body.set("replace", "1");
    try {
      const res = await fetch("/api/staff/bulletins/import", { method: "POST", body });
      const data = (await res.json().catch(() => null)) as
        | { date?: string; error?: string; canReplace?: boolean }
        | null;
      if (res.ok && data?.date) {
        router.push(`/staff/bulletin/${data.date}?imported=1`);
        return;
      }
      setFailure({
        text: data?.error ?? "That didn't work. Try again.",
        date: data?.date,
        canReplace: data?.canReplace,
      });
    } catch {
      setFailure({ text: "You appear to be offline. Check your connection and try again." });
    }
    setBusy(false);
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-panel-light">
      <h2 className="font-display text-[1.3rem] font-bold">Upload the finished paper bulletin</h2>
      <p className="mt-1 text-[0.92rem] text-ink/72">
        Save the bulletin as a PDF and upload it. It’s read for you and turned into a draft for that
        Sunday — nothing goes public until you publish.
      </p>

      {enabled ? (
        <>
          <div className="mt-5">
            <input
              ref={input}
              id="bulletin-pdf"
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setFailure(null);
              }}
            />
            <label
              htmlFor="bulletin-pdf"
              className="eyebrow inline-block cursor-pointer rounded-full border-2 border-teal bg-teal/10 px-6 py-3.5 text-deepsea transition-transform duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 active:translate-y-0"
            >
              {file ? "Choose a different PDF" : "1. Choose a PDF"}
            </label>
            {file && <p className="mt-3 text-[0.92rem] break-all text-ink/75">{file.name}</p>}
          </div>

          <button
            type="button"
            disabled={!file || busy}
            onClick={() => upload(false)}
            className="btn-teal mt-5 cursor-pointer disabled:cursor-default disabled:opacity-45"
          >
            {busy ? "Reading the bulletin…" : "2. Read this bulletin"}
          </button>
          {busy && (
            <p role="status" className="mt-3 text-[0.9rem] text-ink/72">
              This takes about a minute. Keep this page open.
            </p>
          )}
        </>
      ) : (
        <p className="mt-4 rounded-xl bg-marigold/25 px-4 py-3 text-[0.9rem] font-semibold">
          Uploading isn’t switched on yet. You can still start a bulletin and type it in.
        </p>
      )}

      {failure && (
        <div role="alert" className="mt-4 text-[0.92rem] font-semibold text-clay">
          <p>{failure.text}</p>
          {failure.date && (
            <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
              <a href={`/staff/bulletin/${failure.date}`} className="link-under text-teal">
                Open {formatDate(failure.date)}
              </a>
              {failure.canReplace && (
                <button
                  type="button"
                  onClick={() => upload(true)}
                  disabled={busy}
                  className="link-under cursor-pointer text-coral disabled:opacity-50"
                >
                  Replace that draft with this upload
                </button>
              )}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
