import { rawWeeks } from "./announcements/weeks";
import { todayInCisco } from "./series";

export type AnnouncementSlide = {
  id: string;
  file: string;
  title: string;
  alt: string;
  details: string[];
  /** Shown only while the week is current (e.g. the prayer-request slide). */
  currentOnly?: boolean;
};

export type AnnouncementWeek = { date: string; slides: AnnouncementSlide[] };

const sorted = ([...rawWeeks] as AnnouncementWeek[]).sort((a, b) => b.date.localeCompare(a.date));

/**
 * Each week is dated by its Sunday and goes live at midnight (Cisco time) as
 * that Sunday begins, i.e. the moment Saturday ends. Until then the previous
 * week stays up and the new one is hidden everywhere, so Joe can upload it as
 * early as Thursday. `earlier` is the weeks before the current one.
 */
export function getWeeks(today: string = todayInCisco()): {
  current: AnnouncementWeek;
  earlier: AnnouncementWeek[];
} {
  const live = sorted.filter((w) => w.date <= today);
  // Nothing is dated yet (e.g. the very first week uploaded early): show the oldest.
  const pool = live.length > 0 ? live : [sorted[sorted.length - 1]];
  return { current: pool[0], earlier: pool.slice(1) };
}

export function weekSlides(week: AnnouncementWeek, isCurrent: boolean): AnnouncementSlide[] {
  return isCurrent ? week.slides : week.slides.filter((s) => !s.currentOnly);
}

export function slideSrc(week: AnnouncementWeek, slide: AnnouncementSlide): string {
  return `/announcements/${week.date}/${slide.file}`;
}
