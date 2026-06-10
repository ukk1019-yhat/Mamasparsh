import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type Variant = "primary" | "secondary" | "ghost" | "night";

const styles: Record<Variant, string> = {
  primary:
    "bg-gradient-bamboo text-primary-foreground shadow-soft hover:shadow-lift",
  secondary:
    "bg-gradient-blush text-secondary-foreground shadow-soft hover:shadow-lift",
  ghost:
    "bg-card/70 text-foreground ring-1 ring-border backdrop-blur hover:bg-card",
  night:
    "bg-star/90 text-night shadow-glow hover:bg-star",
};

interface MagneticButtonProps {
  children: ReactNode;
  variant?: Variant;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  as?: "button" | "a";
  href?: string;
}

export function MagneticButton({
  children,
  variant = "primary",
  onClick,
  className = "",
  type = "button",
  as = "button",
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 14 });
  const sy = useSpring(y, { stiffness: 200, damping: 14 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    x.set(mx * 0.3);
    y.set(my * 0.4);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const sharedClass = `inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-display text-base font-700 transition-shadow duration-300 ${styles[variant]} ${className}`;

  if (as === "a") {
    return (
      <motion.a
        ref={ref as never}
        href={href}
        onClick={onClick}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ x: sx, y: sy }}
        whileTap={{ scale: 0.94 }}
        className={sharedClass}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as never}
      type={type}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.94 }}
      className={sharedClass}
    >
      {children}
    </motion.button>
  );
}

