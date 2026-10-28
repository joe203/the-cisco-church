"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { isEmail, MAX_PEOPLE, MONTH_NAMES } from "@/lib/directory/schema";

const field =
  "mt-1.5 w-full rounded-xl border-2 border-ink/20 bg-white px-4 py-3 text-[1.05rem] text-ink placeholder:text-ink/45 focus-visible:border-teal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/20";
const label = "text-[0.98rem] font-bold text-ink";
const hint = "mt-1 text-[0.95rem] text-ink/70";
const h2 =
  "font-display text-[1.55rem] leading-tight font-extrabold tracking-[-0.02em] text-ink sm:text-[1.8rem]";
const addBtn =
  "mt-4 inline-flex items-center gap-2 rounded-full border-2 border-teal px-5 py-2.5 text-[0.98rem] font-bold text-deepsea hover:bg-teal/10 focus-visible:outline-offset-4 active:opacity-80 motion-safe:transition-[transform,opacity] motion-safe:duration-300 hover:-translate-y-px";

type Adult = {
  key: number;
  name: string;
  cell: string;
  email: string;
  birthday: string;
};
type Child = { key: number; name: string; birthday: string };

/** Keys 1 and 2 are the two starting rows, so server and browser render the same ids. */
let nextKey = 3;
const blankAdult = (key: number): Adult => ({
  key,
  name: "",
  cell: "",
  email: "",
  birthday: "",
});
const newAdult = (): Adult => blankAdult(nextKey++);
const newChild = (): Child => ({ key: nextKey++, name: "", birthday: "" });

/** "MM-DD" (or "MM-DD-YYYY"), edited as a month pick, a day pick and an optional year. */
function DatePick({
  id,
  value,
  onChange,
  withYear = false,
  legend,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  withYear?: boolean;
  legend: string;
}) {
  const [m = "", d = "", y = ""] = value.split("-");
  const set = (mm: string, dd: string, yy: string) =>
    onChange(
      withYear && yy ? `${mm}-${dd}-${yy}` : mm || dd ? `${mm}-${dd}` : "",
    );
  const select =
    "w-full rounded-xl border-2 border-ink/20 bg-white px-3 py-3 text-[1.05rem] text-ink focus-visible:border-teal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/20";
  return (
    <fieldset className="mt-1.5">
      <legend className="sr-only">{legend}</legend>
      <div
        className={`grid gap-2 ${withYear ? "grid-cols-[1fr_5.5rem_6.5rem]" : "grid-cols-[1fr_5.5rem]"}`}
      >
        <select
          id={id}
          aria-label={`${legend}: month`}
          value={m}
          onChange={(e) => set(e.target.value, d, y)}
          className={select}
        >
          <option value="">Month</option>
          {MONTH_NAMES.map((name, i) => (
            <option key={name} value={String(i + 1).padStart(2, "0")}>
              {name}
            </option>
          ))}
        </select>
        <select
          aria-label={`${legend}: day`}
          value={d}
          onChange={(e) => set(m, e.target.value, y)}
          className={select}
        >
          <option value="">Day</option>
          {Array.from({ length: 31 }, (_, i) =>
            String(i + 1).padStart(2, "0"),
          ).map((n) => (
            <option key={n} value={n}>
              {Number(n)}
            </option>
          ))}
        </select>
        {withYear && (
          <input
            aria-label={`${legend}: year (optional)`}
            inputMode="numeric"
            maxLength={4}
            placeholder="Year"
            value={y}
            onChange={(e) => set(m, d, e.target.value.replace(/\D/g, ""))}
            className={select}
          />
        )}
      </div>
    </fieldset>
  );
}

const dateProblem = (v: string, withYear = false) => {
  if (!v) return false;
  const [m, d, y] = v.split("-");
  if (!m || !d) return true;
  return withYear && y !== undefined && y !== "" && !/^(19|20)\d{2}$/.test(y);
};

