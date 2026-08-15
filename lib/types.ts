export type Speaker = {
  id: string;
  slug: string;
  name: string;
  photo_url: string | null;
  tags: string[];
  bio: string | null;
};

export type SermonPoint = {
  position: number;
  title: string;
  label: string | null;
  body: string | null;
};

export type Sermon = {
  id: string;
  slug: string;
  title: string;
  thesis: string | null;
  scripture_ref: string | null;
  scripture_text: string | null;
  sermon_date: string; // ISO date
  artwork_url: string | null;
  summary: string | null;
  youtube_url: string | null;
  podcast_url: string | null;
  guide_url: string | null;
  pdf_url: string | null;
  is_featured: boolean;
};

export type SermonDetail = Sermon & {
  points: SermonPoint[];
  speaker: Speaker | null;
  deck_slug: string | null;
};

/** Public slide shape — `notes` is intentionally absent. */
export type Slide = {
  position: number;
  html: string;
  /** Segment of the sermon outline shown on the controller; clickable. */
  outline_html: string | null;
  /** Background key into Deck.backgrounds (e.g. "shore"); null = default. */
  bg: string | null;
};

export type SlideWithNotes = Slide & {
  notes: string | null;
};

/** A deck background layer: a looping video or a still image. */
export type DeckBackground = {
  video?: string;
  image?: string;
};

export type Deck = {
  id: string;
  slug: string;
  title: string;
  sermon_slug: string | null;
  /** Keyed background layers, from cisco_decks.metadata -> backgrounds. */
  backgrounds: Record<string, DeckBackground>;
  slides: Slide[];
};

export type DeckState = {
  current_slide: number;
  is_live: boolean;
  is_blank: boolean;
};
