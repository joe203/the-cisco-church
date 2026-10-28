import type { Metadata } from "next";
import { DirectoryForm } from "@/components/directory/DirectoryForm";
import { backAt, pausedUntil } from "@/lib/directory/guard";

export const dynamic = "force-dynamic";

// Shared with members by hand, so it stays out of search results.
export const metadata: Metadata = {
  title: "Church directory update",
  description: "Update your household’s information in the Cisco Church directory.",
  robots: { index: false, follow: false },
};

export default function DirectoryPage() {
  const until = pausedUntil();
  return (
    <div className="bg-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-14 pb-24 sm:px-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16 lg:pt-20">
        <header className="lg:sticky lg:top-8 lg:self-start">
          <h1 className="font-display text-display font-extrabold tracking-[-0.03em] text-ink">
            Keep our directory
            <br />
            <span className="text-teal">in good shape.</span>
          </h1>
          <p className="mt-5 max-w-[34ch] text-[1.1rem] text-ink/80">
            One form per household, even if nothing has changed. It goes straight to the church
            office.
          </p>
          <p className="mt-4 max-w-[34ch] text-[1.02rem] text-ink/70">
            If nothing has changed, it takes about 30 seconds. If something has, tell us what’s new
            and we’ll update it.
          </p>
        </header>
        <DirectoryForm pausedBackAt={until ? backAt(until) : null} />
      </div>
    </div>
  );
}
