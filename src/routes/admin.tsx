import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
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
import { Menu, X, LayoutDashboard, Users, GraduationCap, CheckSquare, ClipboardList, FileText, Megaphone, FolderOpen, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import type { Profile } from "@/types/database";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const iconMap: Record<string, React.ReactNode> = {
  "Dashboard": <LayoutDashboard className="h-4 w-4" />,
  "Parents": <Users className="h-4 w-4" />,
  "Students": <GraduationCap className="h-4 w-4" />,
  "Attendance": <CheckSquare className="h-4 w-4" />,
  "Daily Rhythm": <ClipboardList className="h-4 w-4" />,
  "Report Cards": <FileText className="h-4 w-4" />,
  "Announcements": <Megaphone className="h-4 w-4" />,
  "Files": <FolderOpen className="h-4 w-4" />,
  "Daily Perf.": <Star className="h-4 w-4" />,
};

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/parents", label: "Parents" },
  { to: "/admin/students", label: "Students" },
  { to: "/admin/attendance", label: "Attendance" },
  { to: "/admin/daily-rhythm", label: "Daily Rhythm" },
  { to: "/admin/report-cards", label: "Report Cards" },
  { to: "/admin/announcements", label: "Announcements" },
  { to: "/admin/files", label: "Files" },
  { to: "/admin/daily-performance", label: "Daily Perf." },
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
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-primary/5 bg-gradient-to-b from-background via-card to-background flex flex-col transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between p-4">
          <Link to="/admin/dashboard" className="flex items-center gap-2" onClick={onClose}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-bamboo text-sm font-bold text-white shadow-soft">
              P
            </div>
            <div>
              <p className="font-display font-bold tracking-tight">Panda Mama</p>
              <p className="font-body text-[10px] text-muted-foreground">Admin Panel</p>
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <Separator className="bg-primary/5" />
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm font-medium transition-all duration-200 ${
                location.pathname === item.to
                  ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              }`}
            >
              <span className={location.pathname === item.to ? "text-primary" : "text-muted-foreground/60"}>
                {iconMap[item.label]}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
        <Separator className="bg-primary/5" />
        <div className="p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.01 }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-primary/5"
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-gradient-bamboo text-[10px] text-white">
                    {profile?.full_name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate text-left">
                  <p className="font-body text-sm font-medium">{profile?.full_name || "Admin"}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{profile?.email || ""}</p>
                </div>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-primary/10 p-1">
              <DropdownMenuLabel className="font-display text-xs text-muted-foreground">Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="rounded-lg font-body text-sm">
                Sign Out
              </DropdownMenuItem>
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
        <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-primary/5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-2 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="rounded-xl">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-bamboo text-[10px] font-bold text-white">
              P
            </div>
            <span className="font-display font-bold text-sm">Panda Mama</span>
          </div>
        </div>
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
