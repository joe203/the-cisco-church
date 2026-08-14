# KICKOFF — paste this as your first message to Claude Code

*Everything below the divider is the prompt. `BUILD_PROMPT.md` has the full spec;
this is the opening move.*

---

We're starting **TheCiscoChurch.org** — a temporary site for the **Cisco Church
of Christ** in Cisco, Texas. Before you do anything else:

1. Read `CLAUDE.md` — the working rules for this project.
2. Read `BUILD_PROMPT.md` — the full spec: routes, schema, palette, section order.
3. Read anything in `reference/` — exported HTML from sermon pages I've built by
   hand. Mine it for structure and section order. Do not copy the markup.
4. Invoke the `frontend-design` skill.

**Do not write any code yet.** Your first deliverable is a proposal. Details at
the bottom.

## The one thing that matters most

I have seen a hundred AI-generated websites and they all look like the same site.
Full-bleed hero photo, centered white headline, subhead, two buttons side by
side. Three equal columns of cards with circular icons. A gradient blob
somewhere. Every section centered at the same width with the same padding, all
the way down. Copy that says "Join us as we grow together in faith."

**If this site looks like that, it has failed**, no matter how clean the code is.

A church in a small West Texas town should look like *that* church — not like a
SaaS landing page with a cross on it. I would rather you take a real swing and
miss than hand me something competent and anonymous.

Concretely:

- **Asymmetry over centering.** Give the hero a spine, not a center line. Type
  stacked hard to one side, artwork bleeding off the opposite edge, overlap
  where it earns it.
- **A real editorial type scale.** Display type at 5–8rem sitting next to 1rem
  body. Timid, evenly-sized type is what makes a page read as generated.
- **Varied section rhythm.** Full-bleed, then inset, then split. Dark, then a
  parchment breath, then dark again. Vary the vertical padding on purpose.
- **One signature moment, not five.** Restraint is the tell of a human designer.
  Scattered effects everywhere is the tell of a machine.
- **Language that names real things.** "Sundays at 10:30, on Highway 6" beats
  "Join us for worship." Name the town. Name the street.

## Build it on current web, not 2022 web

Part of not looking generated is not being built on stale patterns. Scaffold on
the current stable **Next.js (App Router) + React + Tailwind v4** — note Tailwind
v4 is CSS-first, so design tokens go in `@theme` inside `globals.css`, not a JS
config file. Update the project structure in `CLAUDE.md` to match once you
confirm the version.

Use the modern platform where it genuinely helps, always as progressive
enhancement, never as decoration:

- **View Transitions** for the sermon-card-to-sermon-page expansion — this is the
  signature. Must degrade to a normal navigation when unsupported.
- **Fluid type and space** with `clamp()`, so nothing needs a breakpoint to look
  right.
- **Container queries** for the sermon cards, so a card is responsive to its slot
  rather than to the viewport.
- **`text-wrap: balance`** on headings and **`pretty`** on body — kills orphans
  and ragged headline breaks, which is a large part of why hand-designed pages
  read as more polished.
- **`:has()`** for state-driven styling instead of extra wrapper divs.
- **Scroll-driven animations** in CSS where supported, with a graceful no-op
  fallback. No scroll library.
- **OKLCH** for color math when deriving hovers and tints — `color-mix()` beats
  hardcoding nine shades of gold.
- **`dvh`** for anything full-height, so mobile browser chrome doesn't break it.
- **`@starting-style`** for entry animations instead of JS mount hooks.

Everything animated stays on `transform` and `opacity`, and everything respects
`prefers-reduced-motion`. Test that it does.

## Your first deliverable — proposal only, no code

Come back with:

1. **Three hero concepts**, each with a rough ASCII wireframe and two sentences
   on why it fits a small-town church. **Make one of them genuinely risky.**
2. **The homepage section order**, one line per section on why it exists.
3. **The signature element** you're committing to, and what stays quiet so it
   lands.
4. **Confirmation of the palette and type** from `BUILD_PROMPT.md`, or a
   reasoned argument for changing them.
5. **The Next.js and Tailwind versions** you're scaffolding on.
6. **Any questions**, plus a list of what you need from me that I haven't given
   you — service times and street address are known gaps.

Then stop and wait. Don't scaffold, don't run migrations, don't install anything
until I've picked a direction.
