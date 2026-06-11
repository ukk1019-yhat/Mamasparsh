import { motion } from "motion/react";
import {
  Apple, Wheat, Droplets, Leaf, UtensilsCrossed, Mic, Palette, Heart, Sparkles,
  BookOpen, Music, Trees, Clock, Hand, Sun, Users, GraduationCap, ChevronRight, Baby,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import logoSrc from "@/assets/logo.png";

interface Section {
  icon: typeof Apple;
  title: string;
  subtitle: string;
  body: string[];
  bullets?: string[];
}

const differenceSections: Section[] = [
  {
    icon: Apple,
    title: "The 3F Nutrition Model",
    subtitle: "Fruit · Fibre · Fluid — balanced nourishment every day.",
    body: [
      "Our unique 3F Nutrition Model ensures children receive balanced nourishment every day:",
    ],
    bullets: [
      "Fruit – Fresh seasonal fruits for natural vitamins and immunity.",
      "Fibre – Wholesome, nutritious meals that support healthy digestion and growth.",
      "Fluid – Regular hydration habits to keep children active, focused, and healthy.",
    ],
  },
  {
    icon: Leaf,
    title: "Traditional Banana Leaf Dining",
    subtitle: "Eco-friendly, cultural, and mindful eating practices.",
    body: [
      "Children enjoy meals served on banana leaves, introducing them to India's rich cultural traditions while promoting eco-friendly practices and mindful eating.",
      "This practice helps children appreciate food and nature, experience traditional values, develop healthy eating habits, and connect with cultural roots.",
    ],
  },
  {
    icon: UtensilsCrossed,
    title: "Independent Self-Eating Practice",
    subtitle: "Building confidence and fine motor skills through self-feeding.",
    body: [
      "Children are encouraged to sit comfortably in a cross-legged (Padmasana-inspired) posture and eat independently.",
    ],
    bullets: [
      "Building self-confidence and independence",
      "Developing fine motor skills",
      "Encouraging mindful eating",
      "Supporting healthy digestion",
      "Creating responsibility and self-care habits",
    ],
  },
  {
    icon: Mic,
    title: "Speak Out Corner",
    subtitle: "Every child deserves to be heard.",
    body: [
      "Our dedicated Speak Out Corner provides opportunities for children to express their thoughts and feelings, building confidence in speaking and improving communication skills.",
    ],
    bullets: [
      "Express their thoughts and feelings",
      "Build confidence in speaking",
      "Improve communication skills",
      "Enhance vocabulary and language development",
      "Develop leadership and presentation skills from an early age",
    ],
  },
  {
    icon: Sun,
    title: "Friday Life Skills Program",
    subtitle: "Every Friday is dedicated to essential life skills beyond the classroom.",
    body: [
      "At Mamasparsh, every Friday is dedicated to our Life Skills Program, where children learn essential skills that prepare them for life beyond the classroom.",
      "Through hands-on activities such as food preparation, gardening, caring for their environment, organizing belongings, independent eating, creative projects, and practical daily tasks, children develop confidence, responsibility, problem-solving abilities, independence, teamwork, and self-care habits.",
      "Rooted in our Waldorf-inspired philosophy, these meaningful experiences help children become capable, resilient, and responsible individuals while fostering a sense of purpose and joy in everyday life.",
      "Because at Mamasparsh, we believe education is not just about learning facts — it's about learning life.",
    ],
  },
  {
    icon: Palette,
    title: "Holistic Growth Beyond Academics",
    subtitle: "Learning happens through experience, not just textbooks.",
    body: [
      "At Mamasparsh, learning happens through storytelling, music & movement, art & craft, nature exploration, sensory play, practical life skills, cultural celebrations, and activity-based learning.",
    ],
  },
];

const waldorfSections: Section[] = [
  {
    icon: Sparkles,
    title: "Learning Through Play",
    subtitle: "Play is the foundation of early childhood learning.",
    body: [
      "Play is the foundation of early childhood learning. Children develop language, problem-solving skills, creativity, social awareness, and confidence through purposeful play experiences.",
    ],
  },
  {
    icon: BookOpen,
    title: "Storytelling & Language Development",
    subtitle: "Enriching vocabulary, imagination, and communication.",
    body: [
      "Daily storytelling, rhymes, songs, and conversations enrich vocabulary, listening skills, imagination, and communication abilities, laying a strong foundation for literacy.",
    ],
  },
  {
    icon: Palette,
    title: "Creative Arts Integration",
    subtitle: "Art woven into everyday learning.",
    body: [
      "Art is woven into everyday learning through drawing, painting, crafts, clay work, music, singing, movement, and dramatic play. These experiences foster creativity, self-expression, concentration, and fine motor development.",
    ],
  },
  {
    icon: Trees,
    title: "Nature-Based Learning",
    subtitle: "Connecting with the natural world.",
    body: [
      "Children connect with the natural world through gardening, seasonal activities, outdoor exploration, and nature observation. This cultivates curiosity, environmental awareness, and respect for living things.",
    ],
  },
  {
    icon: Clock,
    title: "Rhythm & Routine",
    subtitle: "Predictable rhythms bring security and confidence.",
    body: [
      "A predictable daily and weekly rhythm provides children with a sense of security, emotional stability, and confidence. Consistent routines help children develop self-regulation and independence.",
    ],
  },
  {
    icon: Hand,
    title: "Practical Life Experiences",
    subtitle: "Meaningful activities build responsibility and skills.",
    body: [
      "Children participate in meaningful activities such as food preparation, caring for their environment, gardening, organizing materials, and independent self-care routines. These experiences build responsibility, coordination, and life skills.",
    ],
  },
  {
    icon: Sun,
    title: "Movement & Physical Development",
    subtitle: "Movement is essential to learning.",
    body: [
      "Movement is an essential part of learning. Through outdoor play, circle time activities, action songs, balancing activities, and coordinated movements, children strengthen their gross motor skills and body awareness.",
    ],
  },
  {
    icon: Users,
    title: "Social & Emotional Growth",
    subtitle: "Kindness, empathy, and cooperation.",
    body: [
      "Our curriculum emphasizes kindness, empathy, cooperation, gratitude, and respectful relationships. Children learn to express themselves confidently while developing strong interpersonal skills.",
    ],
  },
  {
    icon: GraduationCap,
    title: "Child-Centered Academic Readiness",
    subtitle: "Joyful, meaningful, developmentally appropriate learning.",
    body: [
      "Foundational concepts in language, numeracy, and critical thinking are introduced through hands-on, experiential learning rather than rote memorization. This ensures that learning remains joyful, meaningful, and developmentally appropriate.",
    ],
  },
];

function FullCard({ section, index }: { section: Section; index: number }) {
  const Icon = section.icon;
  return (
    <Reveal delay={index * 0.04}>
      <div className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-glow md:p-8">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-bamboo text-primary-foreground shadow-soft">
            <Icon size={28} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-xl font-extrabold text-foreground md:text-2xl">{section.title}</h3>
            <p className="mt-1 font-body text-foreground/60">{section.subtitle}</p>
          </div>
        </div>
        <div className="mt-5 space-y-3 pl-0 md:pl-[4.5rem]">
          {section.body.map((p, i) => (
            <p key={i} className="font-body text-foreground/80 leading-relaxed">{p}</p>
          ))}
          {section.bullets && (
            <ul className="mt-4 space-y-2">
              {section.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 font-body text-foreground/70">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export function CurriculumPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed inset-x-0 top-0 z-50 bg-card/85 shadow-soft backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-8">
          <a href="/" className="flex items-center gap-2.5">
            <img src={logoSrc} alt="MamaSparsh logo" className="h-24 w-auto" />
          </a>
          <MagneticButton as="a" href="/" variant="primary" className="px-6 py-2.5 text-sm">
            <ChevronRight size={16} className="rotate-180" /> Back Home
          </MagneticButton>
        </div>
      </nav>

      <div className="pt-20">
        {/* Header */}
        <section className="relative overflow-hidden pb-8 pt-16 md:pt-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="mx-auto max-w-4xl px-5 text-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 font-display text-sm font-bold text-primary">
                <Sparkles size={16} /> The Mamasparsh Difference
              </span>
              <h1 className="mt-4 font-display text-5xl font-extrabold leading-tight text-foreground md:text-7xl">
                Where Childhood Blossoms
              </h1>
              <p className="mx-auto mt-4 max-w-3xl font-body text-lg text-foreground/70 leading-relaxed md:text-xl">
                At Mamasparsh, we believe childhood is not just about learning letters and numbers — it's about nurturing healthy habits, confidence, independence, and joyful experiences that last a lifetime.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Difference Sections */}
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-5xl px-5">
            <div className="grid gap-6">
              {differenceSections.map((s, i) => (
                <FullCard key={s.title} section={s} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Promise */}
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-3xl px-5">
            <Reveal>
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 p-10 text-center shadow-soft md:p-16">
                <Heart size={48} className="mx-auto text-primary" fill="currentColor" />
                <h2 className="mt-5 font-display text-4xl font-extrabold text-foreground md:text-5xl">Our Promise</h2>
                <p className="mx-auto mt-4 max-w-xl font-body text-lg font-medium text-foreground/80">
                  Healthy Bodies. Confident Voices. Independent Minds. Happy Hearts.
                </p>
                <p className="mx-auto mt-4 max-w-xl font-body text-foreground/60 leading-relaxed">
                  At MamaSparsh Preschool & Early Learning Centre, every child is nurtured with love, guided with purpose, and inspired to grow naturally.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Programs */}
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mb-14 text-center">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 font-display text-sm font-bold text-primary">
                  <Baby size={16} /> Our Programs
                </span>
                <h2 className="mt-4 font-display text-5xl font-extrabold leading-tight text-foreground md:text-7xl">
                  Early Years & Beyond
                </h2>
                <p className="mx-auto mt-4 max-w-4xl font-body text-lg text-foreground/70 leading-relaxed">
                  At an age where children are ever enthusiastic and inquisitive, early childhood education helps channelise their energy in the right direction and provides them a safe platform for self-expression. Research suggests a strong early childhood education moulds a child's academic success by introducing them to various academic facets such as basic numeracy and literacy along with preparing them for later school life.
                </p>
              </Reveal>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  icon: Baby, title: "Early Years 1", age: "2 Years +", schedule: "5 Days a week (Mon - Fri) · 9:30 AM to 12:30 PM IST",
                  body: [
                    "Through our early years 1 program we introduce children to fun activities such as art and crafts along with other specially curated enjoyable team-based activities that sow the first seeds of collaboration and team play in your little one.",
                    "With basic educational activity aimed at developing a love for learning and preparing for their later educational years we make sure your little one is having a great time growing up!",
                  ],
                },
                {
                  icon: Users, title: "Early Years 2", age: "3 Years +", schedule: "5 Days a week (Mon - Fri) · 9:15 AM to 12:45 PM IST",
                  body: ["Our early years 2 program focuses on introducing your little one to their first alphabets and numbers. With basic educational and play based activities aimed at developing respect, a basic understanding of the importance of mother nature along with the impact one can make from an early age we aspire to grow and nurture empathetic and kind individuals."],
                },
                {
                  icon: Sparkles, title: "Early Years 3", age: "4 Years +", schedule: "5 Days a week (Mon - Fri) · 9:00 AM to 3:00 PM IST",
                  body: [
                    "Through our Early Years 3 program, we provide a holistic foundation for your little one to develop into an intelligent and independent young individual at our preschool for 4-year-olds in Kakinada. We encourage children to ask questions and think critically. With team-based activities aimed at instilling a logical approach to solving problems, we help prepare children for their future school life.",
                  ],
                },
                {
                  icon: BookOpen, title: "Early Years 4", age: "5 Years +", schedule: "5 Days a week (Mon - Fri) · 9:00 AM to 3:00 PM IST",
                  body: [
                    "Through our Early Years 4 program, we help bridge your child's educational needs to help them enter into any mainstream curriculum from grade 1 onwards.",
                    "With a focus on experiential learning along with other co-curriculum activities that introduce the child to various facets of school life, we are one of the best preschools for 5-year-olds in Kakinada. Practising an interdisciplinary approach, we make learning engaging and allow your little one to discover their interests and develop an open-minded approach towards challenges.",
                  ],
                },
                {
                  icon: GraduationCap, title: "Grades (IGCSE)", age: "Grade 1 onwards", schedule: "Cambridge Primary + Reggio Emilia",
                  body: [
                    "At our school, from Grade 1 onwards, we offer a thoughtfully designed curriculum that blends the child-led, inquiry-driven philosophy of Reggio Emilia with the academic structure of the Cambridge Primary Curriculum (IGCSE). This approach not only nurtures curiosity and creativity but also provides a clear academic pathway leading up to the internationally recognized Cambridge IGCSE in the higher grades.",
                    "While Cambridge Primary ensures a solid grounding in core subjects like English, Mathematics, and Science, the Reggio-inspired environment encourages students to explore, question, and collaborate — making learning both meaningful and joyful.",
                  ],
                  bullets: [
                    "Develop strong academic skills alongside independent thinking",
                    "Engage in projects and real-world problem-solving",
                    "Foster academic strength alongside creativity",
                    "Cultivate skills like problem-solving, research, and teamwork",
                    "Build a seamless and natural progression from early years into Cambridge IGCSE",
                  ],
                },
              ].map((p, i) => {
                const Icon = p.icon;
                return (
                  <Reveal delay={i * 0.04} key={p.title}>
                    <div className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-glow md:p-8">
                      <div className="flex items-start gap-4">
                        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-bamboo text-primary-foreground shadow-soft">
                          <Icon size={28} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display text-xl font-extrabold text-foreground md:text-2xl">{p.title}</h3>
                          <p className="font-body font-bold text-accent">{p.age}</p>
                          <p className="font-body text-sm text-foreground/60">{p.schedule}</p>
                        </div>
                      </div>
                      <div className="mt-5 space-y-3 pl-0 md:pl-[4.5rem]">
                        {(p.body.length > 0 ? p.body : ["Details coming soon."]).map((line, j) => (
                          <p key={j} className="font-body text-foreground/80 leading-relaxed">{line}</p>
                        ))}
                        {"bullets" in p && p.bullets && (
                          <ul className="mt-4 space-y-2">
                            {p.bullets.map((b, j) => (
                              <li key={j} className="flex items-start gap-3 font-body text-foreground/70">
                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Waldorf */}
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-5xl px-5">
            <div className="mb-14 text-center">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 font-display text-sm font-bold text-primary">
                  <Trees size={16} /> Kakinada's First Waldorf-Inspired Curriculum
                </span>
                <h2 className="mt-4 font-display text-5xl font-extrabold leading-tight text-foreground md:text-7xl">
                  Head, Heart & Hands
                </h2>
                <p className="mx-auto mt-4 max-w-3xl font-body text-lg text-foreground/70 leading-relaxed">
                  At Mamasparsh, we proudly introduce Kakinada's First Waldorf-Inspired Curriculum, thoughtfully designed to nurture the intellectual, emotional, physical, and creative development of every child.
                </p>
                <p className="mx-auto mt-3 max-w-3xl font-body text-foreground/60 leading-relaxed">
                  Inspired by the principles of Waldorf education, our curriculum recognizes that young children learn best through meaningful experiences, imaginative play, movement, storytelling, artistic expression, and a deep connection with nature. We focus on developing the whole child — Head, Heart, and Hands — rather than emphasizing academics alone.
                </p>
              </Reveal>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {waldorfSections.map((s, i) => (
                <FullCard key={s.title} section={s} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <Reveal>
              <div className="rounded-3xl bg-muted/50 p-8 md:p-12">
                <p className="font-display text-xl font-bold italic text-foreground/50 md:text-2xl">
                  "Nurturing Head, Heart, and Hands through joyful learning, creative exploration, meaningful experiences, and a deep respect for childhood."
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <MagneticButton as="a" href="/" variant="primary">
                    Back to Home
                  </MagneticButton>
                  <MagneticButton as="a" href="/#contact" variant="ghost">
                    Contact Us
                  </MagneticButton>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}
