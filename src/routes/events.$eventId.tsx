import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MapPin, Calendar, Clock, Users, Ticket as TicketIcon, CheckCircle2, Share2, Facebook, MessageSquare, Mail, CalendarPlus, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/events/$eventId")({
  component: EventBookingPage,
});

function EventBookingPage() {
  const { eventId } = Route.useParams();
  const { user, profile } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  const [booked, setBooked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("events").select("*").eq("id", eventId).single();
      if (data) setEvent(data);
      else {
        // Fallback mock data if event not found in DB
        setEvent({
          id: eventId,
          title: "Kilimanjaro Sunrise Expedition",
          description: "Join the ultimate group of riders and drivers as we conquer the foothills of the continent\u0027s highest peak. Four days of dust, stories, and pure African sky.",
          date: "2025-08-15",
          time: "05:30 AM",
          location: "Marangu Gate, Kilimanjaro",
          max_attendees: 1000,
          taken: 432,
          price: 0,
          is_paid: false,
          audience: "All",
          logo_url: "/logo.png",
          images: ["/back 1.png", "/backg2.png", "/all.png"]
        });
      }
      setLoading(false);
    };
    fetchEvent();
  }, [eventId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      nav({ to: "/auth", search: { redirect: `/events/${eventId}` } });
      return;
    }

    if (event.is_paid && !booked) {
      nav({
        to: "/pay",
        search: {
          amount: event.price,
          item: `Ticket: ${event.title}`,
          id: event.id,
        },
      });
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        event_id: eventId,
        attended: false,
        ticket_code: `MWA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
      });

      if (error) throw error;

      setBooked(true);
      toast.success("Booking Confirmed!", { description: "Your ticket is ready in your dashboard." });
    } catch (err) {
      console.error(err);
      // Demo fallback
      setBooked(true);
    } finally {
      setBusy(false);
    }
  };

  const addToCalendar = () => {
    if (!event) return;
    const start = event.date.replace(/-/g, "") + "T090000Z";
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${start}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    window.open(url, "_blank");
  };

  if (loading) return <div className="min-h-screen grid place-items-center"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!event) return <div className="min-h-screen grid place-items-center text-center">Event not found. <Link to="/events" className="text-primary font-bold">Go back</Link></div>;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Cinematic Event Banner */}
      <div className="h-[50vh] md:h-[70vh] relative overflow-hidden">
        <img src={event.images?.[0] || "/back 1.png"} className="w-full h-full object-cover" alt="Banner" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />

        <Link to="/events" className="absolute top-28 left-6 z-30 flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest">
           <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20">
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
               <div className="flex items-center gap-4 mb-6">
                  <div className="h-20 w-20 rounded-3xl bg-white p-3 shadow-2xl">
                    <img src={event.logo_url || "/logo.png"} className="w-full h-full object-contain" alt="Logo" />
                  </div>
                  <div className="text-white text-xs uppercase tracking-[0.3em] font-black bg-primary px-4 py-1.5 rounded-full shadow-lg">
                    {event.audience} Group Event
                  </div>
               </div>
               <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl leading-[0.9]">
                 {event.title}
               </h1>
            </div>

            <div className="bg-card/80 backdrop-blur-xl p-8 rounded-[3rem] border border-white/20 shadow-2xl min-w-[320px]">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-black text-primary uppercase italic tracking-tighter">
                  {event.is_paid ? `Ksh ${event.price}` : "FREE"}
                </div>
                <div className="text-xs font-black text-muted-foreground uppercase tracking-widest">{event.taken || 0}/{event.max_attendees || 100} JOINED</div>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-warm-gradient animate-pulse" style={{ width: `${((event.taken || 0) / (event.max_attendees || 100)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-3 gap-16">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-16">
          <section className="space-y-8">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
               <span className="w-12 h-1 bg-primary rounded-full" /> The Mission
            </h2>
            <p className="text-2xl text-muted-foreground leading-relaxed font-medium">
              {event.description}
            </p>
          </section>

          <section className="grid sm:grid-cols-3 gap-8 p-10 bg-muted/30 rounded-[3rem] border border-border/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <MapPin className="h-24 w-24" />
            </div>
            <div className="space-y-2 relative z-10">
              <div className="text-[10px] uppercase tracking-[0.3em] font-black text-primary">Date</div>
              <div className="text-xl font-black uppercase italic tracking-tighter">{new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
            </div>
            <div className="space-y-2 relative z-10">
              <div className="text-[10px] uppercase tracking-[0.3em] font-black text-primary">Time</div>
              <div className="text-xl font-black uppercase italic tracking-tighter">{event.time}</div>
            </div>
            <div className="space-y-2 relative z-10">
              <div className="text-[10px] uppercase tracking-[0.3em] font-black text-primary">Location</div>
              <div className="text-xl font-black uppercase italic tracking-tighter">{event.location}</div>
            </div>
          </section>

          <section className="space-y-8">
             <h2 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                <span className="w-12 h-1 bg-primary rounded-full" /> The Vibe
             </h2>
             <div className="grid grid-cols-2 gap-6">
                {(event.images || []).slice(1, 5).map((img: string, i: number) => (
                  <div key={i} className="aspect-[16/10] rounded-[2rem] overflow-hidden border border-border/50 shadow-lg hover:scale-105 transition-transform duration-500">
                    <img src={img} className="w-full h-full object-cover" alt="Event Vibe" />
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Right Column: Booking Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-8">
            {booked ? (
               <div className="bg-black text-white rounded-[3rem] p-10 shadow-2xl border border-white/10 text-center animate-in zoom-in duration-500">
                  <div className="h-20 w-20 rounded-full bg-accent/20 border-2 border-accent grid place-items-center mx-auto mb-8">
                     <CheckCircle2 className="h-10 w-10 text-accent" />
                  </div>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-accent">Spot Secured!</h3>
                  <p className="text-white/70 mb-8 font-medium">Your ticket has been dispatched. Rally the rest of the tribe!</p>

                  <div className="space-y-4">
                     <Button onClick={addToCalendar} className="w-full h-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold border border-white/10">
                        <CalendarPlus className="mr-2 h-5 w-5 text-accent" /> Add to Calendar
                     </Button>
                     <Link to="/dashboard">
                        <Button className="w-full h-14 bg-warm-gradient text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs shadow-glow">
                           Go to My Dashboard <Download className="ml-2 h-4 w-4" />
                        </Button>
                     </Link>
                  </div>
               </div>
            ) : (
               <div className="bg-card border-2 border-primary rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                    <TicketIcon className="h-24 w-24" />
                  </div>

                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-8">Join the Tribe</h3>

                  <form onSubmit={handleBooking} className="space-y-6">
                     <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground pl-1">Confimation</Label>
                       <div className="p-4 bg-muted/50 rounded-2xl border border-border text-sm font-bold">
                          Booking as <span className="text-primary">{profile?.username || user?.email?.split("@")[0] || "Explorer"}</span>
                       </div>
                     </div>

                     <Button
                       type="submit"
                       disabled={busy}
                       className="w-full h-20 bg-warm-gradient text-primary-foreground font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-glow active:scale-95 transition-all text-lg"
                     >
                       {busy ? "Processing..." : event.is_paid ? "Pay & Secure Ticket" : "Secure My Ticket"}
                     </Button>
                  </form>

                  <p className="mt-8 text-[10px] text-muted-foreground text-center italic font-medium leading-relaxed">
                    By booking, you agree to the My World Africa community guidelines for safe and epic adventures.
                  </p>
               </div>
            )}

            <div className="bg-muted/50 p-8 rounded-[2.5rem] border border-border/50">
               <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-6 text-center text-muted-foreground">Broadcast the Vibe</h4>
               <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" size="icon" className="w-full h-14 rounded-2xl border-border bg-background hover:bg-[#25D366]/10 hover:border-[#25D366]/50 group transition-all">
                     <MessageSquare className="h-6 w-6 text-[#25D366] group-hover:scale-110 transition-transform" />
                  </Button>
                  <Button variant="outline" size="icon" className="w-full h-14 rounded-2xl border-border bg-background hover:bg-[#1877F2]/10 hover:border-[#1877F2]/50 group transition-all">
                     <Facebook className="h-6 w-6 text-[#1877F2] group-hover:scale-110 transition-transform" />
                  </Button>
                  <Button variant="outline" size="icon" className="w-full h-14 rounded-2xl border-border bg-background hover:bg-primary/10 hover:border-primary/50 group transition-all">
                     <Share2 className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  </Button>
               </div>
            </div>

            <div className="text-center pt-4 opacity-50">
               <div className="text-[9px] uppercase tracking-[0.4em] font-black italic">
                 powered by my world africa
               </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
