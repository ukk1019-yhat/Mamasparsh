import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Play, CalendarHeart, PawPrint } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import bambooBg from "@/assets/bamboo-forest-bg.jpg";
import pandaFamily from "@/assets/hero-panda-family.png";

function Cloud({ className, delay, dur }: { className: string; delay: number; dur: number }) {
  return (
    <div
      className={`absolute rounded-full bg-white/70 blur-2xl ${className}`}
      style={{ animation: `drift ${dur}s linear ${delay}s infinite` }}
    />
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const pandaY = useTransform(scrollYProgress, [0, 1], ["-10%", "5%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative min-h-[100svh] overflow-hidden bg-gradient-hero">
      {/* Bamboo background with parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        <img
          src={bambooBg}
          alt="Sunlit bamboo forest"
          className="h-[120%] w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky/30 via-transparent to-background" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-sun)" }} />
      </motion.div>

      {/* Clouds */}
      <Cloud className="left-[-10%] top-[14%] h-24 w-56" delay={0} dur={48} />
      <Cloud className="left-[-15%] top-[26%] h-16 w-40" delay={9} dur={62} />
      <Cloud className="left-[-12%] top-[8%] h-20 w-48" delay={20} dur={70} />

      {/* Butterflies + particles */}
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: `${15 + i * 28}%`,
            top: `${30 + (i % 2) * 18}%`,
            animation: `float-tiny ${4 + i}s ease-in-out ${i * 0.8}s infinite`,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary/60">
            <path d="M12 4C14 2 18 3 19 6C20 9 17 11 12 12C7 11 4 9 5 6C6 3 10 2 12 4Z" />
            <path d="M12 12C14 13 17 15 16 18C15 21 11 21 9 19C7 17 8 14 12 12Z" opacity="0.7" />
            <path d="M12 12C10 10 8 7 9 5C10 3 13 3 15 5C17 7 15 10 12 12Z" opacity="0.5" />
          </svg>
        </span>
      ))}
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute h-1.5 w-1.5 rounded-full bg-star animate-twinkle"
          style={{
            left: `${(i * 53) % 100}%`,
            top: `${(i * 37) % 90}%`,
            animationDelay: `${(i % 6) * 0.4}s`,
          }}
        />
      ))}

      {/* Side-by-side layout */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-5 md:flex-row md:gap-8 lg:gap-16">
        {/* Panda family - left */}
        <motion.div
          style={{ y: pandaY }}
          className="z-10 flex w-full justify-center md:w-1/2"
        >
          <motion.img
            initial={{ opacity: 0, x: -160, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            src={pandaFamily}
            alt="The MamaSparsh panda family — reading, writing, painting and dancing"
            width={1536}
            height={1024}
            className="w-[min(85vw,500px)] animate-float-soft drop-shadow-2xl"
          />
        </motion.div>

        {/* Content - right */}
        <div className="flex w-full flex-col items-center md:w-1/2 md:items-start md:text-left">
          <motion.div style={{ y: textY, opacity: fade }} className="flex flex-col items-center md:items-start">
            <h1 className="font-display text-5xl font-extrabold leading-[1.05] text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="block">Welcome to</span>
              <span className="text-gradient">MamaSparsh</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-5 max-w-xl font-body text-lg font-medium text-foreground/75 md:text-xl"
            >
              A Mother's Touch for Every Little Dream.
            </motion.p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <MagneticButton as="a" href="#contact" variant="primary">
                <CalendarHeart size={20} /> Book a School Tour
              </MagneticButton>
              <MagneticButton variant="ghost" onClick={() => setStoryOpen(true)}>
                <Play size={18} /> Watch Our Story
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 font-display text-xs font-bold tracking-widest text-foreground/60"
      >
        <span className="animate-float-soft inline-block">SCROLL TO EXPLORE ↓</span>
      </motion.div>

      {/* Story modal */}
      <AnimatePresence>
        {storyOpen && (
          <StoryModal onClose={() => setStoryOpen(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function StoryModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] grid place-items-center bg-night/80 p-5 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-card shadow-lift"
      >
        <div className="relative aspect-video bg-gradient-bamboo">
          <img
            src={pandaFamily}
            alt="MamaSparsh story"
            className="absolute inset-0 h-full w-full object-contain p-8 animate-float-soft"
          />
          <div className="absolute inset-0 grid place-items-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-card/90 shadow-glow animate-float-tiny">
              <Play size={32} className="text-primary ml-0.5" fill="currentColor" />
            </span>
          </div>
        </div>
        <div className="p-6 text-center">
          <h3 className="font-display text-2xl font-extrabold text-foreground">Our Little Story</h3>
          <p className="mt-2 font-body text-foreground/70">
            Every day at MamaSparsh begins with a hug and ends with a happy heart. Our pandas read,
            paint, sing and grow — wrapped in a mother's warmth.
          </p>
          <button
            onClick={onClose}
            className="mt-5 rounded-full bg-gradient-bamboo px-6 py-2.5 font-display font-bold text-primary-foreground"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
