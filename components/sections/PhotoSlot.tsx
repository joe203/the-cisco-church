import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

type PhotoSlotProps = {
  /** Filename inside public/images/ — the slot lights up when the file exists. */
  file: string;
  alt: string;
  /** Shown inside the placeholder frame until the real photo arrives. */
  caption: string;
  className?: string;
};

/**
 * A photo slot that renders the real image when it has been dropped into
 * public/images/, and an intentional framed placeholder until then.
 * Server component — checks the filesystem at render time.
 */
export function PhotoSlot({ file, alt, caption, className = "" }: PhotoSlotProps) {
  const exists = fs.existsSync(path.join(process.cwd(), "public", "images", file));

  if (exists) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={`/images/${file}`}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-sand ${className}`} role="img" aria-label={alt}>
      <div className="absolute inset-3 flex flex-col items-center justify-center gap-3 rounded-lg border border-teal/30 px-6 text-center sm:inset-4">
        <p className="eyebrow text-teal">Photograph to come</p>
        <p className="max-w-[34ch] text-[0.85rem] leading-relaxed text-ink/60">{caption}</p>
      </div>
    </div>
  );
}
