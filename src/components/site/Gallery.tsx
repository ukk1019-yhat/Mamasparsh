import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
<<<<<<< HEAD
import { X, Camera } from "lucide-react";
=======
import { X } from "lucide-react";
>>>>>>> b8161265997a66ba5d9c6e31636ac1d09c89deae
import { Reveal } from "./Reveal";
import classroom from "@/assets/scene-classroom.jpg";
import celebration from "@/assets/scene-celebration.jpg";
import outdoor from "@/assets/scene-outdoor.jpg";
import art from "@/assets/scene-art.jpg";
import yoga from "@/assets/scene-yoga.jpg";
import sports from "@/assets/scene-sports.jpg";

const photos = [
  { img: classroom, cat: "Classroom Moments", span: "row-span-2" },
  { img: outdoor, cat: "Panda Adventures", span: "" },
  { img: celebration, cat: "Celebrations", span: "" },
  { img: sports, cat: "Sports & Games", span: "row-span-2" },
  { img: art, cat: "Art & Craft", span: "" },
  { img: yoga, cat: "Events", span: "" },
];

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section id="gallery" className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-12 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 font-display text-sm font-bold text-primary">
<<<<<<< HEAD
              <Camera size={16} /> Photo Gallery
=======
              📸 Photo Gallery
>>>>>>> b8161265997a66ba5d9c6e31636ac1d09c89deae
            </span>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              Moments Worth Framing
            </h2>
          </Reveal>
        </div>

        <div className="grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-3">
          {photos.map((p, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08} className={p.span}>
              <button
                onClick={() => setActive(i)}
                className={`group relative h-full w-full overflow-hidden rounded-3xl shadow-soft ${p.span}`}
              >
                <img
                  src={p.img}
                  alt={p.cat}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute bottom-3 left-3 translate-y-2 font-display text-sm font-extrabold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {p.cat}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[80] grid place-items-center bg-night/85 p-5 backdrop-blur-md"
          >
            <button className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-night">
              <X size={20} />
            </button>
            <motion.img
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              src={photos[active].img}
              alt={photos[active].cat}
              className="max-h-[82vh] w-auto rounded-3xl shadow-lift"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
