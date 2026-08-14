"use client";

import DOMPurify from "isomorphic-dompurify";
import { useMemo } from "react";
import "@/app/slides/slides.css";

type SlideFrameProps = {
  html: string;
  className?: string;
};

/**
 * Renders one stored slide fragment. The HTML is ALWAYS sanitized before
 * injection — no exceptions, even though only Joe authors slides.
 */
export function SlideFrame({ html, className = "" }: SlideFrameProps) {
  const clean = useMemo(
    () =>
      DOMPurify.sanitize(html, {
        FORBID_TAGS: ["script", "style", "iframe", "form", "input"],
        FORBID_ATTR: ["onerror", "onclick", "onload", "style"],
      }),
    [html],
  );

  return (
    <div className={`slide-frame ${className}`}>
      <div className="slide-body" dangerouslySetInnerHTML={{ __html: clean }} />
    </div>
  );
}
