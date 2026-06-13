import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sprout } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { scrollToSection } from "./SmoothScroll";
import { Link } from "@tanstack/react-router";
import logoSrc from "@/assets/logo.png";

const links = [
  { label: "Panda World", href: "#learn" },
  { label: "Programs", href: "/programs" },
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
              {l.href.startsWith("#") ? (
                <a
                  href={l.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(l.href.slice(1)); }}
                  className="story-link font-display text-[0.95rem] font-semibold text-foreground/80 transition-colors hover:text-primary"
                >
                  {l.label}
                </a>
              ) : (
                <a
                  href={l.href}
                  className="story-link font-display text-[0.95rem] font-semibold text-foreground/80 transition-colors hover:text-primary"
                >
                  {l.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/auth/login"
            className="font-display text-sm font-semibold text-foreground/80 hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Link to="/auth/register">
            <MagneticButton variant="primary" className="px-5 py-2.5 text-sm">
              <Sprout size={16} /> Register
            </MagneticButton>
          </Link>
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
                  {l.href.startsWith("#") ? (
                    <a
                      href={l.href}
                      onClick={(e) => { e.preventDefault(); setOpen(false); scrollToSection(l.href.slice(1)); }}
                      className="block rounded-xl px-3 py-2.5 font-display font-semibold text-foreground/85 hover:bg-muted"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-2.5 font-display font-semibold text-foreground/85 hover:bg-muted"
                    >
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
              <li className="pt-2 flex flex-col gap-2">
                <Link
                  to="/auth/login"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-full bg-gradient-bamboo px-5 py-3 text-center font-display font-bold text-primary-foreground"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-xl px-3 py-2.5 text-center font-display font-semibold text-foreground/85 hover:bg-muted"
                >
                  Register
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
