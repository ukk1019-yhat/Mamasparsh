import {
  Baby, Users, Sparkles, BookOpen, ChevronRight,
  ArrowLeft, ArrowRight, Image as ImageIcon,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import logoSrc from "@/assets/logo.png";

interface Program {
  icon: typeof Baby;
  title: string;
  age: string;
  schedule: string;
  body: string[];
  bullets?: string[];
  images?: string[];
}

const programs: Program[] = [
  {
    icon: Baby,
    title: "Early Years 1",
    age: "2 Years +",
    schedule: "5 Days a week (Mon - Fri) · 9:30 AM to 12:30 PM IST",
    body: [
      "Through our early years 1 program we introduce children to fun activities such as art and crafts along with other specially curated enjoyable team-based activities that sow the first seeds of collaboration and team play in your little one.",
      "With basic educational activity aimed at developing a love for learning and preparing for their later educational years we make sure your little one is having a great time growing up!",
    ],
  },
  {
    icon: Users,
    title: "Early Years 2",
    age: "3 Years +",
    schedule: "5 Days a week (Mon - Fri) · 9:15 AM to 12:45 PM IST",
    body: [
      "Our early years 2 program focuses on introducing your little one to their first alphabets and numbers. With basic educational and play based activities aimed at developing respect, a basic understanding of the importance of mother nature along with the impact one can make from an early age we aspire to grow and nurture empathetic and kind individuals.",
    ],
  },
  {
    icon: Sparkles,
    title: "Early Years 3",
    age: "4 Years +",
    schedule: "5 Days a week (Mon - Fri) · 9:00 AM to 3:00 PM IST",
    body: [
      "Through our Early Years 3 program, we provide a holistic foundation for your little one to develop into an intelligent and independent young individual at our preschool for 4-year-olds in Kakinada. We encourage children to ask questions and think critically. With team-based activities aimed at instilling a logical approach to solving problems, we help prepare children for their future school life.",
    ],
  },
  {
    icon: BookOpen,
    title: "Early Years 4",
    age: "5 Years +",
    schedule: "5 Days a week (Mon - Fri) · 9:00 AM to 3:00 PM IST",
    body: [
      "Through our Early Years 4 program, we help bridge your child's educational needs to help them enter into any mainstream curriculum from grade 1 onwards.",
      "With a focus on experiential learning along with other co-curriculum activities that introduce the child to various facets of school life, we are one of the best preschools for 5-year-olds in Kakinada. Practising an interdisciplinary approach, we make learning engaging and allow your little one to discover their interests and develop an open-minded approach towards challenges.",
    ],
  },
];

function ProgramCard({ program, index }: { program: Program; index: number }) {
  const Icon = program.icon;
  return (
    <Reveal delay={index * 0.04}>
      <div className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-glow md:p-8">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-bamboo text-primary-foreground shadow-soft">
            <Icon size={28} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-xl font-extrabold text-foreground md:text-2xl">{program.title}</h3>
            <p className="font-body font-bold text-accent">{program.age}</p>
            <p className="font-body text-sm text-foreground/60">{program.schedule}</p>
          </div>
        </div>
        <div className="mt-5 space-y-3 pl-0 md:pl-[4.5rem]">
          {(program.body.length > 0 ? program.body : ["Details coming soon."]).map((line, j) => (
            <p key={j} className="font-body text-foreground/80 leading-relaxed">{line}</p>
          ))}
          {program.bullets && (
            <ul className="mt-4 space-y-2">
              {program.bullets.map((b, j) => (
                <li key={j} className="flex items-start gap-3 font-body text-foreground/70">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Gallery */}
        {program.images && program.images.length > 0 && (
          <div className="mt-6 pl-0 md:pl-[4.5rem]">
            <h4 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-foreground/60">
              <ImageIcon size={14} /> Gallery
            </h4>
            <div className="flex flex-wrap gap-3">
              {program.images.map((img) => (
                <div
                  key={img}
                  className="flex h-24 w-28 items-center justify-center rounded-xl bg-muted font-display text-xs font-bold text-foreground/30"
                >
                  {img}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Nav */}
        <div className="mt-6 flex items-center justify-between pl-0 md:pl-[4.5rem]">
          <div>
            {index > 0 && (
              <a
                href={`#program-${index - 1}`}
                className="flex items-center gap-1.5 font-display text-sm font-bold text-primary transition-colors hover:text-primary/80"
              >
                <ArrowLeft size={14} /> {programs[index - 1].title}
              </a>
            )}
          </div>
          <div className="text-right">
            {index < programs.length - 1 && (
              <a
                href={`#program-${index + 1}`}
                className="flex items-center gap-1.5 font-display text-sm font-bold text-primary transition-colors hover:text-primary/80"
              >
                {programs[index + 1].title} <ArrowRight size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function ProgramsPage() {
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
                <Baby size={16} /> Our Programs
              </span>
              <h1 className="mt-4 font-display text-5xl font-extrabold leading-tight text-foreground md:text-7xl">
                Early Years & Beyond
              </h1>
              <p className="mx-auto mt-4 max-w-3xl font-body text-lg text-foreground/70 leading-relaxed md:text-xl">
                At an age where children are ever enthusiastic and inquisitive, early childhood education helps channelise their energy in the right direction and provides them a safe platform for self-expression. Research suggests a strong early childhood education moulds a child's academic success by introducing them to various academic facets such as basic numeracy and literacy along with preparing them for later school life.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Programs */}
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-5xl px-5">
            <div className="grid gap-8">
              {programs.map((p, i) => (
                <div key={p.title} id={`program-${i}`}>
                  <ProgramCard program={p} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <Reveal>
              <div className="rounded-3xl bg-muted/50 p-8 md:p-12">
                <h2 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">
                  Ready to Begin the Journey?
                </h2>
                <p className="mx-auto mt-3 max-w-xl font-body text-foreground/70 leading-relaxed">
                  Schedule a campus visit and see firsthand how Mamasparsh nurtures young minds.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
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
