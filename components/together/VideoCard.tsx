"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
  poster: string;
  alt: string;
  /** Hosted file on this site (members-only). Null until the clip is recorded. */
  src: string | null;
  /** Aspect of the frame: phone clips are tall, Joe's is wide. */
  shape: "wide" | "tall";
  label: string;
  sizes: string;
  priority?: boolean;
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="ml-1 size-7 fill-current">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.8-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

export function VideoCard({ poster, alt, src, shape, label, sizes, priority }: Props) {
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  const play = () => {
    setPlaying(true);
    requestAnimationFrame(() => video.current?.play());
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-ink ${
        shape === "wide" ? "aspect-video" : "aspect-[9/16]"
      }`}
    >
      {playing && src ? (
        <video
          ref={video}
          src={src}
          controls
          playsInline
          preload="metadata"
          className="size-full object-cover"
        />
      ) : (
        <>
          <Image
            src={poster}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"
          />
          <button
            type="button"
            onClick={play}
            aria-label={label}
            className="group absolute inset-0 flex items-center justify-center focus-visible:outline-offset-[-6px]"
          >
            <span
              className={`flex items-center justify-center rounded-full bg-cloud text-coral shadow-[var(--shadow-card-lift)] transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-110 group-active:scale-95 ${
                shape === "wide" ? "size-20" : "size-16"
              }`}
            >
              <PlayIcon />
            </span>
          </button>
        </>
      )}
    </div>
  );
}
