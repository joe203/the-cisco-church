"use client";

export function PrintButton({ label = "Print this bulletin" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="eyebrow link-under cursor-pointer text-teal hover:text-deepsea print:hidden"
    >
      {label}
    </button>
  );
}
