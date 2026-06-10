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
<<<<<<< HEAD
  const leafSvgs = [
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C8 6 4 12 4 16C4 20 8 22 12 22C16 22 20 20 20 16C20 12 16 6 12 2Z"/><path d="M12 13L7 18"/><path d="M12 13L17 18"/><path d="M12 13V22"/></svg>`,
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3C7 7 3 14 3 18C3 21 7 22 12 22C17 22 21 21 21 18C21 14 17 7 12 3Z"/><path d="M12 14L8 17"/><path d="M12 14L16 17"/></svg>`,
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4C7 8 4 13 4 17C4 20 7 21 12 21C17 21 20 20 20 17C20 13 17 8 12 4Z"/><path d="M12 14L9 16.5"/><path d="M12 14L15 16.5"/></svg>`,
  ];
=======
  const leaves = ["🍃", "🌿", "🍂"];
>>>>>>> b8161265997a66ba5d9c6e31636ac1d09c89deae
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
<<<<<<< HEAD
            <span dangerouslySetInnerHTML={{ __html: leafSvgs[i % leafSvgs.length] }} />
=======
            {leaves[i % leaves.length]}
>>>>>>> b8161265997a66ba5d9c6e31636ac1d09c89deae
          </span>
        );
      })}
    </div>
  );
}
