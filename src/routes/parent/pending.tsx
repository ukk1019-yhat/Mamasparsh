import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";

export const Route = createFileRoute("/parent/pending")({
  component: PendingApproval,
});

function PendingApproval() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate({ to: "/auth/login" });
    });
  }, []);

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Pending Approval</CardTitle>
          <CardDescription>
            Your account is awaiting admin approval. You will be notified once approved. Please check back later.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you have any questions, please contact the school administration.
          </p>
          <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
        </CardContent>
      </Card>
    </div>
  );
}
