import type { ValueKey } from "./values";

/**
 * The members' meeting prep page (/together/meeting). Joe's topics from
 * 2026-11-26; wording is a first draft for him to edit. Keep every line short:
 * this page points people at the big picture, it doesn't settle details.
 */

export const MEETING = {
  /** Shown big at the top. */
  day: "Sunday, November 29",
  /** TODO(Joe): time and room. Hidden while null. */
  when: null as string | null,
  /** Shows the "still taking shape" note at the top. Set false once Joe stops changing the page. */
  draft: true,
};

/** The core values, each turned into the question an idea has to answer. Same order as values.ts. */
export const FILTER: { value: ValueKey; question: string }[] = [
  { value: "jesus", question: "Does it help people know Jesus?" },
  { value: "relationships", question: "Will people be closer to God and to each other because of it?" },
  { value: "prayer", question: "Have we prayed about it before we planned it?" },
  { value: "god_ideas", question: "Is it a God-sized idea, or just a good one?" },
  { value: "vision", question: "Who is it for, and how will we know it’s working?" },
  { value: "grace", question: "Does it make room for grace, especially for someone new?" },
  { value: "mission", question: "If we weren’t already doing it, would we start it today?" },
];

export type Conversation = {
  id: string;
  name: string;
  /** Optional flag, e.g. for the one that can't wait. */
  flag?: string;
  /** Where we are now: one or two honest sentences. */
  now: string;
  /** The one big question. */
  question: string;
  /** What to think about before Sunday. */
  think: string[];
  /** Sparks, not proposals. */
  whatIf: string[];
  /** The values this one leans on hardest. */
  values: ValueKey[];
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: "supper",
    name: "The Lord’s Supper",
    flag: "This one can’t wait",
    now: "The Supper is the heart of our Sunday. The way we share it hasn’t changed in a long time, and we believe it’s time.",
    question: "How can the Lord’s Supper feel like a family gathered at the table?",
    think: [
      "When has the Supper meant the most to you? What made it different?",
      "What part of how we do it comes from Scripture, and what part is just habit?",
      "What would help a first-time guest feel included, not watched?",
    ],
    whatIf: [
      "We sang together while we shared it.",
      "We gathered in small groups, huddled up, and prayed for each other.",
      "We shared it first, while everyone is still up and greeting, then moved into worship and the sermon.",
      "Giving moved to boxes by the doors and online, so the offering isn’t a stop in the service.",
    ],
    values: ["jesus", "relationships", "mission"],
  },
  {
    id: "singing",
    name: "Our singing",
    now: "There are 30 to 40 of us in a big room, with one song leader carrying all of it. That’s a lot to ask of anyone, and our singing can sound thin.",
    question: "What would make you want to sing out?",
    think: [
      "Think of a time you sang your heart out at church. What made it happen?",
      "What do our children and grandchildren sing during the week?",
      "Which songs should never leave us? Which ones could rest a while?",
    ],
    whatIf: [
      "A small group led the singing together: several voices up front, not one.",
      "We sang along with a worship song on video now and then.",
      "We learned one new song together over a few weeks.",
      "We sat closer together so we could hear each other sing.",
    ],
    values: ["relationships", "god_ideas", "mission"],
  },
  {
    id: "room",
    name: "Our worship room",
    now: "Our pews were built to seat almost 300 people. On a Sunday there are 30 to 40 of us, spread out across all that space.",
    question: "What if the room itself brought us closer together?",
    think: [
      "Where do you sit now, and how far away is the next person?",
      "What does a room full of empty pews say to someone visiting for the first time?",
      "What could happen in this room during the week if the floor were open?",
      "Do the pews hold memories for you? How could we honor them?",
    ],
    whatIf: [
      "We traded the pews for good, comfortable chairs.",
      "We set the chairs close together, so our singing filled the room.",
      "The open space let us gather in small groups and pray together during the Lord’s Supper.",
      "On other days, the room opened up for youth nights and events.",
    ],
    values: ["relationships", "mission", "god_ideas"],
  },
  {
    id: "wednesday",
    name: "Wednesday nights",
    now: "About 8 young children come on Wednesday nights. That’s 8 children who want to be here, and that’s worth building on.",
    question: "What are Wednesday nights for, and where should they be a year from now?",
    think: [
      "Is it working? What would tell us: more children, their parents coming, children who bring a friend?",
      "How could our older members be part of it? Some of these children need a grandparent at church.",
      "What would help our teachers? Supplies, training, more hands?",
      "How could our building serve it better: the fellowship hall, a meal, a room made for kids?",
    ],
    whatIf: [
      "Families ate supper together first, then the children went to class.",
      "Parents had coffee and a short study of their own while the children learned.",
      "Each child had an adult in the church who knew their name and prayed for them.",
    ],
    values: ["relationships", "vision", "grace"],
  },
  {
    id: "events",
    name: "How we choose our events",
    now: "A lot of what goes on our calendar is there because it was on last year’s calendar. Vacation Bible School is the clearest example.",
    question: "What should it take for an event to make our calendar?",
    think: [
      "What church event do you still remember years later? Why that one?",
      "If our calendar for next year started blank, what would you put on it first?",
      "Who should decide what we do, and how?",
    ],
    whatIf: [
      "Every event started from zero each year and had to earn its spot.",
      "An event happened only if someone had a great idea and the heart to lead it, and skipping a year counted as a good choice.",
      "Our children’s event next summer started with a fresh idea and got a new name, instead of being called “VBS” again.",
    ],
    values: ["god_ideas", "vision", "mission"],
  },
  {
    id: "leading",
    name: "How we plan, recruit, and train",
    flag: "December and January are for planning",
    now: "Too often we ask people to help without telling them why, or what they’ll be doing. Our leaders rarely get the time to think every detail through.",
    question: "What if every ministry started with a clear why, a real plan, and people ready to do it well?",
    think: [
      "What makes you say yes to helping: a sign-up sheet, or a picture of what God could do through it?",
      "What do you wish someone had told you before you served?",
      "What does a leader need to have worked out before anything is announced?",
    ],
    whatIf: [
      "December and January became our planning season: the big picture in December, the details in January, so each ministry has its year planned before it begins.",
      "We asked people to serve by sharing the vision first and the job second.",
      "Everyone who serves got a short training and a one-page plan before they started.",
      "After each event, the leaders took 15 minutes to ask what worked and what to change.",
    ],
    values: ["vision", "prayer", "relationships"],
  },
];

/** The bar an event has to clear (drawn from Joe's VBS example). */
export const EVENT_BAR = [
  "We know who it’s for and what we hope happens in them.",
  "It’s a fresh idea, not a copy of last year.",
  "Someone is excited to lead it, and enough people will help do it well.",
  "It was planned in our December–January planning season, with its people trained before it starts.",
  "It answers yes to the seven questions.",
];

/** How Sunday's conversation will go. */
export const GROUND_RULES = [
  { title: "Direction, not details", body: "We’re choosing where to head, not planning the event. Details come later." },
  { title: "Why before how", body: "Talk about the purpose first. The right “how” follows a clear “why.”" },
  { title: "“What if” before “we can’t”", body: "Let an idea breathe before we look for reasons it won’t work." },
  { title: "Same questions for every idea", body: "Old ideas and new ones, yours and mine, all meet the same seven questions." },
];