export function DirectoryForm({
  pausedBackAt,
}: {
  pausedBackAt: string | null;
}) {
  const router = useRouter();
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [household, setHousehold] = useState("");
  const [by, setBy] = useState("");
  const [adults, setAdults] = useState<Adult[]>(() => [
    blankAdult(1),
    blankAdult(2),
  ]);
  const [children, setChildren] = useState<Child[]>([]);
  const [street, setStreet] = useState("");
  const [cityStateZip, setCityStateZip] = useState("Cisco, TX ");
  const [homePhone, setHomePhone] = useState("");
  const [anniversary, setAnniversary] = useState("");
  const [status, setStatus] = useState<"" | "no_changes" | "changed">("");
  const [privacy, setPrivacy] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const patchAdult = (key: number, patch: Partial<Adult>) =>
    setAdults((list) =>
      list.map((a) => (a.key === key ? { ...a, ...patch } : a)),
    );
  const patchChild = (key: number, patch: Partial<Child>) =>
    setChildren((list) =>
      list.map((c) => (c.key === key ? { ...c, ...patch } : c)),
    );

  const choose = (value: "no_changes" | "changed") => {
    setStatus(value);
    setError("");
    if (value === "changed" && by.trim()) {
      setAdults((list) =>
        list.map((a, i) =>
          i === 0 && !a.name ? { ...a, name: by.trim() } : a,
        ),
      );
    }
  };

  const fail = (message: string) => {
    setError(message);
    requestAnimationFrame(() => errorRef.current?.focus());
  };

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!household.trim()) return fail("Add your family or household name.");
    if (!by.trim()) return fail("Add your name, so we know who sent this.");
    if (!status)
      return fail("Choose whether your information is correct or has changed.");

    const changed = status === "changed";
    const filled = changed
      ? adults.filter((a) => a.name || a.cell || a.email || a.birthday)
      : [];
    const kids = changed ? children.filter((c) => c.name || c.birthday) : [];

    if (changed) {
      if (filled.some((a) => a.email.trim() && !isEmail(a.email.trim()))) {
        return fail(
          "One of the email addresses doesn’t look right. Check for typos.",
        );
      }
      if (!filled.some((a) => a.email.trim() || a.cell.trim())) {
        return fail(
          "Add at least one email address or cell number, so we can reach you.",
        );
      }
      if (
        filled.some((a) => dateProblem(a.birthday)) ||
        kids.some((c) => dateProblem(c.birthday))
      ) {
        return fail(
          "Pick both a month and a day for each birthday, or clear it.",
        );
      }
      if (dateProblem(anniversary, true)) {
        return fail(
          "For the anniversary, pick a month and a day. If you add a year, use four digits.",
        );
      }
    }

    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/directory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          household_name: household,
          submitted_by: by,
          status,
          adults: filled.map(({ key: _k, ...a }) => a),
          children: kids.map(({ key: _k, ...c }) => c),
          street,
          city_state_zip:
            cityStateZip.trim() === "Cisco, TX" ? "" : cityStateZip,
          home_phone: homePhone,
          anniversary,
          privacy_notes: privacy,
          website:
            (new FormData(e.currentTarget).get("website") as string) ?? "",
        }),
      });
      if (res.ok) {
        setDone(true);
        window.scrollTo({ top: 0 });
        return;
      }
      const body = (await res.json().catch(() => null)) as {
        error?: string;
        paused?: boolean;
      } | null;
      if (body?.paused) router.refresh();
      fail(body?.error ?? "That didn’t send. Please try again.");
    } catch {
      fail("That didn’t send. Check your connection and try again.");
    }
    setBusy(false);
  }

  if (pausedBackAt) {
    return (
      <div
        className="rounded-3xl bg-white p-8 shadow-[var(--shadow-card-lift)] sm:p-11"
        role="status"
      >
        <h2 className={h2}>This form is taking a short break.</h2>
        <p className="mt-4 max-w-[46ch] text-[1.1rem] text-ink/80">
          It will be back around <strong>{pausedBackAt}</strong>. Please try
          again then, or give your information to the church office.
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div
        className="rounded-3xl bg-white p-8 shadow-[var(--shadow-card-lift)] sm:p-11"
        role="status"
      >
        <h2 className={h2}>Thank you. We got it.</h2>
        <p className="mt-4 max-w-[46ch] text-[1.1rem] text-ink/80">
          Your information went to the church office. If we have a question,
          we’ll write to you at the email you gave.
        </p>
        <Link href="/" className="btn-coral mt-7">
          Back to the home page
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={send} noValidate className="space-y-8">
      <section
        className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] sm:p-9"
        aria-labelledby="d-household"
      >
        <h2 id="d-household" className={h2}>
          Who’s sending this?
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="household" className={label}>
              Family or household name
            </label>
            <input
              id="household"
              value={household}
              onChange={(e) => setHousehold(e.target.value)}
              required
              maxLength={120}
              autoComplete="family-name"
              placeholder="The Cabrera Family"
              className={field}
            />
          </div>
          <div>
            <label htmlFor="by" className={label}>
              Your name
            </label>
            <input
              id="by"
              value={by}
              onChange={(e) => setBy(e.target.value)}
              required
              maxLength={120}
              autoComplete="name"
              placeholder="Joe Cabrera"
              className={field}
            />
          </div>
        </div>

        <h3
          id="d-status"
          className="font-display mt-9 text-[1.25rem] font-extrabold tracking-[-0.01em] text-ink"
        >
          Is the directory right as it is?
        </h3>
        <div
          role="radiogroup"
          aria-labelledby="d-status"
          className="mt-4 grid gap-3"
        >
          {(
            [
              [
                "no_changes",
                "Yes. Our information is correct as currently listed. No changes needed.",
              ],
              ["changed", "No. Something has changed, and I’ll fill it in."],
            ] as const
          ).map(([value, text]) => (
            <label
              key={value}
              className="flex cursor-pointer items-start gap-3.5 rounded-2xl border-2 border-ink/15 bg-white p-4 text-[1.05rem] text-ink hover:border-teal/50 has-[:checked]:border-teal has-[:checked]:bg-teal/8 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-teal/20"
            >
              <input
                type="radio"
                name="status"
                value={value}
                checked={status === value}
                onChange={() => choose(value)}
                className="mt-1 size-5 shrink-0 accent-teal"
              />
              <span>{text}</span>
            </label>
          ))}
        </div>
      </section>

      {status === "no_changes" && (
        <p
          role="status"
          className="rounded-2xl bg-teal/10 px-6 py-5 text-[1.1rem] font-semibold text-deepsea"
        >
          Great. We already have your information, so there’s nothing else to
          fill out.
        </p>
      )}

      {status === "changed" && (
        <>
          <section
            className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] sm:p-9"
            aria-labelledby="d-people"
          >
            <h2 id="d-people" className={h2}>
              Who’s in the family
            </h2>
            <p className={hint}>
              Add each adult. Email and cell phone are the most helpful, and we
              need at least one.
            </p>
            <ul className="mt-6 space-y-5">
              {adults.map((a, i) => (
                <li
                  key={a.key}
                  className="rounded-2xl border-l-4 border-teal bg-sand/70 p-5 sm:p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-display text-[1.15rem] font-extrabold text-ink">
                      {a.name.trim() || `Person ${i + 1}`}
                    </p>
                    {adults.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setAdults((l) => l.filter((x) => x.key !== a.key))
                        }
                        className="rounded-md text-[0.95rem] font-bold text-clay underline underline-offset-4 hover:text-coral active:opacity-80"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor={`a-name-${a.key}`} className={label}>
                        Name
                      </label>
                      <input
                        id={`a-name-${a.key}`}
                        value={a.name}
                        onChange={(e) =>
                          patchAdult(a.key, { name: e.target.value })
                        }
                        maxLength={120}
                        autoComplete={i === 0 ? "name" : "off"}
                        className={field}
                      />
                    </div>
                    <div>
                      <label htmlFor={`a-cell-${a.key}`} className={label}>
                        Cell phone
                      </label>
                      <input
                        id={`a-cell-${a.key}`}
                        type="tel"
                        value={a.cell}
                        onChange={(e) =>
                          patchAdult(a.key, { cell: e.target.value })
                        }
                        maxLength={40}
                        autoComplete={i === 0 ? "tel" : "off"}
                        placeholder="254-555-0123"
                        className={field}
                      />
                    </div>
                    <div>
                      <label htmlFor={`a-email-${a.key}`} className={label}>
                        Email
                      </label>
                      <input
                        id={`a-email-${a.key}`}
                        type="email"
                        value={a.email}
                        onChange={(e) =>
                          patchAdult(a.key, { email: e.target.value })
                        }
                        maxLength={160}
                        autoComplete={i === 0 ? "email" : "off"}
                        placeholder="you@email.com"
                        className={field}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor={`a-bday-${a.key}`} className={label}>
                        Birthday{" "}
                        <span className="font-normal text-ink/65">
                          (month and day)
                        </span>
                      </label>
                      <DatePick
                        id={`a-bday-${a.key}`}
                        legend={`${a.name.trim() || `Person ${i + 1}`} birthday`}
                        value={a.birthday}
                        onChange={(v) => patchAdult(a.key, { birthday: v })}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {adults.length < MAX_PEOPLE && (
              <button
                type="button"
                onClick={() => setAdults((l) => [...l, newAdult()])}
                className={addBtn}
              >
                + Add another person
              </button>
            )}
          </section>

          <section
            className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] sm:p-9"
            aria-labelledby="d-kids"
          >
            <h2 id="d-kids" className={h2}>
              Children living at home
            </h2>
            <p className={hint}>Leave this empty if there aren’t any.</p>
            {children.length > 0 && (
              <ul className="mt-6 space-y-5">
                {children.map((c, i) => (
                  <li
                    key={c.key}
                    className="rounded-2xl border-l-4 border-marigold bg-sand/70 p-5 sm:p-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-display text-[1.15rem] font-extrabold text-ink">
                        {c.name.trim() || `Child ${i + 1}`}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setChildren((l) => l.filter((x) => x.key !== c.key))
                        }
                        className="rounded-md text-[0.95rem] font-bold text-clay underline underline-offset-4 hover:text-coral active:opacity-80"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor={`c-name-${c.key}`} className={label}>
                          Name
                        </label>
                        <input
                          id={`c-name-${c.key}`}
                          value={c.name}
                          onChange={(e) =>
                            patchChild(c.key, { name: e.target.value })
                          }
                          maxLength={120}
                          autoComplete="off"
                          className={field}
                        />
                      </div>
                      <div>
                        <label htmlFor={`c-bday-${c.key}`} className={label}>
                          Birthday{" "}
                          <span className="font-normal text-ink/65">
                            (month and day)
                          </span>
                        </label>
                        <DatePick
                          id={`c-bday-${c.key}`}
                          legend={`${c.name.trim() || `Child ${i + 1}`} birthday`}
                          value={c.birthday}
                          onChange={(v) => patchChild(c.key, { birthday: v })}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {children.length < MAX_PEOPLE && (
              <button
                type="button"
                onClick={() => setChildren((l) => [...l, newChild()])}
                className={addBtn}
              >
                + Add a child
              </button>
            )}
          </section>

          <section
            className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] sm:p-9"
            aria-labelledby="d-where"
          >
            <h2 id="d-where" className={h2}>
              Where you live
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="street" className={label}>
                  Street address
                </label>
                <input
                  id="street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  maxLength={160}
                  autoComplete="street-address"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="csz" className={label}>
                  City, state, ZIP
                </label>
                <input
                  id="csz"
                  value={cityStateZip}
                  onChange={(e) => setCityStateZip(e.target.value)}
                  maxLength={120}
                  autoComplete="off"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="home-phone" className={label}>
                  Home phone{" "}
                  <span className="font-normal text-ink/65">
                    (if you have one)
                  </span>
                </label>
                <input
                  id="home-phone"
                  type="tel"
                  value={homePhone}
                  onChange={(e) => setHomePhone(e.target.value)}
                  maxLength={40}
                  autoComplete="home tel"
                  className={field}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="anniversary" className={label}>
                  Anniversary{" "}
                  <span className="font-normal text-ink/65">
                    (year is optional)
                  </span>
                </label>
                <div className="sm:max-w-sm">
                  <DatePick
                    id="anniversary"
                    legend="Anniversary"
                    withYear
                    value={anniversary}
                    onChange={setAnniversary}
                  />
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {status && (
        <section
          className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] sm:p-9"
          aria-labelledby="d-privacy"
        >
          <div>
            <label id="d-privacy" htmlFor="privacy" className={h2}>
              Anything you don’t want published?
            </label>
            <p className={hint}>
              {status === "changed"
                ? "List anything above that should stay out of the church directory, like a phone number or a birthday."
                : "If something in the directory should be kept out, tell us here. Otherwise you’re done."}
            </p>
            <textarea
              id="privacy"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              rows={3}
              maxLength={2000}
              className={`${field} resize-y`}
            />
          </div>
        </section>
      )}

      {/* Bots fill every field; people never see this one. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="d-site">Website</label>
        <input id="d-site" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="rounded-xl bg-coral/10 px-5 py-4 text-[1.02rem] font-semibold text-clay focus-visible:outline-none"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          disabled={busy}
          className="btn-coral w-full justify-center disabled:opacity-60 sm:w-auto"
        >
          {busy ? "Sending…" : "Send to the church office"}
        </button>
        <p className="text-[0.95rem] text-ink/70">
          One form per household, please.
        </p>
      </div>
    </form>
  );
}
