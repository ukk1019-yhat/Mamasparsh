import { motion } from "motion/react";
import pandaSings from "@/assets/panda-sings.png";
import pandaReads from "@/assets/panda-reads.png";
import pandaExplores from "@/assets/panda-explores.png";

function BambooStalk({ left, height, delay, tilt }: { left: string; height: string; delay: number; tilt: string }) {
  return (
    <motion.div
      className={`pointer-events-none absolute bottom-0 ${height} w-[5px] md:w-[6px] ${tilt}`}
      style={{ left }}
      animate={{ rotate: [0, 1.5, -1.5, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg viewBox="0 0 8 200" className="h-full w-full" fill="none">
        <rect x="2" width="4" height="200" rx="2" className="fill-emerald-700/20" />
        {[35, 70, 105, 140, 175].map((y) => (
          <g key={y}>
            <rect x="0" y={y-1} width="8" height="3" rx="1" className="fill-emerald-600/25" />
            <path d={`M8 ${y+1} L15 ${y-6} L14 ${y-1} Z`} className="fill-emerald-500/20" />
            <path d={`M0 ${y+1} L-7 ${y-5} L-6 ${y-1} Z`} className="fill-emerald-500/15" />
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

export function BambooBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <BambooStalk left="1%" height="h-32 md:h-44" delay={0} tilt="-rotate-2" />
      <BambooStalk left="4%" height="h-24 md:h-32" delay={0.6} tilt="rotate-1" />
      <BambooStalk left="96%" height="h-36 md:h-48" delay={0.3} tilt="rotate-2" />
      <BambooStalk left="99%" height="h-24 md:h-36" delay={0.9} tilt="-rotate-1" />
      <motion.img
        src={pandaSings}
        alt=""
        className="absolute -left-2 top-[15%] w-12 opacity-10 md:w-16 md:opacity-15"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src={pandaReads}
        alt=""
        className="absolute -right-2 top-[40%] w-10 opacity-10 md:w-14 md:opacity-12"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.img
        src={pandaExplores}
        alt=""
        className="absolute -left-1 bottom-[20%] w-10 opacity-8 md:w-12 md:opacity-10"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
    </div>
  );
}
