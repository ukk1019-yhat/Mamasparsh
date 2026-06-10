import { useEffect, useRef, useState } from "react";

/**
 * Global ambient layer:
 *  - cursor glow that trails the pointer (desktop)
 *  - a leaf that follows the cursor
 *  - paw-print "ping" on every click
 *  - drifting bamboo leaves in the background
 */
export function AmbientLayer() {
  const glowRef = useRef<HTMLDivElement>(null);
  const leafRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine);
    if (!fine) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let gx = mx;
    let gy = my;
    let lx = mx;
    let ly = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const onClick = (e: MouseEvent) => {
      const paw = document.createElement("div");
      paw.className = "paw-ping";
      paw.textContent = "🐾";
      paw.style.left = `${e.clientX - 14}px`;
      paw.style.top = `${e.clientY - 14}px`;
      document.body.appendChild(paw);
      window.setTimeout(() => paw.remove(), 750);
    };

    const tick = () => {
      gx += (mx - gx) * 0.12;
      gy += (my - gy) * 0.12;
      lx += (mx - lx) * 0.07;
      ly += (my - ly) * 0.07;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${gx - 160}px, ${gy - 160}px, 0)`;
      }
      if (leafRef.current) {
        const angle = Math.sin(Date.now() / 500) * 18;
        leafRef.current.style.transform = `translate3d(${lx + 18}px, ${ly + 14}px, 0) rotate(${angle}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] hidden md:block">
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-[320px] w-[320px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.88 0.13 90 / 0.55), oklch(0.8 0.12 150 / 0.18) 45%, transparent 70%)",
        }}
      />
      <div ref={leafRef} className="absolute left-0 top-0 text-2xl drop-shadow">
        🍃
      </div>
    </div>
  );
}

/** Decorative drifting leaves used inside specific sections. */
export function DriftingLeaves({ count = 8 }: { count?: number }) {
  const leaves = ["🍃", "🌿", "🍂"];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 97) % 100;
        const delay = (i % 5) * 1.4;
        const dur = 14 + (i % 6) * 3;
        const size = 16 + (i % 4) * 7;
        return (
          <span
            key={i}
            className="absolute top-[-6%] animate-float-soft"
            style={{
              left: `${left}%`,
              fontSize: `${size}px`,
              animation: `float-soft ${6 + (i % 4)}s ease-in-out ${delay}s infinite, drift ${dur}s linear ${delay}s infinite`,
              opacity: 0.55,
            }}
          >
            {leaves[i % leaves.length]}
          </span>
        );
      })}
    </div>
  );
}
