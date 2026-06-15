import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
import { Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/parent/pending")({
  component: ParentPending,
});

function ParentPending() {
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background via-accent/[0.02] to-background p-4">
      <BambooBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft">
          <CardContent className="space-y-6 p-8 text-center">
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, -5, 0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-bamboo shadow-soft"
            >
              <Clock className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="font-display text-3xl font-extrabold">
              <GradientText text="Pending Approval" />
            </h1>
            <p className="font-body text-muted-foreground">
              Your account is currently under review. An administrator will approve your registration shortly.
            </p>
            <div className="flex items-center justify-center gap-2 rounded-xl bg-accent/5 p-3 font-body text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              You&apos;ll be able to access the parent portal once approved.
            </div>
            <Button onClick={handleSignOut} variant="outline" className="w-full rounded-xl font-body font-bold">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
