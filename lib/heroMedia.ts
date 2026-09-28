/**
 * Hero reel rotation — the desktop hero cycles through this list in order,
 * cutting cleanly between items, then loops back to the start.
 *
 * This is a highlight reel, not raw footage playback: keep every item
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

export const heroReel: HeroReelItem[] = [
  {
    type: "video",
    file: "/videos/hero/preaching-wide.mp4",
    poster: "/videos/hero/preaching-wide-poster.jpg",
    duration: 1.8,
    focus: "58% 25%",
    alt: "Joe preaching from the pulpit",
  },
  {
    type: "image",
    file: "/images/trail-rock.jpg",
    duration: 2.4,
    pan: "left",
    focus: "30% 35%",
    alt: "Kids from the congregation out on a trail",
  },
  {
    type: "image",
    file: "/images/reel-preaching-titlecard.jpg",
    duration: 2.4,
    pan: "up",
    focus: "60% 15%",
    alt: "Joe preaching, The New Thing series title card behind him",
  },
  {
    type: "video",
    file: "/videos/hero/song-leader.mp4",
    poster: "/videos/hero/song-leader-poster.jpg",
    duration: 1.8,
    focus: "72% 20%",
    alt: "Song leader leading worship",
  },
  {
    type: "image",
    file: "/images/fellowship-ladies.jpg",
    duration: 2.4,
    pan: "right",
    focus: "38% 20%",
    alt: "Two friends laughing together over dinner in the fellowship hall",
  },
  {
    type: "image",
    file: "/images/reel-preaching-close.jpg",
    duration: 2.4,
    pan: "down",
    focus: "50% 8%",
    alt: "Joe preaching, close angle",
  },
  {
    type: "image",
    file: "/images/reel-preaching-wide-establishing.jpg",
    duration: 2.4,
    pan: "left",
    focus: "50% 15%",
    alt: "Joe preaching, wide establishing shot with The New Thing series title",
  },
];
