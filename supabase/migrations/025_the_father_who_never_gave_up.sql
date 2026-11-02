-- 025_the_father_who_never_gave_up.sql — Lesson 1 content: key verse, summary, quotes, guide questions, points.
-- Mirrors theFatherWhoNeverGaveUp in lib/seed.ts. Idempotent. Requires 010 and 024.
-- Apply: docker exec -i supabase-db psql -U supabase_admin -d postgres < 025_the_father_who_never_gave_up.sql

begin;

update cisco.cisco_sermons set
  scripture_ref = 'Romans 8:15 · Luke 15:11–32',
  summary = 'We praise God “for the Son of Thy love.” Over five Sundays we’re looking at something that runs throughout the entire Bible: God’s desire to have a relationship with us, not simply as our Creator, but as our Father. The Old Testament is a story of the distance God went to show us how much He loves us. But are we hearing what He has been saying since He walked in the garden? God didn’t simply create a world He could rule. He created people He could love. Like the father in Luke 15, He gives us space, keeps the light shining, and welcomes us home, not as hired hands but as sons and daughters who cry, “Abba, Father.” God didn’t send Jesus simply to save us from something. He sent Jesus to bring us back to Someone.',
  nuggets = array[
  'God doesn’t simply want our obedience. He wants our hearts.',
  'God didn’t send Jesus simply to save us from something. He sent Jesus to bring us back to Someone.',
  'The greatest gift God offers us isn’t simply a place in heaven. It’s a place in His family.'
],
  guide_questions = array[
  'How far would you go to convince someone that you love them? Think of an Old Testament story you know well — Noah, Abraham, the Exodus, David. What does it show you about the distance God was willing to go for His people?',
  'A firefighter rescues a child from a burning house. What changes when the child is his own son or daughter? “God doesn’t simply want to rescue us. He wants us home.” Which picture of God have you lived with most: Rescuer, or Father?',
  'Jefferson Fisher asks, “Is what I say what people hear?” Turn that question toward God. What has He been trying to say since He walked in the garden with Adam and Eve? What are you hearing? How do you hear God?',
  'Read John 3:16, Romans 5:8, and Romans 8:15: God’s motivation, His demonstration, and His invitation. Which of the three is hardest for you to believe is meant for you personally? Why?',
  '“A lighthouse doesn’t force anyone to come home. It simply keeps shining so they can find their way back.” Is there someone you love who has wandered — from you, from God, or both? What would keeping the door open for them look like this week?',
  'Read Luke 15:11–24 and Romans 8:15–16. The son came home looking for a place to work; the father welcomed him back as a son. Do you relate to God more like a hired servant or a child? What would change if you truly believed you could cry out, “Abba, Father”?'
]
where slug = 'the-father-who-never-gave-up' and summary is null;

insert into cisco.cisco_sermon_points (sermon_id, position, title, label, body)
values
  ('b1000000-0000-4000-8000-000000000010', 1, 'Not Simply Our Creator, but Our Father', 'For the Son of Thy Love',
   'We praise God “for the Son of Thy love.” Over the next five Sundays we’re looking at something that runs throughout the entire Bible: God’s desire to have a relationship with us. Not simply as our Creator, but as our Father. How far would you go to convince someone that you love them? The Old Testament reveals how far God was willing to go. It is a story of the distance God went to show us how much He loves us and how much we need our Creator. Throughout it God was patient, merciful, and gracious while He worked His plan, and the lesson wasn’t just for the house of Israel. It was for humanity.'),
  ('b1000000-0000-4000-8000-000000000010', 2, 'He Wants Us Home', 'The First Responder',
   'A firefighter rescues a child from a burning home. But what if the child inside that house were his own son or daughter? God doesn’t simply want to rescue us. He wants us home.'),
  ('b1000000-0000-4000-8000-000000000010', 3, 'Are We Hearing God?', 'Is What I Say What People Hear?',
   'Jefferson Fisher, a Texas trial attorney and author of The Next Conversation, asks, “Is what I say what people hear?” What is God trying to communicate to us? What are you hearing? How do you hear God? Do we finally get what God has been trying to communicate since Adam and Eve? What do you see when you see God creating man, or walking in the garden? God’s desire was not merely to have people worship Him. It’s about family.'),
  ('b1000000-0000-4000-8000-000000000010', 4, 'The New Testament’s Father–Child Story', 'John 3:16 · Romans 5:8 · Romans 8:15',
   'Humanity has developed many understandings of God. Judaism recognizes God as Father but does not accept Jesus as His divine Son. Islam rejects the idea that God has a Son. Hinduism and Buddhism understand ultimate reality very differently. But at the heart of Christianity is something extraordinary: God loves us so deeply that He gave His Son, not simply to save us, but to bring us into His family. The temple and the Ark were never God’s ultimate vision of His presence; in the new covenant God lives in us, and the distance barrier has been removed. His motivation: He loved the world (John 3:16). His demonstration: while we were still sinners (Romans 5:8). His invitation: the Spirit of adoption (Romans 8:15). God didn’t simply create a world He could rule. He created people He could love.'),
  ('b1000000-0000-4000-8000-000000000010', 5, 'Keeping the Door Open', 'God’s Persistence',
   'What would it take for us to truly believe that a relationship with God as His son or daughter is better than anything out there? Can we be convinced? Why is that so hard to believe? Many of our deeply held beliefs are rooted in our core, and turning someone around can take a long time. When you can’t be a bridge, be a lighthouse. God wants us to cross the bridge and move closer to Him. A lighthouse doesn’t force anyone to come home. It simply keeps shining so they can find their way back. God wants to close the gap between us and Him. The lighthouse helps us find our way, but the bridge allows us to come home.'),
  ('b1000000-0000-4000-8000-000000000010', 6, 'The Father Never Gave Up', 'Luke 15 · Romans 8:15–16',
   'The son took his inheritance, and the father gave him space. Love doesn’t always prevent someone from walking away. Sometimes we have to remember the goodness of the Father before we’re willing to return to Him. The father didn’t make the inheritance the issue; the relationship mattered more. The son came home looking for a place to work. The father welcomed him back as a son. The Bible is the story of a Father restoring His family: created for fellowship, broken by sin, the way prepared in the Old Testament, and the welcome home through Jesus. We can cry out, “Abba, Father” — a relationship of love, belonging, and intimacy rather than fear. We don’t simply recognize God as our Creator. We come to know Him as our Father.')
on conflict (sermon_id, position) do nothing;

commit;
