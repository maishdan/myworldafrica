import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, MapPin, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { toast } from "sonner";

export const Route = createFileRoute("/events/create")({
  head: () => ({
    meta: [
      { title: "Host an event · MyWorldAfrica" },
      { name: "description", content: "Publish a rally, meetup or expedition and reach the exact tribe you want — riders, drivers or all explorers." },
      { property: "og:title", content: "Host an event · MyWorldAfrica" },
      { property: "og:description", content: "Create and publish African adventure events in minutes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreateEvent,
});

const audiences = ["Riders", "Drivers", "Explorers", "All"] as const;

function CreateEvent() {
  const nav = useNavigate();
  const [audience, setAudience] = useState<(typeof audiences)[number]>("All");
  const [form, setForm] = useState({ title: "", location: "", date: "", description: "", spots: 50 });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.location.trim() || !form.date) {
      toast.error("Please fill out title, location and date.");
      return;
    }
    toast.success("Event published!", {
      description: `"${form.title}" is now visible to the ${audience === "All" ? "whole community" : audience.toLowerCase()}.`,
    });
    setTimeout(() => nav({ to: "/events" }), 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-6 pt-28 pb-16">
        <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3">
          Host an event
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">Rally the tribe</h1>
        <p className="mt-3 text-muted-foreground">
          Fill in the details and we'll broadcast it to the right community — with
          automated PDF tickets on every RSVP.
        </p>

        <form onSubmit={submit} className="mt-10 space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-warm">
          <div className="space-y-2">
            <Label htmlFor="title">Event title</Label>
            <Input id="title" required maxLength={150} placeholder="e.g. Kilimanjaro Sunrise Ride"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Location</Label>
              <Input id="location" required maxLength={100} placeholder="Arusha, Tanzania"
                value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Date</Label>
              <Input id="date" type="date" required
                value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" rows={4} maxLength={2000} placeholder="Tell the story. Route, meeting point, what to bring..."
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Target audience</Label>
            <div className="flex flex-wrap gap-2">
              {audiences.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAudience(a)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    audience === a
                      ? "bg-warm-gradient text-primary-foreground border-transparent"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="spots">Total spots</Label>
            <Input id="spots" type="number" min={1} max={5000}
              value={form.spots} onChange={(e) => setForm({ ...form, spots: Number(e.target.value) })} />
          </div>

          <Button type="submit" size="lg" className="w-full bg-warm-gradient text-primary-foreground hover:opacity-90 h-12">
            <Sparkles className="mr-2 h-4 w-4" /> Publish event
          </Button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
