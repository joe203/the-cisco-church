import type { Bulletin } from "./types";

/**
 * Fallback bulletin — transcribed from the printed October 4, 2026 bulletin.
 * Shown only when Supabase is unconfigured/unreachable or has no published
 * bulletin yet, so /bulletin never renders empty.
 */
export const seedBulletin: Bulletin = {
  bulletin_date: "2026-10-04",
  status: "published",
  published_at: "2026-10-01T12:00:00Z",
  updated_at: "2026-10-01T12:00:00Z",

  order_of_service: {
    song_leader: "Jonathan Thompson",
    items: [
      { label: "Welcome & Scripture Reading", who: "", note: "" },
      { label: "Congregational Singing", who: "", note: "" },
      { label: "The Lord's Supper & Offering", who: "", note: "" },
      { label: "Presiding", who: "Mike Lewis", note: "" },
      { label: "Congregational Singing", who: "", note: "" },
      { label: "Sermon", who: "Joe Cabrera", note: "“The Jesus Test”" },
      { label: "Invitation Song", who: "", note: "" },
      { label: "Closing Comments & Prayer", who: "", note: "" },
      { label: "Closing Song & Dismissal", who: "", note: "" },
    ],
  },

  announcements: [
    {
      id: "fellowship",
      title: "First Sunday Fellowship",
      when: "October 4",
      body: "Join us today after morning worship for a fellowship meal, congregational singing, and a short devotional.",
      note: "No evening service.",
    },
    {
      id: "family-day",
      title: "Family Day at the Camp",
      when: "October 10, 9:30 am–3pm",
      body: "Mark your calendars and join us for a Family Day at the Camp! Come enjoy a day of hiking, hot dogs, s’mores, fellowship and a devotional together.",
      note: "",
    },
    {
      id: "mens-breakfast",
      title: "Men’s Breakfast",
      when: "October 10, 8:00 am",
      body: "Men, join us at 8:00 AM at Denny’s for breakfast and a great time of fellowship. We hope you’ll join us!",
      note: "",
    },
    {
      id: "foster-cans",
      title: "Foster Home For Children Cans",
      when: "",
      body: "If anyone has a green can for the Foster Home For Children, please turn it into the office this week. Thank you!",
      note: "",
    },
  ],

  prayer_groups: [
    {
      label: "",
      names: [
        "Kennedy",
        "James & Lauren Dye and family",
        "Sherry Trahan",
        "Jim Dolgener",
        "Damon Waggoner",
        "Mike Lewis",
        "Caryon Garrett",
        "Ken Cebrun",
        "Jerry Stephenson",
        "Jon & Glenda Dennison",
        "Jason Lowe",
        "Janice Reeve",
        "Josh & Karlie Hamilton and Family",
        "Sharon Wilcoxen",
        "Sandrea Stuart",
        "Julia Harris",
        "Olene Knight",
        "Marcia Hale",
        "River",
      ],
    },
    {
      label: "Nursing home",
      names: ["Joan Penn", "Cecelia Boles", "Johnny Adams", "Barbara Brinkley", "Joy Davies"],
    },
  ],

  article: {
    kicker: "From the Minister’s Desk",
    title: "Hold On To What Is Good",
    subtitle: "",
    body: [
      "Do you hear the voices? Sermons on YouTube. Posts on social media. Podcasts, apps, the radio, the evening headlines, a friend's strong opinion over coffee. Never before has so much teaching been so close at hand, and all of it asks for a place in our thinking.",
      "So what do we do with what we are hearing?",
      "Do we listen, accept, disagree, or examine it more closely? Sometimes we write the voices off altogether, as if they were a danger to us and to everyone we love.",
      "But the person on the other side of that conversation may be a lot like us. They may be on a spiritual journey too, trying to understand what it means to belong to God. Like us, they, too, are shaped as we all are by the circle where they worship and the teaching they have received. Paul warned us to reject \"every kind of evil,\" and some teaching does deserve that. But most of the people we talk with about faith are not peddling evil. They are speaking from their understanding of faith which is what Jesus would want them to do.",
      "Paul gave the church at Thessalonica a better way: \"but test them all; hold on to what is good, reject every kind of evil\" (1 Thessalonians 5:21–22).",
      "Notice that Paul did not say, \"Accept everything.\" But neither did he say, \"Reject everything unfamiliar.\" He told them to test. There's an older, plainer way to put it: eat the meat and spit out the bones.",
      "That is a skill, and like any skill, it grows with practice. So throughout October, I'd like to invite you to learn it with me. My hope is that we can work on this together, sharing some sound, practical approaches, helping one another think it through, and growing side by side.",
      "This matters more than ever for our children and grandchildren. They will hear more voices than we ever did, and the ability to discern will only become more important for them.",
      "Along the way, I think we will discover that discernment is not mainly about getting better at finding what is wrong, but about noticing what is good, and becoming a church that is open to every good gift while anchored in Christ.",
      "**THIS SUNDAY: OCTOBER 4**\n**The Jesus Test**\nEvery test needs a standard. Where do we begin?",
    ].join("\n\n"),
  },

  series: {
    title: "Hold On to What Is Good",
    tagline: "Open to every good gift. Anchored in Christ.",
    verse: "“Test them all; hold on to what is good.” — 1 Thessalonians 5:21 NIV",
    weeks: [
      { date: "2026-10-04", title: "The Jesus Test" },
      { date: "2026-10-11", title: "Ask Better Questions" },
      { date: "2026-10-18", title: "With All His Might" },
      { date: "2026-10-25", title: "Hope for the Family" },
    ],
  },
};
