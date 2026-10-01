import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { getStaff } from "@/lib/supabase/auth";

export const metadata: Metadata = { title: "Help" };
export const dynamic = "force-dynamic";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 rounded-2xl bg-white p-6 shadow-panel-light sm:p-8">
      <h2 className="font-display text-[1.5rem] font-extrabold tracking-[-0.02em]">{title}</h2>
      <div className="mt-4 space-y-4 text-[1.02rem] leading-relaxed text-ink/85">{children}</div>
    </section>
  );
}

function Steps({ children }: { children: ReactNode }) {
  return (
    <ol className="space-y-3 pl-0">
      {(Array.isArray(children) ? children : [children]).map((child, i) => (
        <li key={i} className="flex gap-4">
          <span
            aria-hidden
            className="font-display mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-teal text-[0.9rem] font-bold text-white"
          >
            {i + 1}
          </span>
          <span>{child}</span>
        </li>
      ))}
    </ol>
  );
}

function Rule({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="rounded-xl bg-cloud p-4">
      <p className="font-display text-[1.05rem] font-bold text-ink">{title}</p>
      <p className="mt-1 text-[0.97rem]">{children}</p>
    </li>
  );
}

const B = ({ children }: { children: ReactNode }) => <strong className="font-bold text-ink">{children}</strong>;

