"use client";

/** Some members will want this on paper. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="min-h-11 rounded-sm text-left text-[1.05rem] font-bold text-white underline decoration-marigold decoration-2 underline-offset-[6px] transition-opacity duration-300 hover:opacity-80 focus-visible:outline-marigold active:opacity-60 print:hidden"
    >
      Print this page
    </button>
  );
}
