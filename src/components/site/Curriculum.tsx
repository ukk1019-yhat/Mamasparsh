import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Apple,
  Wheat,
  Droplets,
  Leaf,
  UtensilsCrossed,
  Mic,
  Palette,
  Heart,
  Sparkles,
  BookOpen,
  Music,
  Trees,
  Clock,
  Hand,
  Sun,
  Users,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { Reveal } from "./Reveal";

interface Section {
  id: string;
  icon: typeof Apple;
  title: string;
  summary: string;
  content: string[];
  benefits?: string[];
}

const differenceSections: Section[] = [
  {
    id: "nutrition",
    icon: Apple,
    title: "The 3F Nutrition Model",
    summary: "Fruit · Fibre · Fluid — balanced nourishment every day.",
    content: [
      "Fruit – Fresh seasonal fruits for natural vitamins and immunity.",
      "Fibre – Wholesome, nutritious meals that support healthy digestion and growth.",
      "Fluid – Regular hydration habits to keep children active, focused, and healthy.",
    ],
  },
  {
    id: "banana-leaf",
    icon: Leaf,
    title: "Traditional Banana Leaf Dining",
    summary: "Eco-friendly, cultural, and mindful eating practices.",
    content: [
      "Children enjoy meals served on banana leaves, introducing them to India's rich cultural traditions while promoting eco-friendly practices and mindful eating.",
    ],
    benefits: [
      "Appreciate food and nature",
      "Experience traditional values",
      "Develop healthy eating habits",
      "Connect with cultural roots",
    ],
  },
  {
    id: "self-eating",
    icon: UtensilsCrossed,
    title: "Independent Self-Eating Practice",
    summary: "Building confidence and fine motor skills through self-feeding.",
    content: [
      "Children are encouraged to sit comfortably in a cross-legged posture and eat independently.",
    ],
    benefits: [
      "Building self-confidence and independence",
      "Developing fine motor skills",
      "Encouraging mindful eating",
      "Supporting healthy digestion",
      "Creating responsibility and self-care habits",
    ],
  },
  {
    id: "speak-out",
    icon: Mic,
    title: "Speak Out Corner",
    summary: "Every child deserves to be heard.",
    content: [
      "Our dedicated Speak Out Corner provides opportunities for children to express their thoughts and feelings, building confidence in speaking and improving communication skills.",
    ],
    benefits: [
      "Express their thoughts and feelings",
      "Build confidence in speaking",
      "Improve communication skills",
      "Enhance vocabulary and language development",
      "Develop leadership and presentation skills from an early age",
    ],
  },
  {
    id: "friday-life-skills",
    icon: Sun,
    title: "Friday Life Skills Program",
    summary: "Every Friday is dedicated to essential life skills beyond the classroom.",
    content: [
      "Through hands-on activities such as food preparation, gardening, caring for their environment, organizing belongings, independent eating, creative projects, and practical daily tasks, children develop confidence, responsibility, problem-solving abilities, independence, teamwork, and self-care habits.",
      "Rooted in our Waldorf-inspired philosophy, these meaningful experiences help children become capable, resilient, and responsible individuals while fostering a sense of purpose and joy in everyday life.",
      "Because at Mamasparsh, we believe education is not just about learning facts — it's about learning life.",
    ],
  },
  {
    id: "holistic",
    icon: Palette,
    title: "Holistic Growth Beyond Academics",
    summary: "Learning happens through experience, not just textbooks.",
    content: [
      "At Mamasparsh, learning happens through storytelling, music & movement, art & craft, nature exploration, sensory play, practical life skills, cultural celebrations, and activity-based learning.",
    ],
  },
];

const waldorfSections: Section[] = [
  {
    id: "play",
    icon: Sparkles,
    title: "Learning Through Play",
    summary: "Play is the foundation of early childhood learning.",
    content: [
      "Children develop language, problem-solving skills, creativity, social awareness, and confidence through purposeful play experiences.",
    ],
  },
  {
    id: "storytelling",
    icon: BookOpen,
    title: "Storytelling & Language",
    summary: "Enriching vocabulary, imagination, and communication.",
    content: [
      "Daily storytelling, rhymes, songs, and conversations enrich vocabulary, listening skills, imagination, and communication abilities, laying a strong foundation for literacy.",
    ],
  },
  {
    id: "creative-arts",
    icon: Palette,
    title: "Creative Arts Integration",
    summary: "Art woven into everyday learning.",
    content: [
      "Drawing, painting, crafts, clay work, music, singing, movement, and dramatic play foster creativity, self-expression, concentration, and fine motor development.",
    ],
  },
  {
    id: "nature",
    icon: Trees,
    title: "Nature-Based Learning",
    summary: "Connecting with the natural world.",
    content: [
      "Gardening, seasonal activities, outdoor exploration, and nature observation cultivate curiosity, environmental awareness, and respect for living things.",
    ],
  },
  {
    id: "rhythm",
    icon: Clock,
    title: "Rhythm & Routine",
    summary: "Predictable rhythms bring security and confidence.",
    content: [
      "A predictable daily and weekly rhythm provides children with a sense of security, emotional stability, and confidence. Consistent routines help children develop self-regulation and independence.",
    ],
  },
  {
    id: "practical",
    icon: Hand,
    title: "Practical Life Experiences",
    summary: "Meaningful activities build responsibility and skills.",
    content: [
      "Food preparation, caring for their environment, gardening, organizing materials, and independent self-care routines build responsibility, coordination, and life skills.",
    ],
  },
  {
    id: "movement",
    icon: Sun,
    title: "Movement & Physical Development",
    summary: "Movement is essential to learning.",
    content: [
      "Outdoor play, circle time activities, action songs, balancing activities, and coordinated movements strengthen gross motor skills and body awareness.",
    ],
  },
  {
    id: "social",
    icon: Users,
    title: "Social & Emotional Growth",
    summary: "Kindness, empathy, and cooperation.",
    content: [
      "Our curriculum emphasizes kindness, empathy, cooperation, gratitude, and respectful relationships. Children learn to express themselves confidently while developing strong interpersonal skills.",
    ],
  },
  {
    id: "academic",
    icon: GraduationCap,
    title: "Child-Centered Academic Readiness",
    summary: "Joyful, meaningful, developmentally appropriate learning.",
    content: [
      "Foundational concepts in language, numeracy, and critical thinking are introduced through hands-on, experiential learning rather than rote memorization.",
    ],
  },
];

