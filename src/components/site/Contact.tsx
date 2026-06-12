import { useState } from "react";
import confetti from "canvas-confetti";
import { MapPin, Phone, Mail, MessageCircle, Heart } from "lucide-react";
import { Reveal, GradientText } from "./Reveal";

export function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.7 }, colors: ["#F2483B", "#8854B8", "#FABA31", "#1AB193", "#ffffff"] });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden bg-muted/60 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-12 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 font-display text-sm font-bold text-primary shadow-soft">
              <Mail size={16} /> Contact Us
            </span>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              <GradientText text="Let's Begin Your Child's Journey" />
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-7 shadow-soft">
              <div className="grid gap-4 sm:grid-cols-2">
                <input required placeholder="Parent's name" className="rounded-2xl border border-border bg-background px-4 py-3 font-body outline-none focus:ring-2 focus:ring-primary" />
                <input required placeholder="Phone number" className="rounded-2xl border border-border bg-background px-4 py-3 font-body outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <input type="email" required placeholder="Email address" className="mt-4 w-full rounded-2xl border border-border bg-background px-4 py-3 font-body outline-none focus:ring-2 focus:ring-primary" />
              <input placeholder="Child's age" className="mt-4 w-full rounded-2xl border border-border bg-background px-4 py-3 font-body outline-none focus:ring-2 focus:ring-primary" />
              <textarea rows={4} placeholder="Tell us about your little one" className="mt-4 w-full rounded-2xl border border-border bg-background px-4 py-3 font-body outline-none focus:ring-2 focus:ring-primary" />
              <button type="submit" className="mt-5 w-full rounded-full bg-gradient-bamboo px-6 py-3.5 font-display text-lg font-extrabold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]">
                {sent ? <span className="inline-flex items-center gap-2"><Heart size={18} /> Thank you! We'll be in touch</span> : "Send Inquiry"}
              </button>
            </form>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex h-full flex-col gap-4">
              <div className="grid gap-3 rounded-3xl border border-border bg-card p-6 shadow-soft">
                <a href="tel:+918309236742" className="flex items-center gap-3 font-body text-foreground/80 hover:text-primary">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-bamboo text-primary-foreground"><Phone size={20} /></span>
                  +91 83092 36742
                </a>
                <a href="mailto:mamaischoolkakinada@gmail.com" className="flex items-center gap-3 font-body text-foreground/80 hover:text-primary">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-blush text-secondary-foreground"><Mail size={20} /></span>
                  mamaischoolkakinada@gmail.com
                </a>
                <div className="flex items-center gap-3 font-body text-foreground/80">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-accent-foreground"><MapPin size={20} /></span>
                  69722A, Opposite Boat Club Park Road, Srinivasa Nagar, Vegella Pappaya Street, Nagamallithota Junction, Kakinada-533003, Andhra Pradesh
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-border shadow-soft">
                <iframe
                  title="MamaSparsh location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1!2d82.2397592!3d16.9887039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3829497f29910d%3A0x9a4f6887ffc75b02!2sMamasparsh%20Premium%20international%20playschool%20powered%20by%20Dreamtime!5e0!3m2!1sen!2sin!4v1"
                  className="h-56 w-full"
                  loading="lazy"
                />
              </div>

              <a
                href="https://wa.me/918309236742"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-3xl bg-primary px-6 py-4 font-display text-lg font-extrabold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
              >
                <MessageCircle size={22} /> Chat on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
