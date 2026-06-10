import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
<<<<<<< HEAD
import { Calendar, GraduationCap, Home, PartyPopper, PawPrint, Sprout } from "lucide-react";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import mascot from "@/assets/panda-mascot.png";
import type { LucideIcon } from "lucide-react";

const steps: { n: number; title: string; text: string; icon: LucideIcon }[] = [
  { n: 1, title: "Book a Visit", text: "Schedule a friendly campus visit.", icon: Calendar },
  { n: 2, title: "Meet Our Teachers", text: "Say hello to the loving mentors.", icon: GraduationCap },
  { n: 3, title: "Explore the Campus", text: "Wander our safe panda world.", icon: Home },
  { n: 4, title: "Trial Experience", text: "A joyful day of play & learning.", icon: PartyPopper },
  { n: 5, title: "Join the Family", text: "Welcome to MamaSparsh!", icon: PawPrint },
=======
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import mascot from "@/assets/panda-mascot.png";

const steps = [
  { n: 1, title: "Book a Visit", text: "Schedule a friendly campus visit.", emoji: "📅" },
  { n: 2, title: "Meet Our Teachers", text: "Say hello to the loving mentors.", emoji: "👩‍🏫" },
  { n: 3, title: "Explore the Campus", text: "Wander our safe panda world.", emoji: "🏡" },
  { n: 4, title: "Trial Experience", text: "A joyful day of play & learning.", emoji: "🎈" },
  { n: 5, title: "Join the Family", text: "Welcome to MamaSparsh!", emoji: "🐼" },
>>>>>>> b8161265997a66ba5d9c6e31636ac1d09c89deae
];

export function Admissions() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const pathWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const mascotLeft = useTransform(scrollYProgress, [0, 1], ["0%", "94%"]);

  return (
    <section id="admissions" className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-16 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 font-display text-sm font-bold text-primary">
<<<<<<< HEAD
              <PawPrint size={16} /> Admissions Journey
=======
              🐾 Admissions Journey
>>>>>>> b8161265997a66ba5d9c6e31636ac1d09c89deae
            </span>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              Five Little Steps to Join Us
            </h2>
          </Reveal>
        </div>

        {/* desktop path */}
        <div ref={ref} className="relative hidden md:block">
          <div className="absolute left-0 right-0 top-10 h-2 rounded-full bg-border" />
          <motion.div style={{ width: pathWidth }} className="absolute left-0 top-10 h-2 rounded-full bg-gradient-bamboo" />
          <motion.img
            style={{ left: mascotLeft }}
            src={mascot}
            alt="Panda walking the admissions path"
            width={1024}
            height={1536}
            loading="lazy"
            className="absolute top-0 z-10 w-14 -translate-x-1/2 -translate-y-6 animate-float-tiny drop-shadow-xl"
          />
          <div className="grid grid-cols-5 gap-4 pt-24">
<<<<<<< HEAD
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.n} delay={i * 0.08}>
                  <div className="rounded-3xl border border-border bg-card p-5 text-center shadow-soft">
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground"><Icon size={22} /></span>
                    <p className="mt-3 font-display text-sm font-bold text-primary">STEP {s.n}</p>
                    <h3 className="font-display text-lg font-extrabold text-foreground">{s.title}</h3>
                    <p className="mt-1 font-body text-sm text-foreground/70">{s.text}</p>
                  </div>
                </Reveal>
              );
            })}
=======
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="rounded-3xl border border-border bg-card p-5 text-center shadow-soft">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent text-2xl">{s.emoji}</span>
                  <p className="mt-3 font-display text-sm font-bold text-primary">STEP {s.n}</p>
                  <h3 className="font-display text-lg font-extrabold text-foreground">{s.title}</h3>
                  <p className="mt-1 font-body text-sm text-foreground/70">{s.text}</p>
                </div>
              </Reveal>
            ))}
>>>>>>> b8161265997a66ba5d9c6e31636ac1d09c89deae
          </div>
        </div>

        {/* mobile stack */}
        <div className="space-y-4 md:hidden">
<<<<<<< HEAD
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.n}>
                <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft">
                  <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-accent text-accent-foreground"><Icon size={22} /></span>
                  <div>
                    <p className="font-display text-xs font-bold text-primary">STEP {s.n}</p>
                    <h3 className="font-display text-lg font-extrabold text-foreground">{s.title}</h3>
                    <p className="font-body text-sm text-foreground/70">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
=======
          {steps.map((s) => (
            <Reveal key={s.n}>
              <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft">
                <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-accent text-2xl">{s.emoji}</span>
                <div>
                  <p className="font-display text-xs font-bold text-primary">STEP {s.n}</p>
                  <h3 className="font-display text-lg font-extrabold text-foreground">{s.title}</h3>
                  <p className="font-body text-sm text-foreground/70">{s.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
>>>>>>> b8161265997a66ba5d9c6e31636ac1d09c89deae
        </div>

        <div className="mt-12 text-center">
          <MagneticButton as="a" href="#contact" variant="primary">
<<<<<<< HEAD
            <Sprout size={18} /> Start Your Journey
=======
            Start Your Journey 🌱
>>>>>>> b8161265997a66ba5d9c6e31636ac1d09c89deae
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