function AccordionCard({ section, index }: { section: Section; index: number }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const Icon = section.icon;

  return (
    <Reveal delay={index * 0.05}>
      <div
        className={`group cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 ${
          open
            ? "border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 shadow-glow"
            : "border-border bg-card shadow-soft hover:shadow-glow"
        }`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-start gap-4 p-5">
          <span className={`mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-all duration-500 ${
            open ? "bg-gradient-bamboo text-primary-foreground shadow-md" : "bg-muted text-primary"
          }`}>
            <Icon size={24} />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-extrabold text-foreground">{section.title}</h3>
            <p className="mt-0.5 font-body text-sm text-foreground/60">{section.summary}</p>
          </div>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 shrink-0 text-foreground/40"
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              ref={contentRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-3 px-5 pb-6 pt-1">
                {section.content.map((line, i) => (
                  <p key={i} className="font-body text-foreground/80 leading-relaxed">{line}</p>
                ))}
                {section.benefits && (
                  <ul className="mt-3 space-y-1.5">
                    {section.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 font-body text-sm text-foreground/70">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                <a
                  href="/curriculum"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-bold text-primary transition-colors hover:text-primary/80"
                >
                  Show more <ChevronDown size={14} className="-rotate-90" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

export function Curriculum() {
  return (
    <section id="curriculum" className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="mx-auto max-w-6xl px-5">
        {/* Header */}
        <div className="mb-16 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 font-display text-sm font-bold text-primary">
              <Sparkles size={16} /> The Mamasparsh Difference
            </span>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              Where Childhood Blossoms
            </h2>
            <p className="mx-auto mt-4 max-w-3xl font-body text-lg text-foreground/70 leading-relaxed md:text-xl">
              At Mamasparsh, we believe childhood is not just about learning letters and numbers — it's about nurturing healthy habits, confidence, independence, and joyful experiences that last a lifetime.
            </p>
          </Reveal>
        </div>

        {/* Difference Sections */}
        <div className="mb-20 grid gap-4 md:grid-cols-2">
          {differenceSections.map((section, i) => (
            <AccordionCard key={section.id} section={section} index={i} />
          ))}
        </div>

        {/* Promise Banner */}
        <Reveal>
          <div className="mb-20 overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 p-8 text-center shadow-soft md:p-12">
            <motion.div
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Heart size={40} className="mx-auto text-primary" fill="currentColor" />
              <h3 className="mt-4 font-display text-3xl font-extrabold text-foreground md:text-4xl">Our Promise</h3>
              <p className="mx-auto mt-3 max-w-2xl font-body text-lg font-medium text-foreground/80">
                Healthy Bodies. Confident Voices. Independent Minds. Happy Hearts.
              </p>
              <p className="mx-auto mt-3 max-w-2xl font-body text-foreground/60 leading-relaxed">
                At MamaSparsh Preschool & Early Learning Centre, every child is nurtured with love, guided with purpose, and inspired to grow naturally.
              </p>
            </motion.div>
          </div>
        </Reveal>

        {/* Waldorf Curriculum */}
        <div className="mb-12 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 font-display text-sm font-bold text-primary">
              <Trees size={16} /> Kakinada's First Waldorf-Inspired Curriculum
            </span>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              Head, Heart & Hands
            </h2>
            <p className="mx-auto mt-4 max-w-3xl font-body text-lg text-foreground/70 leading-relaxed">
              Proudly introducing Kakinada's First Waldorf-Inspired Curriculum, thoughtfully designed to nurture the intellectual, emotional, physical, and creative development of every child through meaningful experiences, imaginative play, movement, storytelling, artistic expression, and a deep connection with nature.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {waldorfSections.map((section, i) => (
            <AccordionCard key={section.id} section={section} index={i} />
          ))}
        </div>

        {/* Footer quote */}
        <Reveal delay={0.3}>
          <div className="mt-16 text-center">
            <p className="font-display text-lg font-bold italic text-foreground/50">
              "Nurturing Head, Heart, and Hands through joyful learning, creative exploration, meaningful experiences, and a deep respect for childhood."
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
