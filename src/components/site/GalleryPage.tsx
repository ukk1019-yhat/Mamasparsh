import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { getGalleryImages } from "@/lib/api/gallery.functions";

type GalleryImage = {
  id: string;
  name: string;
};

function thumbUrl(id: string) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
}
function fullUrl(id: string) {
  return `https://drive.google.com/uc?export=download&id=${id}`;
}

export function GalleryPage() {
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGalleryImages().then((images) => {
      setAllImages(images);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-8 flex items-center gap-3">
          <Link
            to="/"
            className="grid h-10 w-10 place-items-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/80"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-display text-3xl font-extrabold text-foreground">
            Photo Gallery
          </h1>
        </div>
        <Reveal>
          <p className="mb-8 text-muted-foreground">
            A collection of precious moments from MamaSparsh Preschool.
          </p>
        </Reveal>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
            {allImages.map((p, i) => (
              <Reveal key={p.id} delay={(i % 5) * 0.06}>
                <button
                  onClick={() => setActive(i)}
                  className="group relative mb-6 w-full overflow-hidden rounded-3xl shadow-soft"
                >
                  <img
                    src={thumbUrl(p.id)}
                    alt={p.name}
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </button>
              </Reveal>
            ))}
          </div>
        )}
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
              src={fullUrl(allImages[active].id)}
              alt={allImages[active].name}
              className="max-h-[82vh] w-auto rounded-3xl shadow-lift"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
