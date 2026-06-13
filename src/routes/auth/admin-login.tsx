import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { MagneticButton } from "@/components/site/MagneticButton";
import { GradientText } from "@/components/site/Reveal";
import { signIn } from "@/lib/auth";
import pandaExplores from "@/assets/panda-explores.png";
import pandaMascot from "@/assets/panda-mascot.png";

export const Route = createFileRoute("/auth/admin-login")({
  component: AdminLoginPage,
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

function AdminLoginPage() {
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
      await signIn(email, password);
      navigate({ to: "/admin/dashboard" });
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-primary/5 via-background to-secondary/5 px-4">
      <BambooStalk left="2%" height="h-36 md:h-52" delay={0} />
      <BambooStalk left="5%" height="h-24 md:h-36" delay={0.7} />
      <BambooStalk left="93%" height="h-40 md:h-56" delay={0.3} />
      <BambooStalk left="96%" height="h-28 md:h-40" delay={0.6} />

      <motion.img
        src={pandaExplores}
        alt=""
        className="absolute right-[8%] top-[10%] w-16 opacity-20 md:w-24 md:opacity-25"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.img
        src={pandaMascot}
        alt=""
        className="absolute left-[5%] top-[55%] w-14 opacity-15 md:w-20 md:opacity-20"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
      />

      <div className="absolute left-[15%] top-[5%] h-24 w-36 rounded-full bg-primary/10 blur-4xl" />
      <div className="absolute right-[10%] top-[20%] h-16 w-28 rounded-full bg-secondary/10 blur-4xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl border border-primary/10 bg-card/80 p-8 shadow-lift backdrop-blur-xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-blush shadow-soft">
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-extrabold">
              <GradientText text="Admin Sign In" />
            </h1>
            <p className="mt-1 font-body text-sm text-muted-foreground">
              Authorized personnel only
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
                placeholder="admin@mamasparsh.com"
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
              <Link to="/auth/parent-login" className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary/80">
                Parent Login
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
