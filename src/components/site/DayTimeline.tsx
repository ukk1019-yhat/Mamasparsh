import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Sunrise, BookOpen, Bird, Palette, Moon, Clock } from "lucide-react";
import { Reveal } from "./Reveal";
import mascot from "@/assets/panda-mascot.png";
import type { LucideIcon } from "lucide-react";

const steps: { time: string; title: string; text: string; icon: LucideIcon }[] = [
  { time: "Morning", title: "Welcome Circle", text: "Hugs, songs and a warm hello to start the day.", icon: Sunrise },
  { time: "Mid Morning", title: "Learning & Discovery", text: "Stories, letters, numbers and big curious questions.", icon: BookOpen },
  { time: "Noon", title: "Outdoor Exploration", text: "Fresh air, gardens, butterflies and friendly play.", icon: Bird },
  { time: "Afternoon", title: "Creative Arts", text: "Paint, music, dance and joyful imagination.", icon: Palette },
  { time: "Evening", title: "Reflection & Story Time", text: "Cozy tales and a happy goodbye till tomorrow.", icon: Moon },
];

export function DayTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const mascotTop = useTransform(scrollYProgress, [0, 1], ["0%", "92%"]);

  return (
    <section id="day" className="relative scroll-mt-24 overflow-hidden bg-muted/60 py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-5">
        <div className="mb-16 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 font-display text-sm font-bold text-primary shadow-soft">
              <Clock size={16} /> A Day at MamaSparsh
            </span>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              Follow Our Panda Through the Day
            </h2>
          </Reveal>
        </div>

        <div ref={ref} className="relative pl-16 md:pl-24">
          {/* track */}
          <div className="absolute left-7 top-0 h-full w-1.5 rounded-full bg-border md:left-10" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-7 top-0 w-1.5 rounded-full bg-gradient-bamboo md:left-10"
          />
          {/* walking mascot */}
          <motion.img
            style={{ top: mascotTop }}
            src={mascot}
            alt="MamaSparsh panda walking through the day"
            width={1024}
            height={1536}
            loading="lazy"
            className="absolute left-0 z-10 w-16 -translate-y-1/2 animate-float-tiny drop-shadow-xl md:w-20"
          />

          <div className="space-y-12">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={i * 0.05}>
                  <div className="relative rounded-3xl border border-border bg-card p-6 shadow-soft">
                    <span className="absolute -left-[3.05rem] top-6 grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-foreground shadow-soft md:-left-[3.9rem]">
                      <Icon size={18} />
                    </span>
                    <span className="font-display text-sm font-bold uppercase tracking-wider text-primary">
                      {s.time}
                    </span>
                    <h3 className="mt-1 font-display text-2xl font-extrabold text-foreground">{s.title}</h3>
                    <p className="mt-1 font-body text-foreground/70">{s.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
