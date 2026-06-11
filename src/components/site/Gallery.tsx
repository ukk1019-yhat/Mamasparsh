import { Camera, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

export function Gallery() {
  return (
    <section id="gallery" className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 font-display text-sm font-bold text-primary">
              <Camera size={16} /> Photo Gallery
            </span>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              Moments Worth Framing
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Browse all our photos from the MamaSparsh journey.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-display text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
              >
                View All Photos <ArrowRight size={20} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
