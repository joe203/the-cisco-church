/**
 * What guides every decision — Joe's core values from the Oct 25 leadership
 * handout. Shown in full on /together and asked about on /together/feedback.
 * Order matters: this is the order of priority Joe set. `short` is the one-line
 * version the feedback form shows; keep it true to `text`.
 */

export const LEAD_VALUE = {
  key: "jesus",
  name: "Jesus at the center",
  short: "Everything we do starts and ends with Jesus.",
  text: "Everything we do starts and ends with Jesus. We are God’s sons and daughters, and every ministry here exists to help people know Him: His love, His salvation, His way. Every program, schedule, and decision gets one question: does this lead people to Jesus?",
} as const;

export const VALUES = [
  {
    key: "relationships",
    name: "Relationships over programs",
    short: "Programs serve relationships with God and with each other.",
    text: "Programs and activities serve a greater purpose: relationships that connect people with God and with one another. We measure success not by what we do, but by the lives we touch.",
  },
  {
    key: "prayer",
    name: "Prayer before pursuit",
    short: "We seek God’s wisdom before we commit our time and money.",
    text: "Seek God’s wisdom before committing our time, energy, and resources.",
  },
  {
    key: "god_ideas",
    name: "God ideas drive ministry",
    short: "We put our time into kingdom-sized ideas, not every good idea.",
    text: "We don’t chase every good idea. We look for big, kingdom-sized ideas with real Jesus impact: ideas that serve others, love others, and encourage others. That’s where we invest our time.",
  },
  {
    key: "vision",
    name: "Vision driven",
    short: "The big picture decides what we say yes and no to.",
    text: "We keep the big picture in front of us by asking: What is God calling this congregation to be and do in His kingdom? Hence, we align ourselves to what God is doing. This helps us be decisive about what we say yes to and what we say no to.",
  },
  {
    key: "grace",
    name: "Grace received, grace shared",
    short: "We show others the grace God has shown us.",
    text: "We are saved by grace through faith, not by works (Ephesians 2:8–9). The more deeply we understand the grace God has shown us, the more freely we show it to the people around us. We celebrate God’s goodness. We encourage the presence of grace more and more in our fellowship, our ministries, and everything we do, and we count that as a godly step forward.",
  },
  {
    key: "mission",
    name: "Mission over tradition",
    short: "We honor our heritage, and our mission sets our direction.",
    text: "We honor our heritage, and we let our mission, not long-standing practices, set our direction.",
  },
] as const;

/** Every value, the lead one first — the order the feedback form asks them in. */
export const ALL_VALUES = [LEAD_VALUE, ...VALUES] as const;
export type ValueKey = (typeof ALL_VALUES)[number]["key"];
