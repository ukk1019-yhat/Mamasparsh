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
import { supabase } from "@/lib/supabase";
import { signOut, getCurrentProfile } from "@/lib/auth";
import type { Profile } from "@/types/database";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/admin/parents", label: "Parents", icon: "👥" },
  { to: "/admin/students", label: "Students", icon: "👶" },
  { to: "/admin/attendance", label: "Attendance", icon: "✅" },
  { to: "/admin/daily-rhythm", label: "Daily Rhythm", icon: "📋" },
  { to: "/admin/report-cards", label: "Report Cards", icon: "📄" },
  { to: "/admin/announcements", label: "Announcements", icon: "📢" },
  { to: "/admin/files", label: "Files", icon: "📁" },
];

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    getCurrentProfile().then((p) => {
      if (!p || p.role !== "admin") {
        navigate({ to: "/auth/login" });
        return;
      }
      setProfile(p as Profile);
    });
  }, []);

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <aside className="w-64 border-r bg-card flex flex-col shrink-0">
          <div className="p-4">
            <Link to="/admin/dashboard" className="text-lg font-bold tracking-tight">
              🐼 Panda Mama
            </Link>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
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
                      {profile?.full_name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm truncate">{profile?.full_name || "Admin"}</span>
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
      )}
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
