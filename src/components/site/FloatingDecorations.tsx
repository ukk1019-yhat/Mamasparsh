import { motion } from "motion/react";
import sings from "@/assets/panda-sings.png";
import grows from "@/assets/panda-grows.png";
import plays from "@/assets/panda-plays.png";
import { Butterfly } from "./Butterfly";

const pandas = [
  { src: sings, left: "3%", top: "15%", delay: 0, duration: 6, w: "w-16 md:w-24", opacity: "opacity-20 md:opacity-25" },
  { src: grows, left: "88%", top: "25%", delay: 1.5, duration: 7, w: "w-14 md:w-22", opacity: "opacity-15 md:opacity-20" },
  { src: plays, left: "6%", top: "55%", delay: 3, duration: 8, w: "w-12 md:w-20", opacity: "opacity-15 md:opacity-20" },
];

const bamboos = [
  { left: "1%", height: "h-48 md:h-64", delay: 0, tilt: "-rotate-3" },
  { left: "4%", height: "h-36 md:h-48", delay: 0.5, tilt: "rotate-2" },
  { left: "7%", height: "h-56 md:h-72", delay: 1, tilt: "-rotate-1" },
  { left: "90%", height: "h-52 md:h-68", delay: 0.3, tilt: "rotate-3" },
  { left: "93%", height: "h-40 md:h-52", delay: 0.8, tilt: "-rotate-2" },
  { left: "96%", height: "h-60 md:h-76", delay: 1.2, tilt: "rotate-1" },
];

export function FloatingDecorations() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Bamboo stalks */}
      {bamboos.map((b, i) => (
        <motion.div
          key={`bamboo-${i}`}
          className={`absolute bottom-0 ${b.height} w-3 md:w-4 ${b.tilt}`}
          style={{ left: b.left }}
          animate={{ rotate: [0, 1.5, -1.5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
        >
          <svg viewBox="0 0 20 200" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Main stalk */}
            <rect x="7" y="0" width="6" height="200" rx="3" className="fill-emerald-700/20" />
            {/* Nodes */}
            {[30, 60, 90, 120, 150, 180].map((y) => (
              <g key={y}>
                <rect x="2" y={y - 2} width="16" height="5" rx="2" className="fill-emerald-600/25" />
                {/* Leaves */}
                <path d={`M18 ${y + 2} L30 ${y - 8} L28 ${y - 2} Z`} className="fill-emerald-500/25" />
                <path d={`M2 ${y + 2} L-10 ${y - 6} L-8 ${y - 1} Z`} className="fill-emerald-500/20" />
                <path d={`M18 ${y + 2} L28 ${y + 12} L26 ${y + 6} Z`} className="fill-emerald-400/20" />
              </g>
            ))}
          </svg>
        </motion.div>
      ))}

      {/* Floating pandas */}
      {pandas.map((p, i) => (
        <motion.img
          key={`panda-${i}`}
          src={p.src}
          alt=""
          width={120}
          height={120}
          loading="lazy"
          className={`absolute ${p.w} ${p.opacity}`}
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, -18, 0], x: [0, 10, -8, 0], rotate: [0, 4, -4, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}

      {/* Flying butterflies */}
      <Butterfly variant="drift" size={18} color="text-primary/40" style={{ top: "12%", left: "0%" }} />
      <Butterfly variant="drift" size={14} color="text-accent/35" style={{ top: "38%", left: "0%", animationDelay: "5s" }} />
      <Butterfly variant="drift" size={16} color="text-sky/35" style={{ top: "62%", left: "0%", animationDelay: "10s" }} />
      <Butterfly variant="drift" size={12} color="text-primary/30" style={{ top: "82%", left: "0%", animationDelay: "3s" }} />
      <Butterfly variant="figure8" size={20} color="text-accent/30" style={{ top: "18%", right: "8%" }} />
      <Butterfly variant="hover" size={16} color="text-sky/30" style={{ top: "48%", right: "12%" }} />
      <Butterfly variant="figure8" size={14} color="text-primary/25" style={{ top: "74%", right: "5%" }} />
      <Butterfly variant="hover" size={18} color="text-accent/25" style={{ top: "30%", left: "15%" }} />
      <Butterfly variant="figure8" size={12} color="text-sky/25" style={{ top: "58%", left: "12%" }} />
    </div>
  );
}
