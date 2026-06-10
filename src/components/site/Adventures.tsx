import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { Reveal } from "./Reveal";
import classroom from "@/assets/scene-classroom.jpg";
import celebration from "@/assets/scene-celebration.jpg";
import outdoor from "@/assets/scene-outdoor.jpg";
import art from "@/assets/scene-art.jpg";
import yoga from "@/assets/scene-yoga.jpg";
import sports from "@/assets/scene-sports.jpg";

const reels = [
  { img: outdoor, title: "Dance Activities", tag: "Movement" },
  { img: yoga, title: "Music Sessions", tag: "Rhythm" },
  { img: classroom, title: "Storytelling", tag: "Imagination" },
  { img: yoga, title: "Yoga", tag: "Calm" },
  { img: classroom, title: "STEM Learning", tag: "Discovery" },
  { img: outdoor, title: "Outdoor Play", tag: "Fun" },
  { img: art, title: "Art & Craft", tag: "Creativity" },
  { img: celebration, title: "Celebrations", tag: "Joy" },
  { img: sports, title: "Sports Day", tag: "Teamwork" },
  { img: art, title: "Gardening", tag: "Nature" },
];

export function Adventures() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="adventures" className="relative overflow-hidden bg-gradient-bamboo py-24 text-primary-foreground md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 font-display text-sm font-700">
            🎬 MamaSparsh Adventures
          </span>
          <h2 className="mt-4 font-display text-4xl font-800 leading-tight md:text-6xl">
            A Day in the Life of Our Little Pandas
          </h2>
          <p className="mt-3 max-w-xl font-body text-lg text-primary-foreground/85">
            Swipe through the reels — hover to preview, tap to play full screen.
          </p>
        </Reveal>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 md:px-[max(1.25rem,calc((100vw-72rem)/2))]"
      >
        {reels.map((r, i) => (
          <motion.button
            key={i}
            onClick={() => setActive(i)}
            whileHover={{ y: -10 }}
            className="group relative aspect-[9/13] w-[260px] flex-none snap-center overflow-hidden rounded-3xl bg-night/30 shadow-lift"
          >
            <img
              src={r.img}
              alt={r.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent" />
            <span className="absolute right-3 top-3 rounded-full bg-white/85 px-3 py-1 font-display text-xs font-700 text-night">
              {r.tag}
            </span>
            <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              ▶️
            </span>
            <span className="absolute inset-x-0 bottom-0 p-4 text-left font-display text-lg font-800 text-white">
              {r.title}
            </span>
          </motion.button>
        ))}
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
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-lift"
            >
              <button
                onClick={() => setActive(null)}
                className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-card/90 text-foreground shadow-soft"
              >
                <X size={18} />
              </button>
              <div className="relative aspect-[9/13] overflow-hidden">
                <img src={reels[active].img} alt={reels[active].title} className="h-full w-full animate-[float-soft_8s_ease-in-out_infinite] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/80 to-transparent" />
                <div className="absolute bottom-0 p-5 text-white">
                  <p className="font-display text-2xl font-800">{reels[active].title}</p>
                  <p className="font-body text-white/80">A magical MamaSparsh moment 🐾</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
