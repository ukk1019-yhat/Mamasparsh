import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sprout } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import logoSrc from "@/assets/logo.png";

const links = [
  { label: "Panda World", href: "#learn" },
  { label: "Adventures", href: "#adventures" },
  { label: "Curriculum", href: "/curriculum" },
  { label: "Why Us", href: "#why" },
  { label: "A Day", href: "#day" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -90 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-card/85 shadow-soft backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-8">
        <a href="#home" className="flex items-center gap-2.5">
          <img src={logoSrc} alt="MamaSparsh logo" className="h-24 w-auto" />
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="story-link font-display text-[0.95rem] font-semibold text-foreground/80 transition-colors hover:text-primary"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <MagneticButton as="a" href="https://calendly.com/umakrishnakanthchokkapu15/30min" target="_blank" variant="primary" className="px-6 py-2.5 text-sm">
            <Sprout size={16} /> Book a Tour
          </MagneticButton>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="grid h-11 w-11 place-items-center rounded-xl bg-card/80 text-foreground shadow-soft backdrop-blur lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-card/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2.5 font-display font-semibold text-foreground/85 hover:bg-muted"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="https://calendly.com/umakrishnakanthchokkapu15/30min"
                  target="_blank"
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-gradient-bamboo px-5 py-3 text-center font-display font-bold text-primary-foreground"
                >
                  <Sprout size={16} /> Book a Tour
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
