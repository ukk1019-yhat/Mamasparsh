import { type ReactNode } from "react";
import { motion } from "motion/react";

type RevealEffect = "fade" | "scale" | "flip" | "clip";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  effect?: RevealEffect;
}

const variants: Record<RevealEffect, object> = {
  fade: { opacity: 0, y: 36 },
  scale: { opacity: 0, scale: 0.85, y: 24 },
  flip: { opacity: 0, rotateX: 15, y: 30 },
  clip: { opacity: 0, clipPath: "inset(0 0 100% 0)", y: 0 },
};

const whileInView: Record<RevealEffect, object> = {
  fade: { opacity: 1, y: 0 },
  scale: { opacity: 1, scale: 1, y: 0 },
  flip: { opacity: 1, rotateX: 0, y: 0 },
  clip: { opacity: 1, clipPath: "inset(0 0 0 0)", y: 0 },
};

/** Scroll-triggered reveal with multiple animation effects. */
export function Reveal({
  children,
  delay = 0,
  y = 36,
  className = "",
  once = true,
  effect = "fade",
}: RevealProps) {
  const initial = effect === "fade" && y !== 36 ? { opacity: 0, y } : variants[effect];
  return (
    <motion.div
      initial={initial}
      whileInView={whileInView[effect]}
      viewport={{ once, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={effect === "clip" ? { transformOrigin: "top" } : undefined}
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word text reveal for headings. */
export function TextReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      </span>
    ))}
  </span>
);
}

/** Animated gradient text for headings. */
export function GradientText({
  text,
  className = "",
  from = "from-primary",
  via = "via-accent",
  to = "to-primary",
}: {
  text: string;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
}) {
  return (
    <span
      className={`bg-gradient-to-r ${from} ${via} ${to} bg-clip-text text-transparent animate-shimmer ${className}`}
    >
      {text}
    </span>
  );
}
