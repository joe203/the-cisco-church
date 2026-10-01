"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="eyebrow link-under cursor-pointer text-teal hover:text-deepsea print:hidden"
    >
      Print this bulletin
    </button>
  );
}
