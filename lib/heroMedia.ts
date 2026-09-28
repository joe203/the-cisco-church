/**
 * Hero reel rotation — the desktop hero cycles through this list in order,
 * crossfading between items, then loops back to the start.
 *
 * To swap in new footage: drop compressed clips in public/videos/hero/ and
 * edit this array. Nothing in Hero.tsx or HeroReel.tsx needs to change.
 *
 * - type "video": file/poster are paths under public/, relative to /.
 *   `speed` sets playbackRate (1 = normal, 0.6 = slow motion). `duration`
 *   is the clip's trimmed length in seconds *before* speed is applied —
 *   it's only used as a safety-net timer (advance normally happens on the
 *   video's "ended" event; this just guarantees the reel can never get
 *   stuck if autoplay is blocked or a clip fails to load). Clips should
 *   already be muted, cropped, and compressed — see CURRENT_STATUS for the
 *   ffmpeg recipe.
 * - type "image": a still with a Ken Burns pan/zoom. `duration` (seconds)
 *   controls how long it holds before advancing. `pan` picks a drift
 *   direction for the zoom.
 * - `focus` (both types): CSS object-position, e.g. "70% 30%" — where in
 *   the frame the subject actually is. The reel panel crops hard (it's
 *   much taller than it is wide relative to the source footage), so this
 *   needs to be set per clip or the subject can crop clean out of frame.
 *   Check the clip's poster/first frame to find a good value. Defaults to
 *   "50% 35%" (roughly centered, slightly above middle) if omitted.
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
    duration: 7.5,
    focus: "58% 25%",
    alt: "Joe preaching from the pulpit",
  },
  {
    type: "image",
    file: "/images/trail-rock.jpg",
    duration: 7,
    pan: "left",
    focus: "30% 35%",
    alt: "Kids from the congregation out on a trail",
  },
  {
    type: "video",
    file: "/videos/hero/preaching-profile.mp4",
    poster: "/videos/hero/preaching-profile-poster.jpg",
    duration: 6,
    speed: 0.75,
    focus: "18% 8%",
    alt: "Joe preaching, side angle",
  },
  {
    type: "video",
    file: "/videos/hero/song-leader.mp4",
    poster: "/videos/hero/song-leader-poster.jpg",
    duration: 4.5,
    focus: "72% 20%",
    alt: "Song leader leading worship",
  },
];
