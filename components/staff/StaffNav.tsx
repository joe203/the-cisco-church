"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; badge?: number; matches: (path: string) => boolean };

/** Which top-bar button owns this page. "Staff" is the dashboard and the bulletin editor under it. */
export function staffNavItems({ inbox, people, unread }: { inbox: boolean; people: boolean; unread: number }): NavItem[] {
  const under = (base: string) => (path: string) => path === base || path.startsWith(`${base}/`);
  return [
    {
      href: "/staff",
      label: "Staff",
      matches: (path) => path === "/staff" || under("/staff/bulletin")(path),
    },
    ...(inbox ? [{ href: "/staff/mail", label: "Inbox", badge: unread, matches: under("/staff/mail") }] : []),
    ...(people ? [{ href: "/staff/people", label: "People", matches: under("/staff/people") }] : []),
    { href: "/staff/help", label: "Help", matches: under("/staff/help") },
  ];
}

const pill =
  "eyebrow inline-flex min-h-[2.5rem] items-center rounded-full px-3.5 py-1.5 transition-transform duration-300 ease-[var(--ease-spring)] active:scale-95";

/** The staff top bar. The page you are on is the one filled-in, bold button. */
export function StaffNavView({ items, pathname }: { items: NavItem[]; pathname: string }) {
  return (
    <nav className="-mx-1 flex flex-wrap items-center gap-x-1 gap-y-1" aria-label="Staff">
      {items.map((item) => {
        const active = item.matches(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? `${pill} bg-ink font-extrabold text-white`
                : `${pill} font-bold text-teal hover:-translate-y-px hover:bg-teal/10 hover:text-deepsea`
            }
          >
            {item.label}
            {item.badge ? (
              <span className="ml-2 rounded-full bg-coral px-2 py-0.5 text-[0.68rem] leading-none text-white">{item.badge}</span>
            ) : null}
          </Link>
        );
      })}
      <Link
        href="/bulletin"
        className={`${pill} font-bold text-teal hover:-translate-y-px hover:bg-teal/10 hover:text-deepsea`}
      >
        View site
      </Link>
    </nav>
  );
}

export function StaffNav(props: { inbox: boolean; people: boolean; unread: number }) {
  const pathname = usePathname();
  return <StaffNavView items={staffNavItems(props)} pathname={pathname} />;
}
