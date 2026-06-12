import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowLeft, Loader2, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal, GradientText } from "./Reveal";
import { getVideos, type VideoItem } from "@/lib/api/video.functions";

function embedUrl(id: string) {
  return `https://drive.google.com/file/d/${id}/preview`;
}
function thumbUrl(id: string) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w400`;
}

export function AdventuresPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVideos().then((list) => {
      setVideos(list);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-8 flex items-center gap-3">
          <Link
            to="/"
            className="grid h-10 w-10 place-items-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/80"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-display text-3xl font-extrabold text-foreground">
            <GradientText text="MamaSparsh Adventures" />
          </h1>
        </div>
        <Reveal effect="scale">
          <p className="mb-8 text-muted-foreground">
            A Day in the Life of Our Little Pandas
          </p>
        </Reveal>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v, i) => (
              <Reveal key={v.id} delay={(i % 5) * 0.06}>
                <button
                  onClick={() => setActive(i)}
                  className="group relative w-full overflow-hidden rounded-3xl shadow-soft"
                >
                  <img
                    src={thumbUrl(v.id)}
                    alt=""
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/85 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Play size={22} className="text-night ml-0.5" fill="currentColor" />
                  </span>
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
            className="fixed inset-0 z-[80] grid place-items-center bg-night/85 p-2 backdrop-blur-md"
          >
            <button
              onClick={(e) => { e.stopPropagation(); setActive(null); }}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-night shadow-soft"
            >
              <X size={20} />
            </button>
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-black shadow-lift"
              style={{ aspectRatio: "9/16" }}
            >
              <iframe
                key={videos[active].id}
                src={embedUrl(videos[active].id)}
                allow="autoplay; fullscreen"
                className="h-full w-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
