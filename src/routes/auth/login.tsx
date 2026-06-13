import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { MagneticButton } from "@/components/site/MagneticButton";
import { GradientText } from "@/components/site/Reveal";
import { signIn } from "@/lib/auth";
import pandaSings from "@/assets/panda-sings.png";
import pandaReads from "@/assets/panda-reads.png";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function BambooStalk({ left, height, delay }: { left: string; height: string; delay: number }) {
  return (
    <motion.div
      className={`absolute bottom-0 ${height} w-[6px] md:w-1`}
      style={{ left }}
      animate={{ rotate: [0, 2, -2, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg viewBox="0 0 8 200" className="h-full w-full" fill="none">
        <rect x="2" width="4" height="200" rx="2" className="fill-emerald-700/15" />
        {[40, 80, 120, 160].map((y) => (
          <g key={y}>
            <rect x="0" y={y-1} width="8" height="3" rx="1" className="fill-emerald-600/20" />
            <path d={`M8 ${y+1} L16 ${y-6} L15 ${y-1} Z`} className="fill-emerald-500/20" />
            <path d={`M0 ${y+1} L-7 ${y-5} L-6 ${y-1} Z`} className="fill-emerald-500/15" />
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await signIn(email, password);
      const role = user?.user_metadata?.role;
      if (role === "admin") {
        navigate({ to: "/admin/dashboard" });
      } else {
        navigate({ to: "/parent/dashboard" });
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-primary/5 via-background to-secondary/5 px-4">
      {/* Bamboo decorations */}
      <BambooStalk left="2%" height="h-40 md:h-56" delay={0} />
      <BambooStalk left="6%" height="h-28 md:h-40" delay={0.5} />
      <BambooStalk left="92%" height="h-44 md:h-60" delay={0.3} />
      <BambooStalk left="96%" height="h-32 md:h-44" delay={0.8} />

      {/* Floating pandas */}
      <motion.img
        src={pandaSings}
        alt=""
        className="absolute left-[5%] top-[12%] w-16 opacity-20 md:w-24 md:opacity-25"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src={pandaReads}
        alt=""
        className="absolute right-[8%] top-[55%] w-14 opacity-15 md:w-20 md:opacity-20"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Clouds */}
      <div className="absolute left-[10%] top-[8%] h-20 w-32 rounded-full bg-white/30 blur-3xl" />
      <div className="absolute right-[15%] top-[18%] h-16 w-28 rounded-full bg-white/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl border border-primary/10 bg-card/80 p-8 shadow-lift backdrop-blur-xl">
          <div className="mb-6 text-center">
            <h1 className="font-display text-3xl font-extrabold">
              <GradientText text="Welcome Back" />
            </h1>
            <p className="mt-1 font-body text-sm text-muted-foreground">
              Preschool Management System
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="font-body text-sm font-semibold text-foreground/80">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border-primary/20 bg-background/50 font-body text-sm focus-visible:ring-primary/40"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="font-body text-sm font-semibold text-foreground/80">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl border-primary/20 bg-background/50 font-body text-sm focus-visible:ring-primary/40"
                placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-destructive/10 px-4 py-2 font-body text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}

            <MagneticButton type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </MagneticButton>

            <p className="text-center font-body text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/auth/register" className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary/80">
                Register
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
