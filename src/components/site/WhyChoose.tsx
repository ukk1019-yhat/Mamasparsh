import { useRef } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Heart, Baby, Palette, Sprout, Users, Blocks, Handshake, Sparkles } from "lucide-react";
import { Reveal, GradientText } from "./Reveal";

const features = [
  { icon: ShieldCheck, title: "Safe & Secure Campus", text: "CCTV, gated access and caring supervision at every step." },
  { icon: Heart, title: "Loving Teachers", text: "Warm, trained mentors who nurture like a mother would." },
  { icon: Baby, title: "Child-Centric Learning", text: "Lessons shaped around each little one's pace and spark." },
  { icon: Palette, title: "Creative Exploration", text: "Art, music and play that set imagination free." },
  { icon: Sprout, title: "Holistic Development", text: "Head, heart and hands grow together, every day." },
  { icon: Users, title: "Small Class Sizes", text: "More attention, more smiles, more meaningful moments." },
  { icon: Blocks, title: "Activity-Based Education", text: "Learning by doing — the way children love to learn." },
  { icon: Handshake, title: "Parent Partnership", text: "We walk this journey hand in hand with families." },
];

function TiltCard({ feature, i }: { feature: (typeof features)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = feature.icon;

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${px * 12}deg) rotateX(${-py * 12}deg) translateY(-6px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0) rotateX(0)";
  };

  return (
    <Reveal delay={(i % 4) * 0.08} effect={i % 3 === 0 ? "scale" : i % 3 === 1 ? "flip" : "clip"}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        className="group relative h-full rounded-3xl border border-border bg-card p-6 shadow-soft transition-[transform,box-shadow] duration-300 will-change-transform hover:shadow-glow"
      >
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-accent/0 to-primary/0 opacity-0 blur-xl transition-opacity duration-300 group-hover:from-accent/30 group-hover:to-primary/20 group-hover:opacity-100" />
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-bamboo text-primary-foreground shadow-soft">
          <Icon size={26} />
        </span>
        <h3 className="mt-4 font-display text-xl font-extrabold text-foreground">{feature.title}</h3>
        <p className="mt-2 font-body text-foreground/70">{feature.text}</p>
      </div>
    </Reveal>
  );
}

export function WhyChoose() {
  return (
    <section id="why" className="relative scroll-mt-24 overflow-hidden bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-14 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 font-display text-sm font-bold text-primary">
              <Heart size={16} /> Why Parents Choose Us
            </span>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              <GradientText text="A Place Built on Trust & Warmth" />
            </h2>
          </Reveal>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <TiltCard key={f.title} feature={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
