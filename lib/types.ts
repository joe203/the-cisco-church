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
};

export type SlideWithNotes = Slide & {
  notes: string | null;
};

export type Deck = {
  id: string;
  slug: string;
  title: string;
  sermon_slug: string | null;
  slides: Slide[];
};

export type DeckState = {
  current_slide: number;
  is_live: boolean;
};
