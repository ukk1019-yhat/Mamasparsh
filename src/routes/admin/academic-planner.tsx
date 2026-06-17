import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
import { supabase } from "@/lib/supabase";

type PlannerEntry = {
  id: string;
  title: string;
  content: string;
  target_class: string | null;
  created_by: string;
  created_at: string;
};

export const Route = createFileRoute("/admin/academic-planner")({
  component: AdminAcademicPlanner,
});

const classOptions = ["Playgroup", "Nursery", "LKG", "UKG", "Daycare"];

function AnnualPlannerContent() {
  return (
    <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft">
      <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-purple-500/10">
        <CardTitle className="font-display text-2xl font-bold">
          <GradientText text="Mamasparsh Annual Planner 2026-27" />
        </CardTitle>
        <p className="font-body text-sm text-muted-foreground">June 2026 – May 2027 &middot; Playgroup &middot; Nursery &middot; LKG &middot; UKG &middot; Kakinada</p>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-50/50 p-4">
          <p className="font-display text-sm font-bold text-amber-800">Our Pedagogical Foundation</p>
          <p className="font-body text-xs text-amber-700">IB PYP · Reggio Emilia · Waldorf Principles · Screen-Free · Culturally Rooted</p>
        </div>

        <div>
          <p className="mb-3 font-display text-lg font-bold">Academic Year at a Glance</p>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {[
              { m: "Jun '26", e: "TERM 1 BEGINS · Admissions, Orientation, Environment Awareness" },
              { m: "Jul '26", e: "TERM 1 · Who We Are · Self & Family inquiry" },
              { m: "Aug '26", e: "TERM 1 · Independence Day · Community theme" },
              { m: "Sep '26", e: "TERM 1 ENDS · Autumn Fest · Portfolio review" },
              { m: "Oct '26", e: "TERM 2 BEGINS · Sharing the Planet · Navratri / Dussehra" },
              { m: "Nov '26", e: "TERM 2 · How We Express · Art & Drama fest" },
              { m: "Dec '26", e: "TERM 2 · Winter Carnival · Christmas / Pongal prep" },
              { m: "Jan '27", e: "TERM 2 ENDS · Pongal / Sankranti · PBL Exhibition" },
              { m: "Feb '27", e: "TERM 3 BEGINS · How the World Works · Science Fair" },
              { m: "Mar '27", e: "TERM 3 · Holi / Spring Fest · SSL Program" },
              { m: "Apr '27", e: "TERM 3 · Graduation prep · Ugadi New Year" },
              { m: "May '27", e: "TERM 3 ENDS · Graduation Day · Portfolio sharing" },
            ].map(({ m, e }) => (
              <div key={m} className="rounded-xl border border-primary/5 bg-gradient-to-br from-primary/[0.02] to-accent/[0.02] p-3">
                <p className="font-display text-sm font-bold text-primary">{m}</p>
                <p className="font-body text-xs text-muted-foreground">{e}</p>
              </div>
            ))}
          </div>
        </div>

        <details className="group rounded-xl border border-primary/5">
          <summary className="cursor-pointer rounded-xl bg-muted/30 p-3 font-display text-sm font-bold hover:bg-muted/50">Holidays, Festivals & Special Days 2026-27</summary>
          <div className="overflow-x-auto p-3">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b font-semibold"><th className="pb-2 pr-3">Month</th><th className="pb-2 pr-3">Date</th><th className="pb-2 pr-3">Event</th><th className="pb-2">Type</th></tr></thead>
              <tbody className="[&>tr>td]:py-1.5 [&>tr>td]:pr-3">
                {[
                  ["Jun '26", "Jun 1", "School Reopens – Orientation Day", "School Event"],
                  ["Jun '26", "Jun 5", "World Environment Day – Eco Activity", "Special Day"],
                  ["Jun '26", "Jun 21", "International Yoga Day", "Special Day"],
                  ["Jul '26", "Jul 4", "Parents' Welcome Morning", "School Event"],
                  ["Aug '26", "Aug 15", "Independence Day", "National"],
                  ["Aug '26", "Aug 19", "Raksha Bandhan", "Festival"],
                  ["Aug '26", "Aug 22", "Janmashtami", "Festival"],
                  ["Sep '26", "Sep 5", "Teachers' Day – Appreciation Day", "Special Day"],
                  ["Sep '26", "Sep 14-18", "Term 1 Portfolio Week", "School Event"],
                  ["Sep '26", "Sep 19", "Autumn Harvest Fest – Parent Showcase", "School Event"],
                  ["Oct '26", "Oct 2", "Gandhi Jayanti", "National"],
                  ["Oct '26", "Oct 2-11", "Navratri Celebration Week", "Festival"],
                  ["Oct '26", "Oct 12", "Dussehra / Vijaya Dashami", "Festival"],
                  ["Oct '26", "Oct 20", "Diwali – Lighting & Art Activity", "Festival"],
                  ["Nov '26", "Nov 1", "Andhra Pradesh Formation Day", "National"],
                  ["Nov '26", "Nov 14", "Children's Day – Grand Celebration", "Special Day"],
                  ["Nov '26", "Nov 20", "World Children's Rights Day", "Special Day"],
                  ["Dec '26", "Dec 22-24", "Winter Carnival & Christmas Activity", "Festival"],
                  ["Dec '26", "Dec 25", "Christmas (Holiday)", "Holiday"],
                  ["Dec '26", "Dec 26-31", "Winter Break", "Holiday"],
                  ["Jan '27", "Jan 1", "New Year (Holiday)", "Holiday"],
                  ["Jan '27", "Jan 14", "Sankranti / Pongal Celebration", "Festival"],
                  ["Jan '27", "Jan 26", "Republic Day – School Event", "National"],
                ].map(([m, d, e, t]) => (
                  <tr key={d} className="border-b border-primary/5">
                    <td className="font-medium">{m}</td><td>{d}</td><td>{e}</td>
                    <td><Badge variant="outline" className="rounded-full text-[10px]">{t}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <div>
          <p className="mb-3 font-display text-lg font-bold">IB PYP Transdisciplinary Themes – Annual Inquiry Map</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: "Who We Are", p: "Jul–Aug '26", ci: "Our identity, feelings and families shape who we become", sa: "PSE · Language · Arts" },
              { t: "Where We Are in Place & Time", p: "Sep '26", ci: "Our community has a history and a role in the world around us", sa: "Social Studies · Language" },
              { t: "How We Express Ourselves", p: "Oct–Nov '26", ci: "We use many languages — art, music, movement — to share our ideas", sa: "Arts · Drama · Music · Language" },
              { t: "How the World Works", p: "Dec '26–Jan '27", ci: "Nature has patterns and systems we can observe and wonder about", sa: "Science · Mathematics · UOI" },
              { t: "How We Organise Ourselves", p: "Feb–Mar '27", ci: "Communities work together and make systems that help everyone", sa: "Social Studies · Maths · PSE" },
              { t: "Sharing the Planet", p: "Apr–May '27", ci: "We share responsibility for our environment and living things", sa: "Science · UOI · Arts · PSE" },
            ].map(({ t, p, ci, sa }) => (
              <div key={t} className="rounded-xl border border-primary/5 bg-gradient-to-br from-primary/[0.02] to-secondary/[0.02] p-4">
                <p className="font-display text-sm font-bold text-primary">{t}</p>
                <p className="font-body text-xs text-muted-foreground">{p}</p>
                <p className="mt-1 font-body text-xs">{ci}</p>
                <p className="mt-1 font-body text-[10px] text-muted-foreground">{sa}</p>
              </div>
            ))}
          </div>
        </div>

        <details className="group rounded-xl border border-primary/5">
          <summary className="cursor-pointer rounded-xl bg-muted/30 p-3 font-display text-sm font-bold hover:bg-muted/50">Curriculum Overview by Class</summary>
          <div className="space-y-4 p-3">
            {[
              { cls: "Playgroup (Ages 2–3)", tag: "Sensory Play · Waldorf Rhythmic Day", terms: [
                { t: "Term 1: Me, My Body & My Family (Jun–Sep '26)", w: "Welcome & settling in · Body tracing · Family photo wall · Feelings puppets · Community helpers" },
                { t: "Term 2: Nature, Animals & Seasons (Oct–Jan)", w: "Leaf prints · Farm animals · Diwali diyas · Water play · Birds · Pongal mini-expo" },
                { t: "Term 3: Growing Things & Our Earth (Feb–May)", w: "Seeds & planting · Holi colours · Butterflies · Recycled art · Banana leaf lunch · Graduation" },
              ]},
              { cls: "Nursery (Ages 3–4)", tag: "Curiosity · Reggio Provocations · Cultural Immersion", terms: [
                { t: "Term 1: Who We Are (Jun–Sep '26)", w: "Senses & body · Family roles · Community helpers · Name writing · Sorting & counting with natural materials" },
                { t: "Term 2: How We Express (Oct–Jan)", w: "Storytelling · Visual arts · Music & rhythm · Diwali rangoli · Puppet theatre · Drum circles" },
                { t: "Term 3: How the World Works (Feb–May)", w: "Light & shadow · Plants & growth · Weather · Shadow puppets · Seed germination · Nature printing" },
              ]},
              { cls: "LKG (Ages 4–5)", tag: "Emergent Literacy · IB Learner Profile · Project-Based Inquiry", terms: [
                { t: "Term 1: Where We Are in Place & Time (Jun–Sep '26)", w: "My neighbourhood · Maps & directions · Letter recognition · CVC words · Numbers 1–20" },
                { t: "Term 2: Sharing the Planet (Oct–Jan)", w: "Ecosystems · Conservation · Sight words (50+) · Numbers 1–50 · Mini-ecosystem jar" },
                { t: "Term 3: How We Organise Ourselves (Feb–May)", w: "Rules & responsibilities · Guided reading · Numbers to 100 · SSL mini business idea" },
              ]},
              { cls: "UKG (Ages 5–6)", tag: "School Readiness · Critical Thinking · Student-Led Exhibition", terms: [
                { t: "Term 1: Who We Are (Jun–Sep '26)", w: "Identity · Cultural traditions · Blending · Place value to 100 · Human body systems" },
                { t: "Term 2: How We Express & Organise (Oct–Jan)", w: "Written & oral expression · Guided reading Level C-E · Numbers to 200 · Drama performance" },
                { t: "Term 3: How the World Works & Graduation (Feb–May)", w: "Technology & innovation · Independent reading · Numbers to 500 · SSL Shark Tank · Graduation" },
              ]},
            ].map(({ cls, tag, terms }) => (
              <div key={cls} className="rounded-xl border border-primary/5 bg-gradient-to-br from-accent/[0.02] to-transparent p-4">
                <p className="font-display text-sm font-bold">{cls}</p>
                <p className="font-body text-[10px] text-muted-foreground">{tag}</p>
                {terms.map(({ t, w }) => (
                  <div key={t} className="mt-2">
                    <p className="font-body text-xs font-semibold">{t}</p>
                    <p className="font-body text-xs text-muted-foreground">{w}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </details>

        <details className="group rounded-xl border border-primary/5">
          <summary className="cursor-pointer rounded-xl bg-muted/30 p-3 font-display text-sm font-bold hover:bg-muted/50">Waldorf Rhythmic Week & Daily Schedule</summary>
          <div className="p-3">
            <div className="mb-4 grid gap-2 sm:grid-cols-2">
              {[
                { t: "8:30–9:00", d: "Arrival & Free Play" },
                { t: "9:00–9:20", d: "Morning Ring / Circle Time" },
                { t: "9:20–10:00", d: "Main Lesson (Breathing In)" },
                { t: "10:00–10:30", d: "Snack & Banana Leaf Lunch Prep" },
                { t: "10:30–11:10", d: "Project / Art / Craft Time" },
                { t: "11:10–11:40", d: "Outdoor Play & Nature Time" },
                { t: "11:40–12:10", d: "Story Circle (Breathing Out)" },
                { t: "12:10–12:30", d: "Closing Circle & Dismissal" },
              ].map(({ t, d }) => (
                <div key={t} className="flex items-center gap-2 rounded-lg border border-primary/5 bg-muted/20 p-2">
                  <span className="whitespace-nowrap rounded-md bg-primary/10 px-2 py-0.5 font-body text-xs font-bold text-primary">{t}</span>
                  <span className="font-body text-xs">{d}</span>
                </div>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-5">
              {[
                { day: "MONDAY", color: "bg-yellow-100 text-yellow-800", theme: "WATER", act: "Watercolour · Wet-on-wet art · Water sensory play" },
                { day: "TUESDAY", color: "bg-red-100 text-red-800", theme: "FIRE", act: "Drama & storytelling · Music & rhythm · Dance" },
                { day: "WEDNESDAY", color: "bg-green-100 text-green-800", theme: "EARTH", act: "Clay & beeswax · Gardening · Cooking · Nature crafts" },
                { day: "THURSDAY", color: "bg-blue-100 text-blue-800", theme: "AIR", act: "Form drawing · Geometry · Music · Wind activities" },
                { day: "FRIDAY", color: "bg-purple-100 text-purple-800", theme: "ETHER", act: "Main lesson recap · Show & tell · Gratitude circle" },
              ].map(({ day, color, theme, act }) => (
                <div key={day} className={`rounded-xl p-3 ${color}`}>
                  <p className="font-display text-xs font-bold">{day}</p>
                  <p className="font-body text-[10px] font-semibold">{theme}</p>
                  <p className="font-body text-[10px] opacity-80">{act}</p>
                </div>
              ))}
            </div>
          </div>
        </details>

        <details className="group rounded-xl border border-primary/5">
          <summary className="cursor-pointer rounded-xl bg-muted/30 p-3 font-display text-sm font-bold hover:bg-muted/50">Assessment, Reporting & Portfolio Framework</summary>
          <div className="grid gap-3 p-3 sm:grid-cols-2">
            {[
              { t: "Learning Portfolio", d: "Curated every term by teacher + child. Samples of art, writing, maths, projects. Shared at 3-Way Conference. Digital copy via Google Photos." },
              { t: "IB Learner Profile Attributes", d: "Inquirers · Thinkers · Communicators · Knowledgeable · Principled · Open-Minded · Caring · Risk-Takers · Balanced · Reflective. Tracked through rubric each term." },
              { t: "Observation & Documentation", d: "Daily anecdotal notes · Video clips · Reggio Documentation Panels · Learning Stories · Photographs catalogued by theme & UOI." },
              { t: "Progress Report Card", d: "Issued twice: December & May. Narrative format — no grades. 6 developmental domains assessed. Written in Telugu & English." },
              { t: "3-Way Conferences", d: "Term 1: Sep '26 — Parent + Teacher. Term 2: Jan '27 — Parent + Teacher + Child. Term 3: May '27 — Graduation Sharing." },
              { t: "Transition Readiness (UKG)", d: "School Readiness Checklist · Oral language & pre-literacy assessment · Social-emotional rubric · Teacher recommendation to Grade 1." },
            ].map(({ t, d }) => (
              <div key={t} className="rounded-xl border border-primary/5 bg-muted/20 p-3">
                <p className="font-display text-xs font-bold">{t}</p>
                <p className="font-body text-xs text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </details>

        <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4">
          <p className="font-display text-sm font-bold text-emerald-800">Signature Programmes & Annual Events</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-white/60 p-3">
              <p className="font-display text-xs font-bold">Student Startup Lab (SSL)</p>
              <p className="font-body text-xs text-muted-foreground">Term 3 | Ages 5–15 | Feb–May 2027. 6-week entrepreneurship programme culminating in a public Startup Fair.</p>
            </div>
            <div className="rounded-lg bg-white/60 p-3">
              <p className="font-display text-xs font-bold">Banana Leaf Nutrition Model</p>
              <p className="font-body text-xs text-muted-foreground">Daily | Doctor-Managed | All Classes. India's first doctor-supervised banana leaf lunch model in a preschool.</p>
            </div>
            <div className="rounded-lg bg-white/60 p-3">
              <p className="font-display text-xs font-bold">Annual Events</p>
              <p className="font-body text-xs text-muted-foreground">Orientation Day · Autumn Harvest Fest · Children's Day · Winter Carnival · PBL Exhibition · Startup Fair · Ugadi · Graduation</p>
            </div>
            <div className="rounded-lg bg-white/60 p-3">
              <p className="font-display text-xs font-bold">Parent Partnership Programme</p>
              <p className="font-body text-xs text-muted-foreground">Monthly Parent Learning Circle · Volunteer in classroom · Parent-led workshops · Weekly WhatsApp updates · Annual Survey</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AdminAcademicPlanner() {
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PlannerEntry | null>(null);
  const [classFilter, setClassFilter] = useState("all");
  const [form, setForm] = useState({ title: "", content: "", target_class: "" });

  async function load() {
    const { data } = await supabase.from("academic_planner").select("*").order("created_at", { ascending: false });
    if (data) setEntries(data as PlannerEntry[]);
  }

  async function save() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const record = {
      title: form.title,
      content: form.content,
      target_class: form.target_class || null,
      created_by: user.id,
    };
    if (editing) {
      await supabase.from("academic_planner").update(record).eq("id", editing.id);
    } else {
      await supabase.from("academic_planner").insert(record);
    }
    setOpen(false);
    setEditing(null);
    setForm({ title: "", content: "", target_class: "" });
    load();
  }

  function openEdit(entry?: PlannerEntry) {
    if (entry) {
      setEditing(entry);
      setForm({ title: entry.title, content: entry.content, target_class: entry.target_class || "" });
    } else {
      setEditing(null);
      setForm({ title: "", content: "", target_class: "" });
    }
    setOpen(true);
  }

  async function deleteEntry(id: string) {
    await supabase.from("academic_planner").delete().eq("id", id);
    load();
  }

  useEffect(() => { load(); }, []);

  const filtered = classFilter === "all"
    ? entries
    : entries.filter((e) => !e.target_class || e.target_class === classFilter);

  const classes = [...new Set(entries.filter((e) => e.target_class).map((e) => e.target_class!))].sort();

  return (
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">
          <GradientText text="Academic Planner" />
        </h1>
        <p className="mt-1 font-body text-muted-foreground">Annual academic plan with class-specific updates for parents.</p>
      </motion.div>

      <AnnualPlannerContent />

      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-xl font-bold">Updates &amp; Notices</h2>
        <div className="flex items-center gap-3">
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-40 rounded-xl border-primary/20">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classOptions.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-gradient-bamboo font-display text-sm font-bold text-white shadow-soft hover:shadow-lift" onClick={() => openEdit()}>
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl border-primary/10 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display text-xl font-extrabold">
                  <GradientText text={editing ? "Edit Entry" : "New Entry"} />
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold">Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl border-primary/20" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold">Target Class (optional)</Label>
                  <Select value={form.target_class} onValueChange={(v) => setForm({ ...form, target_class: v === "all" ? "" : v })}>
                    <SelectTrigger className="rounded-xl border-primary/20"><SelectValue placeholder="All classes" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {classOptions.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold">Content</Label>
                  <Textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="rounded-xl border-primary/20" />
                </div>
                <Button onClick={save} className="w-full rounded-xl bg-gradient-bamboo font-display font-bold text-white shadow-soft">
                  {editing ? "Update" : "Post"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((e, idx) => (
          <motion.div key={e.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}>
            <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft transition-shadow hover:shadow-lift">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="font-display text-lg font-bold">{e.title}</CardTitle>
                    {e.target_class && <Badge variant="outline" className="rounded-full text-xs">{e.target_class}</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(e)} className="rounded-lg text-xs font-bold">Edit</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-7 w-7 rounded-full p-0 text-muted-foreground hover:text-destructive">✕</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently delete "{e.title}". This cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteEntry(e.id)} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <p className="font-body text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              </CardHeader>
              <CardContent>
                <p className="font-body whitespace-pre-wrap text-muted-foreground">{e.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
            <p className="font-display text-muted-foreground">No entries yet. Post the first update above.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
