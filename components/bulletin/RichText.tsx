import type { ReactNode } from "react";

/**
 * Tiny, safe inline markup for bulletin copy: **bold** and *italic*, blank
 * line = new paragraph, single newline = line break. Builds React nodes —
 * never HTML — so nothing a staff member types can inject markup.
 */

function inline(line: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let n = 0;
  while ((match = pattern.exec(line))) {
    if (match.index > last) out.push(line.slice(last, match.index));
    out.push(
      match[1] !== undefined ? (
        <strong key={`${keyBase}-${n}`} className="font-bold text-ink">
          {match[1]}
        </strong>
      ) : (
        <em key={`${keyBase}-${n}`}>{match[2]}</em>
      ),
    );
    last = match.index + match[0].length;
    n += 1;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export function paragraphs(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function RichLines({ text, keyBase = "l" }: { text: string; keyBase?: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {inline(line, `${keyBase}${i}`)}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}