export default async function StaffHelpPage() {
  const staff = await getStaff();
  if (!staff) redirect("/staff/login");
  const admin = staff.role === "admin";

  const jumps = [
    ["week", "The weekly routine"],
    ["upload", "Upload a PDF"],
    ["check", "Check the draft"],
    ["publish", "Publish"],
    ["type", "Type it instead"],
    ["good", "Good to know"],
    ["trouble", "If something goes wrong"],
    ...(admin ? [["people", "Adding people"]] : []),
  ];

  return (
    <>
      <StaffHeader staff={staff} />
      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <p className="eyebrow text-teal">Staff help</p>
        <h1 className="font-display mt-2 text-[2.4rem] leading-[1.05] font-extrabold tracking-[-0.03em]">
          How the bulletin works
        </h1>
        <p className="mt-3 max-w-[56ch] text-ink/70">
          Short and plain. Come back to this any time you’re unsure — nothing here is something you
          need to remember.
        </p>

        <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2">
          {jumps.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="eyebrow rounded-full bg-white px-4 py-2 text-teal shadow-card transition-transform duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 active:translate-y-0"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="mt-10 space-y-8">
          <Section id="week" title="The weekly routine">
            <p>Each week is three things. That’s all.</p>
            <Steps>
              <>
                <B>Get the finished bulletin in.</B> Upload the PDF from the Staff page (next section) —
                or type it in if you’d rather.
              </>
              <>
                <B>Check the draft.</B> Compare it with the paper copy. It takes a couple of minutes.
              </>
              <>
                <B>Press Publish.</B> The bulletin goes live on theciscochurch.org/bulletin.
              </>
            </Steps>
            <p>
              Everything you do before step 3 is private. Visitors only ever see what has been published.
            </p>
          </Section>

          <Section id="upload" title="Upload a PDF">
            <Steps>
              <>
                Finish the bulletin the way you always do, then save it as a <B>PDF</B>. In Word:{" "}
                <B>File → Save As → PDF</B> (or <B>Export</B>). In Publisher: <B>File → Export → Create
                PDF</B>.
              </>
              <>
                Go to the <Link href="/staff" className="link-under font-semibold text-teal">Staff page</Link>.
                Find the white box titled <B>“Upload the finished paper bulletin.”</B> On a phone it’s at
                the very top; on a computer it’s on the right-hand side.
              </>
              <>
                Press <B>1. Choose a PDF</B> (the button with a teal outline), pick your file, then press
                the teal <B>2. Read this bulletin</B> button underneath.
              </>
              <>
                Wait about a minute and keep the page open. You’ll be taken straight to the new draft.
              </>
            </Steps>
            <p>
              The site works out which Sunday it’s for from the date printed on the bulletin, so there’s
              nothing to pick.
            </p>
          </Section>

          <Section id="check" title="Check the draft">
            <p>
              Right after an upload, a yellow box at the top says <B>“Read from your PDF — please check it
              over.”</B> The reading is very good, but it’s worth a look every time. Check:
            </p>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>
                <B>Names in the prayer list</B> — spelling, and that nobody is missing.
              </li>
              <li>
                <B>Dates and times</B> in the announcements.
              </li>
              <li>
                <B>The sermon title</B> in the order of service.
              </li>
              <li>
                That <B>old announcements</B> that are over have been removed.
              </li>
            </ul>
            <p>
              Press <B>Preview how it looks</B> (a teal link under the date) to see the bulletin the way
              visitors will — it opens in a new tab. To fix something, change it in the boxes on the page and
              press <B>Save draft</B>.
            </p>
            <p>
              The <B>buttons live in a bar along the bottom of the screen</B> — Save draft, and
              Publish. They stay there as you scroll, so you never have to hunt for them.
            </p>
          </Section>

          <Section id="publish" title="Publish, save, and take back">
            <ul className="space-y-3">
              <Rule title="Save draft">
                Keeps your changes. If the bulletin isn’t published yet, nobody else sees them. If it{" "}
                <em>is</em> already published, saving updates the live page right away.
              </Rule>
              <Rule title="Publish">
                Puts the bulletin on the website. The big coral button at the bottom right.
              </Rule>
              <Rule title="Unpublish">
                Takes a published bulletin back off the website and turns it back into a draft. Nothing is
                lost.
              </Rule>
            </ul>
            <p>
              Made a mistake after publishing? Open the bulletin from the Staff page, fix it, and press{" "}
              <B>Save draft</B> — the live page updates within moments.
            </p>
          </Section>

          <Section id="type" title="Type it in instead">
            <p>
              You don’t have to upload. On the Staff page, use <B>“Start a new bulletin”</B>: pick the
              Sunday and press <B>Create bulletin</B>. It starts as a copy of the most recent one, so the
              order of service, announcements, prayer list and series are already there — you only change
              what’s different this week. The article starts empty.
            </p>
            <p>
              {admin
                ? "You can edit every part of the bulletin."
                : "You can edit the order of service, announcements and prayer list. The minister’s article and the sermon series are edited by Joe — they don’t appear for you."}
            </p>
          </Section>

          <Section id="good" title="Good to know">
            <ul className="space-y-3">
              <Rule title="Nothing goes public until someone presses Publish">
                Drafts — including anything just uploaded — are private. Only Publish puts it on the website.
              </Rule>
              <Rule title="Always read the prayer list">
                A misspelled or missing name is the kind of mistake that matters. The upload is checked by
                the same rules as typing, but a person should always give it a last look.
              </Rule>
              <Rule title="Your PDF isn’t kept">
                It’s read once to fill in the draft and then it’s gone. Keep your own copy as you normally
                do.
              </Rule>
              <Rule title="An upload never overwrites a published bulletin">
                If that Sunday is already published, the upload stops and tells you. If there’s only a
                draft, it asks before replacing it.
              </Rule>
              <Rule title="Two people editing at once">
                If someone else saved the same bulletin while you were working, the page says so instead of
                overwriting their work. Reload the page and make your change again.
              </Rule>
              <Rule title="Past bulletins are kept">
                Every published bulletin stays in the archive at theciscochurch.org/bulletin/archive.
              </Rule>
            </ul>
          </Section>

          <Section id="trouble" title="If something goes wrong">
            <ul className="space-y-3">
              <Rule title="“That PDF couldn’t be read”">
                Save the bulletin as a PDF again (don’t rename a Word file to .pdf), then upload the new
                file. Or use “Start a new bulletin” and type it in.
              </Rule>
              <Rule title="“The date couldn’t be found”">
                The reader looks for the Sunday’s date printed on the bulletin. Use “Start a new bulletin”
                instead and pick the Sunday yourself.
              </Rule>
              <Rule title="The sign-in email doesn’t arrive">
                Wait a couple of minutes, then check spam or junk. The link works once and expires after
                about an hour — just ask for a new one on the sign-in page.
              </Rule>
              <Rule title="You can’t find a button">
                The Staff page and the editor each keep their main buttons in plain sight: upload on the
                Staff page, Save draft and Publish in the bar along the bottom of the editor. If you still
                don’t see it, tell Joe — that means the page needs fixing, not you.
              </Rule>
            </ul>
          </Section>

          {admin && (
            <Section id="people" title="Adding people (admins)">
              <p>
                Go to <Link href="/staff/people" className="link-under font-semibold text-teal">People</Link>,
                enter their email address and name, choose a role, and press <B>Add to staff</B>. They sign
                in at theciscochurch.org/staff with that address — no password to set up.
              </p>
              <p>
                <B>Secretary</B> can edit the order of service, announcements and prayer list.{" "}
                <B>Admin</B> can edit everything and add people.
              </p>
            </Section>
          )}
        </div>
      </main>
    </>
  );
}
