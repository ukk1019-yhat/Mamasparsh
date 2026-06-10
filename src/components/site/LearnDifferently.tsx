import { motion } from "motion/react";
<<<<<<< HEAD
import { BookOpen, Pencil, Palette, Music, Music2, FlaskConical, Goal, Sprout, PawPrint } from "lucide-react";
=======
>>>>>>> b8161265997a66ba5d9c6e31636ac1d09c89deae
import { Reveal, TextReveal } from "./Reveal";
import reads from "@/assets/panda-reads.png";
import writes from "@/assets/panda-writes.png";
import paints from "@/assets/panda-paints.png";
import dances from "@/assets/panda-dances.png";
import sings from "@/assets/panda-sings.png";
import explores from "@/assets/panda-explores.png";
import plays from "@/assets/panda-plays.png";
import grows from "@/assets/panda-grows.png";
<<<<<<< HEAD
import type { LucideIcon } from "lucide-react";

const pandas: { img: string; icon: LucideIcon; title: string; text: string; tint: string }[] = [
  { img: reads, icon: BookOpen, title: "Panda Reads", text: "Building literacy and imagination, one storybook at a time.", tint: "from-sky/40" },
  { img: writes, icon: Pencil, title: "Panda Writes", text: "Developing communication and creativity through playful words.", tint: "from-accent/40" },
  { img: paints, icon: Palette, title: "Panda Paints", text: "Expressing big imagination through colour and art.", tint: "from-secondary/50" },
  { img: dances, icon: Music, title: "Panda Dances", text: "Building confidence and joy through movement.", tint: "from-primary/30" },
  { img: sings, icon: Music2, title: "Panda Sings", text: "Exploring rhythm, melody and the music of language.", tint: "from-accent/40" },
  { img: explores, icon: FlaskConical, title: "Panda Explores", text: "Learning STEM through hands-on discovery and wonder.", tint: "from-sky/40" },
  { img: plays, icon: Goal, title: "Panda Plays", text: "Growing through teamwork, fair play and outdoor fun.", tint: "from-primary/30" },
  { img: grows, icon: Sprout, title: "Panda Grows", text: "Learning responsibility and a love for nature's care.", tint: "from-secondary/50" },
=======

const pandas = [
  { img: reads, emoji: "📚", title: "Panda Reads", text: "Building literacy and imagination, one storybook at a time.", tint: "from-sky/40" },
  { img: writes, emoji: "✏️", title: "Panda Writes", text: "Developing communication and creativity through playful words.", tint: "from-accent/40" },
  { img: paints, emoji: "🎨", title: "Panda Paints", text: "Expressing big imagination through colour and art.", tint: "from-secondary/50" },
  { img: dances, emoji: "💃", title: "Panda Dances", text: "Building confidence and joy through movement.", tint: "from-primary/30" },
  { img: sings, emoji: "🎵", title: "Panda Sings", text: "Exploring rhythm, melody and the music of language.", tint: "from-accent/40" },
  { img: explores, emoji: "🔬", title: "Panda Explores", text: "Learning STEM through hands-on discovery and wonder.", tint: "from-sky/40" },
  { img: plays, emoji: "⚽", title: "Panda Plays", text: "Growing through teamwork, fair play and outdoor fun.", tint: "from-primary/30" },
  { img: grows, emoji: "🌱", title: "Panda Grows", text: "Learning responsibility and a love for nature's care.", tint: "from-secondary/50" },
>>>>>>> b8161265997a66ba5d9c6e31636ac1d09c89deae
];

export function LearnDifferently() {
  return (
    <section id="learn" className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-16 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 font-display text-sm font-bold text-primary">
<<<<<<< HEAD
              <PawPrint size={16} /> Our Little Pandas
=======
              🐼 Our Little Pandas
>>>>>>> b8161265997a66ba5d9c6e31636ac1d09c89deae
            </span>
          </Reveal>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
            <TextReveal text="Our Little Pandas Learn Differently" />
          </h2>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-foreground/70">
              Every child blossoms in their own way. Meet the pandas who guide each adventure.
            </p>
          </Reveal>
        </div>

        <div className="space-y-20 md:space-y-28">
          {pandas.map((p, i) => {
<<<<<<< HEAD
            const Icon = p.icon;
=======
>>>>>>> b8161265997a66ba5d9c6e31636ac1d09c89deae
            const flip = i % 2 === 1;
            return (
              <div
                key={p.title}
                className={`flex flex-col items-center gap-8 md:gap-14 ${flip ? "md:flex-row-reverse" : "md:flex-row"}`}
              >
                <Reveal y={60} className="flex-1">
                  <div className={`relative grid place-items-center rounded-[2.5rem] bg-gradient-to-b ${p.tint} to-transparent p-6`}>
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
<<<<<<< HEAD
                  <Icon size={48} strokeWidth={1.5} className="inline-block text-primary" />
=======
                  <span className="text-5xl">{p.emoji}</span>
>>>>>>> b8161265997a66ba5d9c6e31636ac1d09c89deae
                  <h3 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">
                    {p.title}
                  </h3>
                  <p className="mt-3 max-w-md font-body text-lg text-foreground/70 md:mx-0 mx-auto">
                    {p.text}
                  </p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
