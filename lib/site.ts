/**
 * Church details — the single source of truth for static site content.
 *
 * ────────────────────────────────────────────────────────────────────
 * TODO(Joe): every value marked TODO below is a PLACEHOLDER. Confirm
 * before launch. Values that are null are simply omitted from the UI,
 * so filling them in lights the feature up with no code change.
 * ────────────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Cisco Church of Christ",
  shortName: "The Cisco Church",
  town: "Cisco, Texas",
  domain: "theciscochurch.org",

  // Confirmed by Joe, 2026-08-14.
  services: [
    { label: "Sunday Bible Class", time: "9:30 AM" },
    { label: "Sunday Worship", time: "10:30 AM" },
    { label: "Sunday Evening", time: "6:00 PM" },
    { label: "Wednesday Study", time: "7:00 PM" },
  ],

  /** The single line used in the hero strip and footer. */
  serviceLine: "Sundays at 10:30 AM",

  address: "1701 Avenue N, Cisco, TX 76437" as string | null,
  addressFallback: "Cisco, Texas 76437",

  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Cisco+Church+of+Christ,+1701+Avenue+N,+Cisco,+TX+76437",

  phone: "(254) 442-1450" as string | null,
  // TODO(Joe): remaining contact details — null values are omitted from the UI.
  email: null as string | null,
  youtubeChannel: null as string | null,
  facebook: null as string | null,
} as const;

export function mapLabel(): string {
  return site.address ?? site.addressFallback;
}
