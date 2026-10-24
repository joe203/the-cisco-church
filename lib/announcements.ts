import manifest from "./announcements.json";

export type AnnouncementSlide = {
  id: string;
  file: string;
  title: string;
  alt: string;
  details: string[];
};

export const announcements: { date: string; slides: AnnouncementSlide[] } = manifest;

export function slideSrc(slide: AnnouncementSlide): string {
  return `/announcements/${slide.file}?v=${announcements.date}`;
}
