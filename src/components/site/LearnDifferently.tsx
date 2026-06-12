import { motion } from "motion/react";
import { BookOpen, Pencil, Palette, Music, FlaskConical, PawPrint, ArrowRight } from "lucide-react";
import { Reveal, GradientText } from "./Reveal";
import reads from "@/assets/panda-reads.png";
import writes from "@/assets/panda-writes.png";
import paints from "@/assets/panda-paints.png";
import dances from "@/assets/panda-dances.png";
import explores from "@/assets/panda-explores.png";
import type { LucideIcon } from "lucide-react";

interface Panda { img: string; icon: LucideIcon; title: string; text: string; tint: string; program: string; programHref: string; age: string; }

const pandas: Panda[] = [
  { img: paints, icon: Palette, title: "Panda Paints", text: "Expressing big imagination through colour and art.", tint: "from-secondary/50", program: "Early Years 1", programHref: "/programs#program-0", age: "2+" },
  { img: dances, icon: Music, title: "Panda Dances", text: "Building confidence and joy through movement.", tint: "from-primary/30", program: "Early Years 2", programHref: "/programs#program-1", age: "3+" },
  { img: writes, icon: Pencil, title: "Panda Writes", text: "Developing communication and creativity through playful words.", tint: "from-accent/40", program: "Early Years 3", programHref: "/programs#program-2", age: "4+" },
  { img: reads, icon: BookOpen, title: "Panda Reads", text: "Building literacy and imagination, one storybook at a time.", tint: "from-sky/40", program: "Early Years 4", programHref: "/programs#program-3", age: "5+" },
  { img: explores, icon: FlaskConical, title: "Panda Explores", text: "Learning STEM through hands-on discovery and wonder.", tint: "from-sky/40", program: "Curriculum", programHref: "/curriculum", age: "6+" },
];

export function LearnDifferently() {
  return (
    <section id="learn" className="relative scroll-mt-24 overflow-hidden bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-16 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 font-display text-sm font-bold text-primary">
              <PawPrint size={16} /> Our Little Pandas
            </span>
          </Reveal>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
            <GradientText text="Our Little Pandas Learn Differently" />
          </h2>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-foreground/70">
              Every child blossoms in their own way. Meet the pandas who guide each adventure.
            </p>
          </Reveal>
        </div>

        <div className="space-y-20 md:space-y-28">
          {pandas.map((p, i) => {
            const Icon = p.icon;
            const flip = i % 2 === 1;
            return (
              <a
                key={p.title}
                href={p.programHref}
                className={`flex flex-col items-center gap-8 md:gap-14 group ${flip ? "md:flex-row-reverse" : "md:flex-row"}`}
              >
                <Reveal y={60} className="flex-1 w-full">
                  <div className={`relative grid place-items-center rounded-[2.5rem] bg-gradient-to-b ${p.tint} to-transparent p-6 transition-shadow duration-500 group-hover:shadow-glow`}>
                    <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-foreground/10 backdrop-blur-md px-3 py-1 font-display text-xs font-bold text-foreground/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Ages {p.age}
                    </span>
                    <motion.img
                      whileHover={{ scale: 1.06, rotate: flip ? -3 : 3 }}
                      transition={{ type: "spring", stiffness: 200, damping: 14 }}
                      src={p.img}
                      alt={p.title}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      className="w-[min(70vw,360px)] animate-float-soft drop-shadow-2xl"
                    />
                  </div>
                </Reveal>
                <Reveal delay={0.15} className="flex-1 text-center md:text-left">
                  <Icon size={48} strokeWidth={1.5} className="inline-block text-primary" />
                  <h3 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">
                    {p.title}
                  </h3>
                  <p className="mt-3 max-w-md font-body text-lg text-foreground/70 md:mx-0 mx-auto">
                    {p.text}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 font-display text-sm font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    {p.program} <ArrowRight size={14} />
                  </span>
                </Reveal>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
