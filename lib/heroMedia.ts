/**
 * Hero reel rotation — the desktop hero cycles through this list in order,
 * cutting cleanly between items, then loops back to the start.
 *
 * Currently a single entry: Joe's own ~28s edit, framed for the glass
 * diagonal (see CURRENT_STATUS → "Homepage hero"). The notes below apply
 * if it ever goes back to a multi-item rotation.
 *
 * A rotation is a highlight reel, not raw footage playback: keep every item
 * SHORT (video ~1.5–2s, stills ~2–2.5s). The point — per Joe, modeled on
 * oakhills.church's hero — is quick, confident beats that a visitor
 * doesn't have time to scrutinize, not lingering on any one shot.
 *
 * To swap in new footage: drop compressed clips in public/videos/hero/,
 * add stills to public/images/, and edit this array. Nothing in Hero.tsx
 * or HeroReel.tsx needs to change.
 *
 * - type "video": file/poster are paths under public/, relative to /.
 *   `speed` sets playbackRate (1 = normal, 0.6 = slow motion). `duration`
 *   is the clip's trimmed length in seconds *before* speed is applied —
 *   it's only used as a safety-net timer (advance normally happens on the
 *   video's "ended" event; this just guarantees the reel can never get
 *   stuck if autoplay is blocked or a clip fails to load). Clips should
 *   already be muted, cropped, and compressed — see CURRENT_STATUS for the
 *   ffmpeg recipe. IMPORTANT: only cut clips from portions where the
 *   subject holds a relatively stable position — the reel panel is a tall,
 *   narrow crop (see `focus` below), and a moving subject walks straight
 *   out of a static crop window. If someone's walking/pacing in the
 *   source footage, either skip it or trim to a sub-second window before
 *   they drift, or use a still frame instead.
 * - type "image": a still with a Ken Burns pan/zoom. `duration` (seconds)
 *   controls how long it holds before advancing. `pan` picks a drift
 *   direction for the zoom.
 * - `focus` (both types): CSS object-position, e.g. "70% 30%" — where in
 *   the frame the subject actually is. Check the clip's poster/first frame
 *   (or the still itself) to find a good value; it's per-item because
 *   camera framing differs shot to shot. Defaults to "50% 35%" if omitted.
 */

export type HeroReelItem =
  | {
      type: "video";
      file: string;
      poster: string;
      duration: number;
      speed?: number;
      focus?: string;
      alt: string;
    }
  | {
      type: "image";
      file: string;
      duration: number;
      pan: "left" | "right" | "up" | "down";
      focus?: string;
      alt: string;
    };

// A single entry loops on its own; two or more rotate as described above.
export const heroReel: HeroReelItem[] = [
  {
    type: "video",
    file: "/videos/hero/hero-reel-v5.mp4",
    poster: "/videos/hero/hero-reel-v5-poster.jpg",
    duration: 27.9,
    // Joe framed this edit for the glass hero: subjects sit right of the diagonal.
    focus: "100% 40%",
    alt: "The church building, then Sunday preaching, song leading, kids, and fellowship",
  },
];


/**
 * Phone/tablet hero — the same edit as the desktop reel, in a lighter 960x540
 * encode (~1.2 MB vs 4.7 MB), in the photo slot under the headline on screens
 * under 1024px. `still` is a frame from that same footage: it is painted
 * instantly and stays up as the whole hero for visitors who prefer reduced
 * motion, have data-saver on, are on a slow link, or whose connection stalls
 * the video (see HeroVideoMobile). Both share the desktop's `focus`.
 */
export const heroMobile = {
  video: "/videos/hero/hero-reel-v5-mobile.mp4",
  still: "/images/hero-mobile/joe-preaching.jpg",
  focus: "100% 40%",
} as const;
