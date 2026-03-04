export type Testimonial = {
  quote: string;
  author: string;
  stars: number;
  publishedAt?: string;
};

export type TestimonialPage = Testimonial & {
  slug: string;
  excerpt: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const buildExcerpt = (quote: string, maxLength = 200) => {
  const cleaned = quote.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 1).trimEnd()}…`;
};

const parsePublishedAt = (value?: string) => {
  if (!value) return Number.NEGATIVE_INFINITY;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
};

const sortByNewest = (
  a: Testimonial & { _index: number },
  b: Testimonial & { _index: number },
) => {
  const dateDelta = parsePublishedAt(b.publishedAt) - parsePublishedAt(a.publishedAt);
  if (dateDelta !== 0) return dateDelta;
  return a._index - b._index;
};

export const testimonials: Testimonial[] = [
  {
    quote: `I started with Michael in 2018 and have had an outstanding experience! He brings a wealth of knowledge and a truly professional, friendly approach to my dental practice. His advice is not only practical but also easy to implement, and I've seen improvements in patient satisfaction and office efficiency. Most recently, Michael and his team helped facilitate a chart sale that was fair to both seller and buyer (myself). He expertly guided us through the process and continues to monitor our progress, ensuring a smooth and successful transfer of patients. I highly recommend Michael to any dental team looking to level up their game!`,
    author: "G. Allen Herrera, DDS",
    stars: 5,
    publishedAt: "2025-11-12",
  },
  {
    quote: `PURPOSE..... Michael, your purpose in making Queensboro Oral Surgery an amazing and truly functioning workplace is definitely working. There have been many positive changes since you have arrived and as for me it has helped me immensely. After your first visit I was hesitant in believing that change can occur here but it has. So a huge thank you to you!!!`,
    author: "Team Member",
    stars: 5,
  },
  {
    quote: `Michael - many thanks for your magnanimous gifts of Pride Cabernet Sauvignon and your book on Dental Practice Transitions. I sincerely appreciate the passion, wisdom, and experience you offer our students as well as our personal friendship. Best of season's greetings to you and your family.`,
    author: "Craig S. Yarborough, DDS, MBA",
    stars: 5,
  },
  {
    quote: `Dr. Michael has become not only a colleague, but a trusted friend who has helped navigate the challenging landscape of a multi state, multi- practice operation. His availability is his best ability. His efficient, calm leadership really made our transition smooth. Providing healthcare for patients becomes harder every day. Dr. Michael makes it easier.`,
    author: "Blaine Leeds",
    stars: 5,
    publishedAt: "2025-11-11",
  },
  {
    quote: `Michael has made this such a smooth process for me. He knew my inexperience, but still guided and protected my decision making. I felt that everything was fairly and graciously handled. I am so grateful for his guidance. I am happy I was able to buy my first practice with Michael.`,
    author: "Justus Williams",
    stars: 5,
    publishedAt: "2025-10-12",
  },
  {
    quote: `Michael worked with me on a practice acquisition and I couldn't be more pleased. The help and advice given during the process made me feel secure in the purchase and decisions along the way of my practice. Someone as experienced as Michael in your corner is essential to navigating through the process. He's my coach, confidante, and provides honest, unfiltered advice.`,
    author: "Erica Haskett",
    stars: 5,
    publishedAt: "2025-09-12",
  },
  {
    quote: `Despite taking numerous courses on buying a dental practice, I still felt overwhelmed and unsure of where to begin. Working with Michael Njo and attending one of his seminars was a turning point. I gained valuable insights that I hadn't encountered elsewhere. Michael is not only incredibly knowledgeable but also genuinely cares about the success of those he works with. I also purchased his book, Dental Practice Transitions Handbook, which provided clear, practical guidance and further deepened my understanding of the transition process. Michael and his team at Dental Transitions bring both expertise and integrity to the table, and working with them has been a truly positive experience. I'm confident in the path ahead and look forward to continuing to work with Dental Transitions as I move into the next stage of my professional journey.`,
    author: "J. Anny Yoo",
    stars: 5,
  },
  {
    quote: `Mike and the other advisors made the webinar both insightful and practical. Great real-world strategies that gave me more clarity and confidence in planning my next steps.`,
    author: "Jai Cho",
    stars: 5,
  },
  {
    quote: `I am so glad that I attended Dr. Michael Njo's recent seminar. He went into meticulous detail about acquiring and selling a dental practice. I was fortunate to attend dental school with Dr. Njo, and I am so impressed with how he pivoted and became counsel for countless people in practice transitions. When it is my time to sell, I know I will be in good hands!`,
    author: "Kevin Barry",
    stars: 5,
    publishedAt: "2025-09-11",
  },
  {
    quote: `I recently sold my dental practice after 41 years. I was primarily concerned to find a dentist who matched my treatment planning philosophy and to take good care of my wonderful patients and staff. In the current environment of corporate dentistry, I knew that it would not be an easy task. Fortunately, a colleague gave me the name of Michael Njo and Dental Strategies. Because Michael is a dentist with general practice experience, he has a great understanding of the important aspects for a transfer of a practice, not only for the seller but also for the buyer. I am quite happy that I had Dr Njo to help me navigate my sale! He was very easy to work with. I am glad to report that together we found a great match for my staff and patients.`,
    author: "Gregory Baird",
    stars: 5,
    publishedAt: "2025-03-12",
  },
  {
    quote: `I attended Mike's practice transition seminar and read his book. He was a very knowledgeable and seasoned expert in this area. I decided to use his consultation service to handle my practice sale. He was able to match a buyer within 2 weeks and completed the transaction within 45 days. He was so amazingly efficient throughout the transition process. I highly recommend him to any dentist interested in selling or buying a dental practice. Thanks again, Mike, you are my Superman.`,
    author: "Tony Choi",
    stars: 5,
    publishedAt: "2025-03-11",
  },
  {
    quote: `I had the opportunity of attending a transition program by Dr. Michael Njo. I was impressed beyond belief with his knowledge, expertise, and caring manner when helping practice buyers and sellers. I am getting ready to transition out of practice and want my patients to be cared for in the same manner they have been for 30 years. As a dentist I knew that Michael's level of understanding and calming expertise would allow him to guide me through this experience without a doubt. I did not hesitate for one minute before committing to work with him on this very important life change. I look forward to his guidance and have shared with my peers that any transition they plan should involve Dr. Njo. Thank you!!`,
    author: "Linnea Westerberg",
    stars: 5,
    publishedAt: "2025-08-11",
  },
  {
    quote: `After 35 years of owning my private dental practice, deciding to sell was both a deeply personal and professional milestone. I was fortunate to work with Michael Njo at Practice Transitions Institute, whose expertise, integrity, and calm guidance made all the difference in this life changing process. Michael approached the transition with genuine care. As a fellow dentist himself he understood the emotional weight of passing on a practice built over decades - not just the business side, but the relationships with my patients, staff, as well as the legacy I wanted to preserve. His firsthand experience gave me confidence and I knew I was in good hands. Michael navigated every stage of the transition with professionalism and respect for my goals. He found the perfect buyer who shares my commitment to high quality dental care and will carry on the legacy I worked so hard to build. I know my patients and staff will be left in good hands. If you are considering selling your practice and want a team that truly understands the emotional and practical complexities of the process, I highly recommend Michael and the Practice Transitions Institute.`,
    author: "Brian Valle",
    stars: 5,
    publishedAt: "2025-08-12",
  },
  {
    quote: `I have known Dr. Michael Nio since 2016, and over the years he has played an important role in some of the biggest professional decisions of my career.

When Michael sold our practice in 2020, he delivered exactly what he said he would. His valuation proved accurate, the process was smooth, and his guidance gave us confidence every step of the way. In an environment where uncertainty can be overwhelming, Michael brought clarity, honesty, and calm leadership.

I've also watched him step in for colleagues during some of the most stressful moments of their careers. One close friend of mine needed to sell his practice quickly because of serious health concerns. Michael was able to find the right buyer and secure an excellent price in less than 90 days, allowing that doctor to step away with dignity and financial stability. That is the kind of impact that goes beyond business.

Michael has also helped me personally during a very contentious partnership situation. His advice steered me away from what could have been a long and damaging legal battle. By trusting his experience, I was ultimately able to walk away with every dollar owed to me under my contract. That kind of real-world guidance is invaluable and only comes from someone who truly understands both the business and the people involved.

What makes Michael unique is that he doesn't just act as a broker - he becomes a trusted advisor. He works with an excellent legal team that understands how to structure strong dental agreements. He is deeply connected with everyone from large DSOs to boutique private practices, and he brings trusted relationships in marketing, SEO, and malpractice insurance. Having that level of support through one person is incredibly rare.

Beyond his professional skill, Michael is someone I consider a friend and like family. He has a steady, calming presence that makes complex transitions feel manageable. People often say that herding dentists is like herding cats - if that's true, Michael is the shepherd who knows how to bring everyone together and guide them safely forward.

I recommend him without hesitation to any dentist facing a transition, partnership decision, or major career move. Few people combine experience, integrity, and genuine care for their clients the way Michael does.`,
    author: "Dr. Lee Boese",
    stars: 5,
    publishedAt: "2026-02-25",
  },
  {
    quote: `I would like to sincerely thank Dr. Njo for once again taking the time to come and share his knowledge with us. Having attended his previous session as well, I truly appreciate his continued support and commitment to mentoring us.

His detailed lessons on how to carefully read and analyze dental benefit contracts, understand critical clauses, evaluate reimbursement structures, and assess long-term financial implications have truly opened our horizons. Additionally, his guidance on buying a dental practice - what numbers to review, what contractual points to look over, and how to approach decision-making analytically rather than emotionally - has given me clarity and confidence for the years ahead.

Beyond his expertise, Dr. Njo is such a humble person, always approachable with an ever-smiling face. Despite his busy schedule, he generously gives us his time and attention. I feel truly thankful and blessed to not only learn from him professionally but also to know him as a person.`,
    author: "Ankit Sidana",
    stars: 5,
    publishedAt: "2026-02-16",
  },
  {
    quote: `Dr. Njo is an exceptional dental consultant and broker who brings unmatched expertise, integrity, and strategic insight to every engagement. His deep understanding of both clinical practice operations and the business side of dentistry makes him an invaluable resource for dentists at every stage of their careers.

As a consultant, Dr. Njo has a remarkable ability to evaluate a practice comprehensively - from production and profitability to systems, team performance, and growth opportunities. His recommendations are thoughtful, data-driven, and tailored to the specific goals of each client. He doesn't just identify opportunities; he provides clear, actionable strategies that lead to measurable results.

As a broker, Dr. Njo demonstrates professionalism and transparency throughout the entire transaction process. He skillfully guides buyers and sellers with confidence, ensuring smooth transitions while protecting their best interests. His attention to detail, market knowledge, and negotiation skills consistently lead to successful outcomes.

What truly sets Dr. Njo apart is his commitment to relationships. He builds trust, communicates clearly, and genuinely cares about the long-term success of the dentists and practices he serves. I highly recommend Dr. Njo to any dental professional seeking expert consulting guidance or a trusted partner in buying or selling a practice.`,
    author: "Kevin Valle",
    stars: 5,
  },
  {
    quote: `I have worked with Dr. Michael Njo for nearly twenty years serving as my pediatric dental practice consultant. Just as importantly, he has been a trusted mentor and close friend during this time. Michael sets himself apart as a consultant with the unique expertise he has in the field, his impeccable character, and the bold short- and long-term strategic vision he sees for his clients.

Michael has great experience in practice consulting because he has worked with dentists in many different stages of their careers from scratch starts to practice transitions. I think that any problem that I run into, Michael has seen it before and knows how to address it. In this way he can help identify what is not working and suggest improvements before small issues turn into big problems.

Michael has a vast network of contacts that is invaluable. He has referred me to professionals in the banking, personal financial, dental insurance, fee schedules, payment processing, and staffing industries, among others. Specifically, Michael has helped us adopt marketing strategies to attract new patients, help our practice stand out in a crowded market, and deliver an exceptional patient experience.

In my practice, Michael's skill with team building has been instrumental in attracting, onboarding, and maintaining talent in a challenging labor market. He created a bonus program to incentivize our team, and his advice has helped me handle staff challenges with confidence.

Michael operates with integrity in all he does, even parting ways with clients who do not share his ethical standards. His focus on doing what's right ultimately strengthens his business and the community he serves.

Over the years, he has guided me through lease negotiations, real estate purchases, loan restructuring, and the opening of a second practice - all while ensuring alignment between professional success and personal goals.

I began working with Michael after struggling through the Great Recession of 2008. With his support, my office production has multiplied many times over, and I've grown both as a professional and as a person. I'm deeply grateful for his mentorship and look forward to many more years of collaboration.`,
    author: "Jon Sierk",
    stars: 5,
    publishedAt: "2026-02-09",
  },
  {
    quote: `Michael and I have worked together for almost two years in pursuit of achieving my goal of practice ownership. He has coached, supported, encouraged, and guided me through the process from start to finish. He has made a breeze of what could have been the most stressful time in my career, and I have confidently taken one step after another knowing I was being coached by the best. I cannot recommend Michael and the Dental Strategies team more.`,
    author: "Christian Lopez Cornejo",
    stars: 5,
    publishedAt: "2025-06-12",
  },
  {
    quote: `Thank you Michael. We appreciated your experience, kindness, professionalism, patience, and help when we needed it.`,
    author: "Mike Miller",
    stars: 5,
    publishedAt: "2025-06-10",
  },
  {
    quote: `Practice sales are emotional and trying and yet also exciting. I was glad I had PRACTICE TRANSITION INSTITUTE and Michael Njo in my corner. Thank you Michael.`,
    author: "Scott Smith",
    stars: 4,
    publishedAt: "2025-12-12",
  },
  {
    quote: `I have worked with Michael on several deals now, and I can honestly say there aren't many people capable of doing what Michael does. I have even sent many dentist friends his way and they all say the same thing. He is efficient, incredibly responsive, very thoughtful about crafting win-win deals for both the buyer and seller. I honestly would never consider working with anyone else. I give him my highest recommendation possible!`,
    author: "Jack Ohanesian",
    stars: 5,
    publishedAt: "2025-06-11",
  },
  {
    quote: `After being diagnosed with serious health conditions that led to having to step away from dentistry Michael Ngo was able to negotiate and complete the transition of my practice smoothly. I am relieved that both my valued patients and staff have been taken care of and that I am able to focus on healing. I believe that anyone wanting to transition their practice will find themselves in competent hands that will make their journey as easy as possible. Thanks...`,
    author: "Alec Ferradas",
    stars: 5,
    publishedAt: "2025-04-12",
  },
  {
    quote: `I attended one of Michael Njo's seminars and was pleasantly surprised by the amount of information presented. As I am considering retiring in the next few years and selling my office, I had been feeling overwhelmed by all the details involved. However, the seminar and the book Dental Practice Transitions Handbook turned out to be a great starting point. Michael is perceptive of each dentist's needs and unique situation. I shared my timeline, and he adapted his approach accordingly. His organization has a team of professionals with the depth of expertise to handle every aspect of the transition. I look forward to working with Dental Transitions as I move into the next stage of my life.`,
    author: "Richard Dare",
    stars: 5,
    publishedAt: "2025-04-11",
  },
  {
    quote: `Favorite part about DBC is learning from Dr. Njo and working with the rest of the executive board.`,
    author: "Armaan Grewal",
    stars: 5,
  },
  {
    quote: `As we were in the midst of a complex process to sell our dental practice, we encountered challenges in securing an offer that reflected the true value of our well-established family practice. Despite garnering interest from several dentists, it proved to be a daunting task. Additionally, my need for orthopedic surgery necessitated the hiring of a dentist to fill in for a six-month period during my recovery. It was during this time that we were introduced to Dental Strategies by one of the bankers assisting us. Michael promptly met with us and initiated the process. Within just two months, we were introduced to a prospective buyer. Working with someone like Michael, who is not only a former dentist but also possesses expertise that surpasses that of a traditional real estate broker, proved to be advantageous for us. His knowledge in the field allowed us to navigate through the complexities of selling our dental practice with confidence. The assistance provided by attorney Mike Treppa, and Dental Strategies played a crucial role in successfully selling our dental practice. Their expertise and guidance not only facilitated the process but also ensured that we received an offer that truly reflected the value of our well-established family practice.`,
    author: "Kimberly Crum",
    stars: 5,
    publishedAt: "2025-03-09",
  },
  {
    quote: `In the world of dentistry, owning your own practice is often a dream that many dentists aspire to achieve. However, the road to becoming a practice owner is not always an easy one. It requires careful planning, hard work, and the right guidance to navigate through the complex process of purchasing a dental clinic. I have always dreamed of owning my own dental practice, but I was unsure of where to begin. I attended numerous seminars and scoured online listings for dental practices on sale, but I struggled to find a clinic that met my expectations. I was overwhelmed by the amount of work and the steps required to make this dream a reality. For instance, I had no idea which attorney or lender to use, and I felt lost in the sea of information. It was during this uncertain period that I connected with Michael. He proved to be a tremendous asset, guiding me through the entire process of purchasing a dental clinic. He patiently answered all of my questions and went above and beyond to help me every step of the way. With his expertise and guidance, I was able to find a clinic that not only met my needs but exceeded my expectations. The transfer of ownership was not without its challenges, but Michael was by my side every step of the way. He fostered a positive relationship between myself and the selling dentist, ensuring a smooth and successful transition. Thanks to Michael's help, I was able to retain a highly experienced team and continue to grow this beautiful dental practice. I am grateful for his expertise and dedication, and I couldn't have achieved this dream without him. I would highly recommend Michael to anyone looking to purchase a dental clinic, as he truly goes above and beyond to make dreams a reality.`,
    author: 'Meng-Ju "Colin" Du - DMD',
    stars: 5,
    publishedAt: "2025-03-10",
  },
  {
    quote: `Michael was great. I had his support 100% during the whole process. I recommend his services to anybody who has decided to sell or buy a practice. Honest, friendly and reliable. I couldn't have done this without your help. Thank you Michael!`,
    author: "Maricela Murillo",
    stars: 5,
    publishedAt: "2024-03-08",
  },
  {
    quote: `Michael goes above and beyond to get the deal done for you. I have done not one but two difficult transactions with him. There were hiccups along the way. He was persistent, always available to talk and had creative solutions to any problem. He has access to some of the best resources in the industry which helped us get the deal done on time and smoothly. Please hire him you won't regret!!`,
    author: "Shilpi Seth",
    stars: 5,
    publishedAt: "2024-03-11",
  },
  {
    quote: `I had the pleasure of meeting Fred & Liz. Fred's insight is a goldmine for anyone looking to purchase or sell a dental practice. Fred's expertise in valuations and legalities is impressive. The resources provided seem comprehensive and well-crafted, a testament to their experience. If you're a dentist considering a practice transaction, I recommend tapping into their knowledge and experience.`,
    author: "Alexander Zaykov",
    stars: 5,
    publishedAt: "2024-03-09",
  },
  {
    quote: `Thank you so much for all of your help in all of my transitions. It is quite safe to say that I would not have been able to do it without you. Your experience and knowledge always helps to keep things in perspective and allows me to hone my energy and attention. Your industry connections are also invaluable and your training allows me to speak to industry professionals as if I too am a seasoned expert. I have nothing but great appreciation and respect for you, and I will see you the next time around.`,
    author: "Jason Cellars",
    stars: 5,
    publishedAt: "2024-03-06",
  },
  {
    quote: `Everything went fine today with the wire transfers. I am sure that you know that. Today has been super busy with the termination of 12 employees and the rehiring of the same. Before I settled down tonight, I thanked God for your hard work, kit gloves and patience with 30 years of my husband's life. This was a major decision for us and the most stressful time of our marriage. We second guessed ourselves and almost pulled out daily. It was challenging in so many ways for us. When we thought the Buyers pulled out, you and Mike Treppa closed this deal. We needed you to know that we appreciated all of the time you spent trying to make everyone happy. We watched you work the numbers in all directions and at the end of the day everyone felt like a winner! Wow! What an amazing amount of effort! We are forever grateful! Thank you so very much! ❤️`,
    author: "Melisa Long",
    stars: 5,
    publishedAt: "2024-03-07",
  },
  {
    quote: `"Be careful what you ask for, because I will get it for you". That is what Michael from Dental Strategies said to me at our first face-to-face meeting. That was March 2023. We were referred to Michael after our practice was on the market for a year with few inquiries. We closed July 31, 2023 with full cash offer to a wonderful couple. That is testimony, thank you Michael.`,
    author: "Keith Long",
    stars: 5,
    publishedAt: "2024-03-10",
  },
  {
    quote: `Working with Michael Njo was an absolute pleasure during the transaction of my dental office. His wealth of professional connections and years of experience proved invaluable, ensuring a seamless process from start to finish. What impressed me most was his responsiveness and willingness to address my numerous questions promptly, even after hours, providing reassurance every step of the way. Michael's ability to find creative solutions in challenging situations was commendable, ultimately satisfying both the buyer and the seller. Thanks to his expert guidance, I am now the proud owner of a thriving dental office that has exceeded my expectations. I have no doubt that I would turn to Michael for his services again in the future, given his unmatched professionalism and dedication to achieving the best possible outcomes for his clients. He comes highly recommended as a dental consultant, and I extend my heartfelt gratitude for his outstanding support throughout the entire journey.`,
    author: "Lawrence Wong",
    stars: 5,
    publishedAt: "2024-03-12",
  },
  {
    quote: `As I approach the end of my pediatric dental career, I want to transition into the next phase of life well. That means being financially prepared in advance, and to leave a great practice to the next person. I'm so glad I have partnered with PTI to make this happen.`,
    author: "Rick Nichols",
    stars: 5,
    publishedAt: "2023-03-02",
  },
  {
    quote: `Going through selling your practice is similar to getting ready to treat a complex dental patient. You need to gather the pre-diagnostic history and information, conduct a thorough exam, and plan a treatment path that is in line with the patient's needs. Working with a professional like Michael, who has developed a well thought out linear path when it comes to selling dental practices, ensured that I was set up with the right candidate and the sale process was executed flawlessly. I am very happy with how things turned out.`,
    author: "Dr. Reza",
    stars: 5,
  },
  {
    quote: `Thank you, Michael, for guiding me through my moment yesterday morning. As Raymund said, you truly are my dental angel. I think the realization of what just happened will sink in sometime next year! You have helped me realize my dreams come true and so much more. I appreciate all the time, patience, and care that you have given during this entire process. I appreciate your guidance as a mentor and especially as a friend.`,
    author: "Roy",
    stars: 5,
  },
  {
    quote: `I attended the seminar with my spouse, who is the dentist, so I'm coming from a non-dental background. I came in with some knowledge of the dental career timeline and practice acquisition, and was blown away by how much more I learned in one day. Dr. Njo and the entire team taught at a level I could understand; everyone answered questions thoroughly, and my confidence in our ability to thrive in dentistry rose by more than I could have hoped.`,
    author: "Rebecca",
    stars: 5,
  },
  {
    quote: `Dr. Njo and the Practice Transitions Institute have created a beautiful and comprehensive look into the lifespan of a dental career. They address how to plan for a successful career, navigate and avoid common pitfalls as both an associate and practice owner, as well as prepare for early retirement with a comfortable future ahead of you! It is catered to teach valuable principles to practitioners at any point in their careers, and the interactive presentations really bring that home.`,
    author: "Teagan Willes, DDS",
    stars: 5,
  },
  {
    quote: `I feel extremely fortunate to have found and chosen Fred Heppner to help me through the process of selling my practice. I enjoyed Fred's straightforward demeanor, and his ability to simplify for me what would have been an overly complex endeavor. The sale happened very quickly and efficiently, and I couldn't be more pleased with the outcome!`,
    author: "Jeff Lewis, DDS, FACP",
    stars: 5,
  },
  {
    quote: `As a dental practice owner for 20 years, there comes a time when you transition from active ownership. In the fall of 2016, I made the decision to sell my successful dental practice and transition to managing as a clinical director and lead dentist. I contacted Fred for a practice appraisal and engaged his services for the sale. In March 2017, we closed the sale and I successfully transitioned. Fred was an ethical and responsive broker who found the perfect match, allowing my remaining career years to be some of the most fulfilling. I highly recommend Fred if you're considering selling or buying a practice.`,
    author: "Paul, D.M.D.",
    stars: 5,
  },
  {
    quote: `Hi Michael!! For what's worth… I just wanted to say I personally felt today's workshop was the best. The energy was so good and I am so excited about the new team members. Thank you for always keeping things real with a positive note!!`,
    author: "Karrie",
    stars: 5,
  },
  {
    quote: `I have worked with Fred in many different formats over the past six to eight years. Fred is the consummate professional. I have attended his lectures, had one-on-one meetings, and most recently worked with him on the sale of my orthodontic practice. When it comes to practice transitions, Fred is the best choice. He is thorough, knowledgeable, accessible, connected, and capable. He will gather the necessary data, work tirelessly with your team members, and create a win-win scenario for all parties involved. I highly recommend his services.`,
    author: "Blair Feldman, DMD, MS, MSEd",
    stars: 5,
  },
  {
    quote: `Hi Dr. Njo, I'm reaching out to you because of all of the dental field professionals I know, I think you are the most qualified to answer my question(s). My overarching question relates to the advice that I've heard several professionals offer about practice acquisition, which is to 'buy the biggest practice you can handle.' I have been actively informing myself on details of practice acquisition and management over the last few months. I have been listening to the Shared Practices podcast (so far I've listened to over 30 hours of practice acquisition specific information), I read your Dental Practice Transitions Handbook, I read The Million Dollar Dentist, I've read various resources from Breakaway Practices, Next Level Practices, and The Lifestyle Practice. Most of my learning helps me know what I don't know and what professionals I will need to help me in every step of my future.`,
    author: "T.W.",
    stars: 5,
  },
  {
    quote: `I was into year 4 of trying to sell my practice. I had been with 3 well known brokers without success. A trusted colleague knew my situation, knew I was ready to close the doors and implored me to call Michael. He said: 'Michael helped me resolve a difficult situation, he's different, he's special, and he will help you. You can trust him!' From day one the experience with Michael was different. He stated he was a transition specialist, different than a traditional broker and his approach was based on relationships he had formed. His goal was to create a win win situation matching a seller to the right buyer. Michael gave me hope, asked for my trust, and within 2 months introduced me to a terrific person, fine dentist, and a great match for my practice. Within 2 more months a favorable deal was on the table and soon thereafter the deal was closed and the funds were in my bank. Michael served me well, he was consistent, organized, found me a good match and got the job done! Thank you Michael well done Sir, as I am forever grateful!`,
    author: "Keith Boxerman, D.D.S.",
    stars: 5,
  },
  {
    quote: `Dear Michael, I just want to express my gratitude to you for the amazing meeting. So much positive information and graceful solutions, I really appreciate it. Thank you!`,
    author: "Val",
    stars: 5,
  },
  {
    quote: `Fred was wonderful to work with. I was buying my partner out and he was instrumental in being a non biased 3rd party to facilitate the sale and make sure each party understood the other side and each piece of the sale. He really took his time in speaking to us together and individually and was able to communicate all questions and concerns seamlessly. He also made himself available just about whenever necessary day or night. I would absolutely work with Fred again on future transactions given my great experience. He truly cared about both parties involved, not just a commission.`,
    author: "Jeff G., D.D.S.",
    stars: 5,
  },
  {
    quote: `Thank you Michael for everything you did for me but even more my family. My dad is in a much better place, the local dental society is pretty shook up because some think he was still working so there are a lot of scared dentists. But you and I know my dad checked every box for preexisting conditions but if his death encourages people to wear masks that is helpful.`,
    author: "Lee",
    stars: 5,
  },
  {
    quote: `I have dealt with brokers of all sorts in my life. Many were little more than listers, relying on others to do the 'heavy' work of actually making a sale happen. I wanted an individual who was not just a lister. I received that with Fred. His prospectus of my practice was bank ready. I followed his recommendations for my discussions with a buyer. Though not an accountant, his review of my recent tax returns showed an accounting error that provided me a large refund after submitting an amended return. Also not an attorney, he explained points in the contract that I should consider. He communicated well with the buyer and the lender right up until funds were wired to me from the lender. He was WELL worth his fee and I'm most happy I had his help working through what can be a very difficult process with unexpected roadblocks. THANK YOU FRED!!`,
    author: "R. Branstrator, D.D.S.",
    stars: 5,
  },
  {
    quote: `Thank you for guiding me through my moment yesterday morning. As Raymund said, you truly are my dental angel. I think the realization of what just happened will sink in sometime next year! You have helped me realize my dreams come true and so much more. I appreciate all the time, patience and care that you have given during this entire process. I appreciate your guidance as a mentor and especially as a friend. You have a very special talent, gift, and integrity of character. I sincerely thank you for being you.`,
    author: "Michelle",
    stars: 5,
  },
  {
    quote: `Michael, I truly do appreciate all that you have done in the office. Last year at this same time my staff was unhappy, rude to one another and I was extremely unhappy with them. There were days that I wanted to clean house and start with a new staff. I love practicing dentistry but dislike the pettiness and how truly mean women can be to one another. I am seeing an improvement and the mood in the office is improving and I know that this is the direct result of your participation in the practice. You have done a great job. Wishing you a wonderful New Year.`,
    author: "Lois",
    stars: 5,
  },
  {
    quote: `Michael, I just want to say THANK YOU for being so instrumental in the purchase of my practice. I have been so fortunate of meeting you and working with you for the past (almost) two years. I still can't believe that we did it! Now, it is going to take lots of work to get to where I want to be, but purchasing the practice (this practice) is a great beginning and I owe you soo much. Please let me know when you are around this area to take you to a good lunch or dinner, which is the least I can do to show you my appreciation.`,
    author: "Eugenio",
    stars: 5,
  },
  {
    quote: `Fred Heppner was a true asset in the sale of my practice. In a short time, Fred gleaned huge amounts of information from my office computer and put together a reader-friendly prospectus. At that point, the sale of the practice was put online in a discreet listing. Fred kept me informed and updated throughout as to any bites. I really appreciated his prompt email responses to my questions and depended a lot on his knowledge of management as well as tax information. His business and computer skills and his outreach to the state dental association made my transition perfect. I was completely satisfied with the negotiations and closure of my practice sale. He has splendid contacts with banks, attorneys, and management companies in the Southwest region. I can confidently recommend Fred Heppner for his accessibility and expertise in the business of dental transitions. He has a pleasant demeanor and is very approachable.`,
    author: "B. Holbrook, DMD",
    stars: 5,
  },
  {
    quote: `Very insightful book! I found the chapters in this book extremely informative. It covers topics that every Dentist should know, but are rarely talked about in dental school or dental circles. It was a great read coming right out of dental school. I highly recommend.`,
    author: "Dr. A. Jaraha",
    stars: 5,
  },
  {
    quote: `In Dental Practice Transitions Handbook, Dr. Michael A. Njo deftly navigates the ever-changing landscape of dental practice transitions, providing insightful advice and guidance to dental professionals at any stage of their career. Dr. Njo's approach emphasizes the importance of careful planning and educated decision-making to ensure long-term success in a field that has seen significant changes in recent years. The ideal audience for Dental Practice Transitions Handbook is dental professionals at any stage of their career, particularly those who are considering a transition, such as a partnership, acquisition, or sale of a practice. I wholeheartedly recommend Dental Practice Transitions Handbook by Dr. Michael A. Njo.`,
    author: "Technoguru",
    stars: 5,
  },
  {
    quote: `Dr. Njo is very knowledgable on all aspects of private practice dentistry. Reading this book will give you a lot of valuable insight to what decisions you should and shouldn't make in order to maximize your success in your dental career.`,
    author: "Amazon Customer",
    stars: 5,
  },
  {
    quote: `I listened to the author lecture about this book and the topic. I have started reading it and am so thankful that I have the resource at my fingertips!`,
    author: "Sloane",
    stars: 5,
  },
  {
    quote: `I began working with Dr. Michale Njo in 2006 during the purchase of a highly respected prosthodontic practice. While the practice was already well established, transitioning ownership at that level required thoughtful leadership and experienced guidance.

Dr. Njo was instrumental in making that transition seamless. He helped me establish credibility as the new owner, maintain patient confidence, and guide an established team through change with clarity and professionalism. His business and team coaching strengthened systems, workflows, and accountability, and his ability to coach people through change while maintaining morale was invaluable.

His leadership coaching had an equally meaningful impact. He helped me create a culture rooted in pride, expertise, and professionalism, and supported my growth not only as a practice owner but as a leader within the broader dental community.

I firmly believe that without his guidance, the transition would have been far more challenging and my success significantly slower to achieve. His influence sharpened my leadership, strengthened the practice, and accelerated meaningful, sustainable growth. I recommend Dr. Michael Njo without reservation to any clinician seeking a successful transition and sustained, high-level practice performance.`,
    author: "Diana Fat, DDS",
    stars: 5,
    publishedAt: "2026-01-09",
  },
  {
    quote: `I had the privilege of meeting Michael through my dental architect, who highly recommended him. At the time, I was already working with a startup and business coach, but I was dissatisfied with the level of service relative to the fees I was paying. Despite the premium cost, most of my interactions were with assistants rather than the coach directly. In contrast, Michael is consistently accessible by text, email, or phone and provides direct, hands-on guidance. He has a strong understanding of the business aspects of running a dental practice and has supported my startup office in multiple areas, including leadership development, staff management, and overall business coaching. I feel very fortunate to have worked with him and would confidently recommend his services to any dentist seeking to grow their practice in a thoughtful and effective way.`,
    author: "John Yun",
    stars: 5,
    publishedAt: "2026-01-10",
  },
  {
    quote: `When I first started working with Michael at Dental Strategies, I wasn't sure exactly how he could help my practice. I quickly learned that the key was actively reaching out and using him as a resource, and I'm so glad I did. Over the past several years, Michael has had a profound impact on both my professional and personal life. He's been instrumental in helping me improve my communication skills and coaching me through the complexities of managing staff effectively. What sets him apart is his ability to serve as an excellent liaison between me and my team. My staff knows they can turn to him with questions or concerns, which has created a valuable support system for everyone. The results speak for themselves: Michael has significantly strengthened my relationship with my office manager and helped us achieve consistent growth year after year. For the right practice, Michael is an exceptional resource, and I recommend him without reservation.`,
    author: "Matthew Asaro",
    stars: 5,
  },
  {
    quote: `Mike Njo was instrumental in helping me relocate from Chicago to California and guiding me through my practice acquisition. His book and webinars were also incredibly helpful, offering clear, practical insight throughout the process. Mike combines deep industry knowledge with genuine care and professionalism. I'm very grateful for his guidance and highly recommend him to any dentist considering a transition or practice purchase.`,
    author: "J C",
    stars: 5,
    publishedAt: "2025-12-11",
  },
  {
    quote: `We confidently recommend Dr. Michael Njo to our dental clients who are seeking thoughtful, results-driven coaching grounded in real-world ownership experience. Dr. Njo understands that a dental practice is both a clinical operation and a closely held business. His coaching helps dentists make smarter operational and strategic decisions that improve profitability, strengthen leadership, and build long-term practice value. What sets Dr. Njo apart ishis ability to meet clients where they are. From associates preparing for ownership to established practice owners planning for growth or transition, his guidance is clear, disciplined, and aligned with each doctor’s goals. For dentists who want to run stronger practices and create meaningful long-term value, Dr. Njo is a trusted and highly effective advisor.`,
    author: "The Phillips Group",
    stars: 5,
  },
];

export const testimonialPages: TestimonialPage[] = (() => {
  const seen = new Map<string, number>();
  const orderedTestimonials = testimonials
    .map((testimonial, index) => ({ ...testimonial, _index: index }))
    .sort(sortByNewest);

  return orderedTestimonials.map((entry) => {
    const testimonial = {
      quote: entry.quote,
      author: entry.author,
      stars: entry.stars,
      publishedAt: entry.publishedAt,
    };
    const base = slugify(testimonial.author || "testimonial");
    const nextCount = (seen.get(base) || 0) + 1;
    seen.set(base, nextCount);
    const slug = nextCount === 1 ? base : `${base}-${nextCount}`;

    return {
      ...testimonial,
      slug,
      excerpt: buildExcerpt(testimonial.quote),
    };
  });
})();
