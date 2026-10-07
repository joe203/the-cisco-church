"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** "Sermon recap" — shown in the window's title bar. */
  label: string;
  sermonTitle: string;
  /** What the window shows: the bare sheet page, or the PDF itself. */
  src: string;
  /** Full-page version, for phones that can't scroll a PDF inside a window. */
  openUrl: string;
  downloadUrl: string;
  filename: string;
};

/**
 * "View" opens the handout in a window over the page, so the visitor never
 * leaves their place in the list. Built on the native <dialog>: Escape closes
 * it, focus is trapped inside, and focus returns to the button on close.
 */
export function ViewModal({ label, sermonTitle, src, openUrl, downloadUrl, filename }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const unlock = () => {
      document.body.style.overflow = "";
    };
    dialog.addEventListener("close", unlock);
    return () => {
      dialog.removeEventListener("close", unlock);
      unlock();
    };
  }, []);

  function open() {
    setOpened(true);
    document.body.style.overflow = "hidden";
    dialogRef.current?.showModal();
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="view-btn"
        aria-haspopup="dialog"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-[1.05rem]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        View
        <span className="sr-only">
          {" "}
          {label} for {sermonTitle}
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={`${label}: ${sermonTitle}`}
        onClick={(e) => {
          // Only the dimmed area outside the window is the dialog element itself.
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="view-dialog"
      >
        <div className="flex h-full flex-col">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink/12 bg-cloud px-4 py-3 sm:px-5">
            <div className="min-w-0 basis-[calc(100%-3.5rem)] sm:flex-1 sm:basis-0">
              <p className="eyebrow text-teal">{label}</p>
              <p className="font-display truncate text-[1.05rem] leading-tight font-bold text-ink">{sermonTitle}</p>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="view-close sm:order-last"
              aria-label="Close"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            <a
              href={openUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-under text-[0.85rem] font-semibold text-ink/70 hover:text-ink"
            >
              Open full page
            </a>
            <a href={downloadUrl} download={filename} className="btn-coral !px-5 !py-2.5 !text-[0.88rem]">
              <span aria-hidden>&darr;</span> Download
            </a>
          </div>
          {opened && <iframe src={src} title={`${label}: ${sermonTitle}`} className="min-h-0 w-full flex-1 bg-sand" />}
        </div>
      </dialog>
    </>
  );
}
