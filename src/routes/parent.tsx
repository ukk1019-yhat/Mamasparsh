import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, getCurrentProfile } from "@/lib/auth";
import type { Profile } from "@/types/database";

export const Route = createFileRoute("/parent")({
  component: ParentLayout,
});

const navItems = [
  { to: "/parent/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/parent/profile", label: "My Children", icon: "👶" },
  { to: "/parent/attendance", label: "Attendance", icon: "✅" },
  { to: "/parent/daily-rhythm", label: "Daily Rhythm", icon: "📋" },
  { to: "/parent/report-cards", label: "Report Cards", icon: "📄" },
  { to: "/parent/announcements", label: "Announcements", icon: "📢" },
  { to: "/parent/files", label: "Files", icon: "📁" },
];

function ParentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    getCurrentProfile().then((p) => {
      if (!p || p.role !== "parent") {
        navigate({ to: "/auth/login" });
        return;
      }
      if (p.status !== "approved") {
        navigate({ to: "/parent/pending" });
        return;
      }
      setProfile(p as Profile);
    });
  }, []);

  if (!profile) return null;

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 border-r bg-card flex flex-col shrink-0">
        <div className="p-4">
          <Link to="/parent/dashboard" className="text-lg font-bold tracking-tight">
            🐼 Panda Mama
          </Link>
          <p className="text-xs text-muted-foreground">Parent Portal</p>
        </div>
        <Separator />
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                location.pathname === item.to
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <Separator />
        <div className="p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {profile?.full_name?.charAt(0) || "P"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm truncate">{profile?.full_name || "Parent"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{profile?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
