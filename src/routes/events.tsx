import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Calendar, Users, Ticket as TicketIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { events, type Event } from "@/lib/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events across Africa · MyWorldAfrica" },
      { name: "description", content: "Rallies, meetups and expeditions hosted by the MyWorldAfrica community. RSVP and get a PDF ticket instantly." },
      { property: "og:title", content: "Events across Africa · MyWorldAfrica" },
      { property: "og:description", content: "Rallies, meetups and expeditions across the continent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EventsPage,
});

const filters = ["All", "Riders", "Drivers", "Explorers"] as const;

function EventsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [selected, setSelected] = useState<Event | null>(null);

  const list = events.filter((e) => filter === "All" || e.audience === filter || e.audience === "All");

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 pt-28 pb-16">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3">
              Community events
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Where the tribe gathers</h1>
            <p className="mt-3 text-muted-foreground">
              RSVP and receive a PDF ticket with a scannable QR code in your inbox.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-warm-gradient text-primary-foreground border-transparent"
                    : "border-border hover:bg-muted"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => (
            <article key={e.id} className="rounded-2xl overflow-hidden bg-card border border-border shadow-warm hover:shadow-glow transition-all flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={e.image} alt={e.title} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute top-3 left-3 rounded-full bg-warm-gradient px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {e.audience}
                </div>
                <div className="absolute bottom-3 right-3 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-xs text-white">
                  {e.price}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold">{e.title}</h3>
                <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {e.location}, {e.country}</div>
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {e.taken}/{e.spots} joined · hosted by {e.host}</div>
                </div>
                <div className="mt-4 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-warm-gradient" style={{ width: `${(e.taken / e.spots) * 100}%` }} />
                </div>
                <Button onClick={() => setSelected(e)} className="mt-5 bg-warm-gradient text-primary-foreground hover:opacity-90">
                  <TicketIcon className="mr-2 h-4 w-4" /> Get ticket
                </Button>
              </div>
            </article>
          ))}
        </div>
      </main>

      <RsvpDialog event={selected} onClose={() => setSelected(null)} />
      <SiteFooter />
    </div>
  );
}

function RsvpDialog({ event, onClose }: { event: Event | null; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issued, setIssued] = useState<null | { code: string }>(null);

  if (!event) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const code = `MWA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setIssued({ code });
    toast.success("Ticket generated!", { description: `A PDF ticket was dispatched to ${email}` });
  };

  const close = () => {
    setIssued(null);
    setName("");
    setEmail("");
    onClose();
  };

  return (
    <Dialog open={!!event} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-md">
        {!issued ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">RSVP to {event.title}</DialogTitle>
              <DialogDescription>
                We'll generate a PDF ticket with a QR code and email it to you instantly.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Kaya Ndlovu" required maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@myworldafrica.com" required maxLength={255} />
              </div>
              <Button type="submit" className="w-full bg-warm-gradient text-primary-foreground hover:opacity-90 h-11">
                Confirm & generate ticket
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto h-14 w-14 rounded-full bg-secondary/15 grid place-items-center mb-3">
              <CheckCircle2 className="h-8 w-8 text-secondary" />
            </div>
            <DialogTitle className="font-display text-2xl">You're in!</DialogTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Your PDF ticket for <b>{event.title}</b> was sent to <b>{email}</b>.
            </p>
            <div className="mt-6 rounded-xl border-2 border-dashed border-primary/40 bg-muted/40 p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Ticket code</div>
              <div className="mt-1 font-mono text-2xl font-bold text-primary">{issued.code}</div>
              <div className="mt-3 mx-auto h-24 w-24 rounded-md bg-foreground/90"
                style={{
                  backgroundImage: "repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)",
                  backgroundSize: "10px 10px",
                }}
              />
              <div className="mt-2 text-[10px] text-muted-foreground">Scan at the gate</div>
            </div>
            <Button onClick={close} className="mt-6 w-full">Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
