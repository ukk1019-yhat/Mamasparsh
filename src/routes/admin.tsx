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
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
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

function Sidebar({ open, onClose, profile, location, handleSignOut }: {
  open: boolean;
  onClose: () => void;
  profile: Profile | null;
  location: ReturnType<typeof useLocation>;
  handleSignOut: () => Promise<void>;
}) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r bg-card flex flex-col transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between p-4">
          <div>
            <Link to="/admin/dashboard" className="text-lg font-bold tracking-tight" onClick={onClose}>
              🐼 Panda Mama
            </Link>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <Separator />
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
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
    </>
  );
}

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { navigate({ to: "/auth/login" }); return; }
        const role = session.user?.user_metadata?.role;
        if (role !== "admin") { navigate({ to: "/auth/login" }); return; }
        const { data: p } = await supabase
          .from("profiles").select("*").eq("id", session.user.id).maybeSingle();
        if (!cancelled) {
          if (p) setProfile(p as Profile);
          setChecking(false);
        }
      } catch { navigate({ to: "/auth/login" }); }
    })();
    return () => { cancelled = true; };
  }, []);

  if (checking) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profile={profile}
        location={location}
        handleSignOut={handleSignOut}
      />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="sticky top-0 z-30 flex items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-2 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-sm">🐼 Panda Mama</span>
        </div>
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
