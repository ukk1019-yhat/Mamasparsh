import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Camera, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal, GradientText } from "./Reveal";

const photos = [
  { id: "1U6CssoC60zYuKM4nfh6wXAfWcvUI-AR3" },
  { id: "1IKcPCAyHNqiC2eX0ZS0ymZKA5B0uOHUG" },
  { id: "1coPqtFF88Xtb2JgPLSkqA9srkmDeu-Jd" },
  { id: "1ENiD9sxVMwbkW2VDwY8GJ73pUehWQ8P0" },
  { id: "15t1vf46WwtpVLImOa6zeT3iJklznk-o2" },
  { id: "1Nw-5SwGkPZ_j4dxl-fE0882BnAM_DBQw" },
  { id: "1Np6iDOAPPo8GXcAxsYJjy71Si4-IyHqc" },
  { id: "16Q4kW9zgHAHKGhiOHEFjy1GR-ro_7xbK" },
];

function thumbUrl(id: string) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
}
function fullUrl(id: string) {
  return `https://lh3.googleusercontent.com/d/${id}`;
}

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="gallery" className="relative scroll-mt-24 overflow-hidden bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-12 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 font-display text-sm font-bold text-primary">
              <Camera size={16} /> Photo Gallery
            </span>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              <GradientText text="Moments Worth Framing" />
            </h2>
          </Reveal>
        </div>

        <div className="grid auto-rows-[300px] grid-cols-2 gap-4 md:grid-cols-3">
          {photos.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08} className={i === 0 || i === 3 ? "row-span-2" : ""}>
              <button
                onClick={() => setActive(i)}
                className={`group relative h-full w-full overflow-hidden rounded-3xl shadow-soft ${i === 0 || i === 3 ? "row-span-2" : ""}`}
              >
                <img
                  src={thumbUrl(p.id)}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-display text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
            >
              View More Photos <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>
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
              src={fullUrl(photos[active].id)}
              alt=""
              referrerPolicy="no-referrer"
              className="max-h-[82vh] w-auto rounded-3xl shadow-lift"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
