export type OrderItem = {
  label: string;
  /** Who is doing it — shown after the dotted leader. */
  who: string;
  /** A short second line, e.g. the sermon title. */
  note: string;
};

export type OrderOfService = {
  song_leader: string;
  items: OrderItem[];
};

export type Announcement = {
  id: string;
  title: string;
  /** Free text — "October 10, 9:30 am–3pm". */
  when: string;
  body: string;
  /** One bold line under the body — "No evening service." */
  note: string;
};

export type PrayerGroup = {
  /** Empty label = the main list. */
  label: string;
  names: string[];
};

export type Article = {
  kicker: string;
  title: string;
  subtitle: string;
  /** Paragraphs separated by a blank line; **bold** and *italic* only. */
  body: string;
};

export type SeriesWeek = {
  /** ISO date (YYYY-MM-DD) of the Sunday. */
  date: string;
  title: string;
};

export type Series = {
  title: string;
  tagline: string;
  verse: string;
  weeks: SeriesWeek[];
};

export type BulletinStatus = "draft" | "published";

export type Bulletin = {
  /** ISO date (YYYY-MM-DD) of the Sunday. */
  bulletin_date: string;
  status: BulletinStatus;
  order_of_service: OrderOfService;
  announcements: Announcement[];
  prayer_groups: PrayerGroup[];
  article: Article;
  series: Series;
  published_at: string | null;
  updated_at: string | null;
};

/** The five editable pieces of a bulletin. */
export type SectionKey =
  | "order_of_service"
  | "announcements"
  | "prayer_groups"
  | "article"
  | "series";

export type StaffRole = "admin" | "secretary";

export type StaffMember = {
  user_id: string;
  email: string;
  name: string | null;
  role: StaffRole;
};
