import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MapPin, Calendar, Users, Ticket as TicketIcon, Plus, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { events, type Event } from "@/lib/mockData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events across Africa · MyWorldAfrica" },
      { name: "description", content: "Rallies, meetups and expeditions hosted by the MyWorldAfrica community. RSVP and get a PDF ticket instantly." },
    ],
  }),
  component: EventsPage,
});

const filters = ["All", "Riders", "Drivers", "Explorers"] as const;

function EventsPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [dbEvents, setDbEvents] = useState<any[]>([]);

  useEffect(() => {
    // Fetch real events and their stats from database
    const fetchEvents = async () => {
      const [eventsRes, statsRes] = await Promise.all([
        supabase.from("events").select("*").order("date", { ascending: true }),
        supabase.from("event_stats").select("*")
      ]);

      if (eventsRes.data) {
        const merged = eventsRes.data.map(event => ({
          ...event,
          taken: statsRes.data?.find(s => s.event_id === event.id)?.taken || 0
        }));
        setDbEvents(merged);
      }
    };
    fetchEvents();
  }, []);

  const handleHostClick = () => {
    if (!user) {
      nav({ to: "/auth", search: { redirect: "/events/create" } });
    } else {
      nav({ to: "/events/create" });
    }
  };

  const handleBookingClick = (eventId: string) => {
    if (!user) {
      nav({ to: "/auth", search: { redirect: `/events/${eventId}` } });
    } else {
      nav({ to: `/events/${eventId}` });
    }
  };

  // Merge mock data and DB data for a full list
  const displayList = dbEvents.length > 0 ? dbEvents : events;
  const filteredList = displayList.filter((e) => filter === "All" || e.audience === filter || e.audience === "All");

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Cinematic Hero Section for Events */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src="/back 1.png"
          alt="African Adventure"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40" />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-accent mb-6 shadow-xl">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Rally the tribe across the continent
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl mb-6">
            Where the road <br />
            <span className="text-accent">starts together.</span>
          </h1>
          <p className="text-xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-lg">
            RSVP to community rallies, expeditions, and meetups.
            Get your digital ticket instantly and hit the dust.
          </p>
        </div>
      </section>

      <main className="relative z-20 -mt-16 mx-auto max-w-7xl px-6 pb-24">
        <div className="bg-card border border-border shadow-2xl rounded-[3rem] p-8 md:p-12">
          <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex gap-2 flex-wrap justify-center">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-xl border-2 px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${
                    filter === f
                      ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/20"
                      : "border-border bg-muted/50 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <Button
              size="lg"
              onClick={handleHostClick}
              className="bg-warm-gradient text-primary-foreground h-14 px-10 rounded-2xl font-black uppercase tracking-widest shadow-glow hover:scale-105 transition-transform"
            >
              <Plus className="mr-2 h-5 w-5" /> Host an Event
            </Button>
          </header>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredList.map((e) => (
              <article
                key={e.id}
                className="group rounded-[2rem] overflow-hidden bg-muted/30 border border-border/50 hover:border-primary/30 transition-all flex flex-col shadow-sm hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={e.image || e.images?.[0] || "/backg2.png"}
                    alt={e.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4 rounded-full bg-accent px-4 py-1 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-lg">
                    {e.audience}
                  </div>
                  <div className="absolute bottom-4 right-4 rounded-full bg-black/60 backdrop-blur px-4 py-1.5 text-xs font-bold text-white border border-white/10">
                    {e.price === 0 || e.price === "FREE" ? "FREE" : `Ksh ${e.price}`}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4 group-hover:text-primary transition-colors">
                    {e.title}
                  </h3>

                  <div className="space-y-3 text-sm font-medium text-muted-foreground mb-6">
                    <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /> {e.location}, {e.country || "Kenya"}</div>
                    <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-primary" /> {new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                    <div className="flex items-center gap-3"><Users className="h-4 w-4 text-primary" /> {e.taken || 0}/{e.spots || e.maxAttendees || 100} joined</div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border/50">
                    <Button
                      onClick={() => handleBookingClick(e.id)}
                      className="w-full h-12 bg-background border border-border hover:bg-primary hover:text-white hover:border-transparent rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <TicketIcon className="h-4 w-4" /> Get Ticket <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredList.length === 0 && (
            <div className="py-20 text-center">
              <div className="text-muted-foreground font-medium text-lg">No events found in this category.</div>
              <p className="text-sm text-muted-foreground mt-2">Be the first to rally the tribe!</p>
              <Button onClick={handleHostClick} variant="link" className="mt-4 text-primary font-bold uppercase tracking-widest">
                Host an Event Now
              </Button>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
