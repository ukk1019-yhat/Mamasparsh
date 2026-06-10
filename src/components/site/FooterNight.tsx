import { motion } from "motion/react";
<<<<<<< HEAD
import { Moon, Heart } from "lucide-react";
=======
>>>>>>> b8161265997a66ba5d9c6e31636ac1d09c89deae
import sleeping from "@/assets/panda-sleeping.png";

export function FooterNight() {
  return (
    <footer className="relative overflow-hidden bg-gradient-night pt-28 text-star">
      {/* moon */}
      <div className="absolute right-[12%] top-12 h-24 w-24 rounded-full bg-star/90 blur-[2px] shadow-glow" />
      {/* stars */}
      {Array.from({ length: 40 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-star animate-twinkle"
          style={{
            left: `${(i * 47) % 100}%`,
            top: `${(i * 29) % 70}%`,
            animationDelay: `${(i % 7) * 0.5}s`,
          }}
        />
      ))}

      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <motion.img
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          src={sleeping}
          alt="Sleeping MamaSparsh panda"
          width={1024}
          height={1024}
          loading="lazy"
          className="mx-auto w-48 animate-float-soft drop-shadow-2xl md:w-60"
        />
<<<<<<< HEAD
        <p className="mt-4 font-display text-sm font-bold tracking-widest text-star/80">GOODNIGHT, LITTLE PANDAS <Moon size={14} className="inline-block ml-1" /></p>
=======
        <p className="mt-4 font-display text-sm font-bold tracking-widest text-star/80">GOODNIGHT, LITTLE PANDAS 🌙</p>
>>>>>>> b8161265997a66ba5d9c6e31636ac1d09c89deae
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold leading-snug text-star md:text-4xl">
          Every Child Deserves a Mother's Touch.
          <br />
          Welcome to MamaSparsh.
        </h2>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 font-body text-star/80">
          <a href="#learn" className="hover:text-star">Panda World</a>
          <a href="#adventures" className="hover:text-star">Adventures</a>
          <a href="#why" className="hover:text-star">Why Us</a>
          <a href="#gallery" className="hover:text-star">Gallery</a>
          <a href="#contact" className="hover:text-star">Contact</a>
        </div>

        <div className="mt-10 border-t border-star/15 py-6 font-body text-sm text-star/60">
<<<<<<< HEAD
          © {new Date().getFullYear()} MamaSparsh Preschool · Made with <Heart size={14} className="inline-block mx-0.5 text-red-400" /> in the Panda World
=======
          © {new Date().getFullYear()} MamaSparsh Preschool · Made with 💚 in the Panda World
>>>>>>> b8161265997a66ba5d9c6e31636ac1d09c89deae
        </div>
      </div>
    </footer>
  );
}
