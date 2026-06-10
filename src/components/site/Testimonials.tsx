import { Reveal } from "./Reveal";

const testimonials = [
  { name: "Ananya Sharma", child: "Nursery", text: "MamaSparsh feels like a second home. My daughter runs in smiling every morning!", emoji: "👩🏻" },
  { name: "Rahul Verma", child: "Playgroup", text: "The teachers truly love the children. We've seen our son blossom with confidence.", emoji: "👨🏽" },
  { name: "Priya Nair", child: "LKG", text: "The panda world makes learning magical. So creative, safe and warm.", emoji: "👩🏽" },
  { name: "Karan Mehta", child: "Nursery", text: "Small classes and big hearts. We couldn't have asked for a better start.", emoji: "🧔🏻" },
  { name: "Sneha Iyer", child: "UKG", text: "Every celebration, every activity is full of joy. A truly nurturing place.", emoji: "👩🏼" },
  { name: "Aditya Rao", child: "Playgroup", text: "A mother's touch is real here. Our little one feels safe and loved.", emoji: "👨🏻" },
];

function Bubble({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div className="mx-3 w-[320px] flex-none rounded-3xl border border-border bg-card p-6 shadow-soft">
      <p className="font-body text-foreground/80">"{t.text}"</p>
      <div className="mt-4 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-blush text-xl">{t.emoji}</span>
        <div>
          <p className="font-display font-extrabold text-foreground">{t.name}</p>
          <p className="font-body text-sm text-primary">Parent · {t.child}</p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const loop = [...testimonials, ...testimonials];
  return (
    <section id="testimonials" className="relative overflow-hidden bg-secondary/30 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 font-display text-sm font-bold text-primary shadow-soft">
            💬 Parent Testimonials
          </span>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
            What MamaSparsh Means to Our Families
          </h2>
        </Reveal>
      </div>

      <div className="group relative mt-14 overflow-hidden">
        <div
          className="flex w-max"
          style={{ animation: "marquee 38s linear infinite" }}
        >
          {loop.map((t, i) => (
            <Bubble key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
