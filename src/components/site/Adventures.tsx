import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Clapperboard, Play, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal, GradientText } from "./Reveal";
import { getVideos, type VideoItem } from "@/lib/api/video.functions";

function videoUrl(id: string) {
  return `https://docs.google.com/uc?export=download&confirm=t&id=${id}`;
}
function embedUrl(id: string) {
  return `https://drive.google.com/file/d/${id}/preview`;
}
function thumbUrl(id: string) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w400`;
}

export function Adventures() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const [isHovering, setIsHovering] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getVideos().then(setVideos);
  }, []);

  useEffect(() => {
    if (!marqueeRef.current) return;
    const el = marqueeRef.current;
    if (isHovering) {
      el.style.animationPlayState = "paused";
    } else {
      el.style.animationPlayState = "running";
    }
  }, [isHovering]);

  const previewVideos = videos.slice(0, 8);
  const loop = [...previewVideos, ...previewVideos];

  if (videos.length === 0) return null;

  return (
    <section id="adventures" className="relative scroll-mt-24 overflow-hidden bg-gradient-bamboo py-24 text-primary-foreground md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal effect="scale">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 font-display text-sm font-bold">
            <Clapperboard size={16} /> MamaSparsh Adventures
          </span>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight md:text-6xl">
            <GradientText text="A Day in the Life of Our Little Pandas" from="from-white" via="via-primary-foreground/80" to="to-white" />
          </h2>
          <p className="mt-3 max-w-xl font-body text-lg text-primary-foreground/85">
            Swipe through the reels — hover to preview, tap to play full screen.
          </p>
        </Reveal>
      </div>

      <div
        className="group relative mt-12 overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          ref={marqueeRef}
          className="flex w-max gap-5 px-5"
          style={{ animation: "marquee 45s linear infinite" }}
        >
          {loop.map((v, i) => (
            <motion.button
              key={`${v.id}-${i}`}
              onClick={() => setActive(i % previewVideos.length)}
              whileHover={{ y: -10 }}
              className="group/btn relative aspect-[9/13] w-[260px] flex-none snap-center overflow-hidden rounded-3xl bg-night/30 shadow-lift"
            >
              <video
                ref={(el) => { if (el) videoRefs.current.set(i % previewVideos.length, el); }}
                src={videoUrl(v.id)}
                muted
                playsInline
                preload="metadata"
                poster={thumbUrl(v.id)}
                onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                onMouseLeave={(e) => {
                  const vid = e.currentTarget as HTMLVideoElement;
                  vid.pause();
                  vid.currentTime = 0;
                }}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent pointer-events-none" />
              <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/85 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100 pointer-events-none">
                <Play size={22} className="text-night ml-0.5" fill="currentColor" />
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <Reveal>
        <div className="mt-10 text-center">
          <Link
            to="/adventures"
            className="inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 font-display text-sm font-bold text-primary-foreground transition-all hover:bg-white/30 hover:shadow-lg"
          >
            View More Videos <ArrowRight size={18} />
          </Link>
        </div>
      </Reveal>

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
                key={previewVideos[active].id}
                src={embedUrl(previewVideos[active].id)}
                allow="autoplay; fullscreen"
                className="h-full w-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
