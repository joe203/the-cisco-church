import type { Sermon } from "./types";

/**
 * Sermon videos live at video.fivesixteen.church (docs/video-hosting.md).
 * The link is stored in the sermon's `youtube_url` column (named before we
 * hosted our own video); older lessons still hold real YouTube links.
 */
const HOSTED = /^https:\/\/video\.fivesixteen\.church\/([a-z0-9]+)\/?$/i;

/** The video's id when it is one of ours, so it can play here; otherwise null. */
export function hostedVideoId(url: string | null | undefined): string | null {
  return url?.trim().match(HOSTED)?.[1] ?? null;
}

export function embedUrl(id: string): string {
  return `https://video.fivesixteen.church/${id}/embed`;
}

/**
 * Where "Watch" goes: our own watch page for hosted videos, the outside
 * link (YouTube) for older ones, or nothing when there is no video yet.
 */
export function watchLink(sermon: Pick<Sermon, "slug" | "youtube_url">): { href: string; external: boolean } | null {
  if (hostedVideoId(sermon.youtube_url)) return { href: `/sermons/${sermon.slug}/watch`, external: false };
  if (sermon.youtube_url) return { href: sermon.youtube_url, external: true };
  return null;
}
