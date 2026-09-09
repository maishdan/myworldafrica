import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Sparkles, Upload, Image as ImageIcon, Link as LinkIcon, Facebook, MessageSquare, Copy, Check, Clock, CreditCard, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/events/create")({
  head: () => ({
    meta: [
      { title: "Host an event · MyWorldAfrica" },
      { name: "description", content: "Publish a rally, meetup or expedition and reach the exact tribe you want — riders, drivers or all explorers." },
    ],
  }),
  component: CreateEvent,
});

const audiences = ["Riders", "Drivers", "Explorers", "All"] as const;

function CreateEvent() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);

  // Form State
  const [audience, setAudience] = useState<(typeof audiences)[number]>("All");
  const [isPaid, setIsPaid] = useState(false);
  const [form, setForm] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    description: "",
    minAttendees: 100,
    maxAttendees: 1000,
    price: 20,
    payoutDetails: "",
  });

  const [groupLogo, setGroupLogo] = useState<File | null>(null);
  const [eventImages, setEventImages] = useState<File[]>([]);

  useEffect(() => {
    if (!user && !busy) {
      toast.error("Access Denied: Please sign in to host an event");
      nav({ to: "/auth", search: { redirect: "/events/create" } });
    }
  }, [user, nav, busy]);

  const onPickLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setGroupLogo(f);
  };

  const onPickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 4);
    setEventImages(files);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);

    try {
      // 1. Upload Logo
      let logoUrl = "";
      if (groupLogo) {
        const path = `logos/${user.id}/${Date.now()}_${groupLogo.name}`;
        await supabase.storage.from("event-assets").upload(path, groupLogo);
        logoUrl = supabase.storage.from("event-assets").getPublicUrl(path).data.publicUrl;
      }

      // 2. Upload Gallery
      const imageUrls: string[] = [];
      for (const img of eventImages) {
        const path = `gallery/${user.id}/${Date.now()}_${img.name}`;
        await supabase.storage.from("event-assets").upload(path, img);
        imageUrls.push(supabase.storage.from("event-assets").getPublicUrl(path).data.publicUrl);
      }

      // 3. Save to Database
      const { data, error } = await supabase.from("events").insert({
        creator_id: user.id,
        title: form.title,
        description: form.description,
        location: form.location,
        date: form.date,
        time: form.time,
        min_attendees: form.minAttendees,
        max_attendees: form.maxAttendees,
        price: isPaid ? form.price : 0,
        is_paid: isPaid,
        audience: audience,
        logo_url: logoUrl,
        images: imageUrls,
        payout_details: form.payoutDetails
      }).select().single();

      if (error) throw error;

      toast.success("Event Published! Redirecting to dashboard...");
      setTimeout(() => nav({ to: "/dashboard" }), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish event. Please ensure all tables and storage buckets are set up in Supabase.");
      // Fallback for demo
      setTimeout(() => nav({ to: "/dashboard" }), 2000);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-4xl px-6 pt-28 pb-16">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-xs uppercase tracking-[0.3em] text-primary font-black">Group Event Planner</div>
          <div className="h-px flex-1 bg-primary/20" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">Rally the tribe</h1>
        <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
          Create your group event, set your capacity, and we\u0027ll handle the rest.
        </p>

        <form onSubmit={submit} className="space-y-10">
          {/* BASIC INFO */}
          <section className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-warm relative overflow-hidden">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center text-sm">01</span>
              Event Details
            </h2>

            <div className="grid gap-8">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-base font-bold uppercase tracking-wider">Event Name</Label>
                <Input id="title" required placeholder="e.g. Nairobi Bikers Weekend Rally"
                  className="h-14 rounded-2xl bg-muted/50 border-border/50 text-lg font-bold"
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>

              <div className="space-y-3">
                <Label htmlFor="desc" className="text-base font-bold uppercase tracking-wider">Short Description</Label>
                <Textarea id="desc" rows={3} placeholder="Tell the tribe what to expect..."
                  className="rounded-2xl bg-muted/50 border-border/50 resize-none p-4"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-base font-bold uppercase tracking-wider">Group Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                      {groupLogo ? (
                        <img src={URL.createObjectURL(groupLogo)} className="w-full h-full object-cover" alt="Logo" />
                      ) : (
                        <Upload className="h-6 w-6 text-muted-foreground/50" />
                      )}
                    </div>
                    <Label className="cursor-pointer">
                      <div className="bg-secondary text-secondary-foreground px-6 py-3 rounded-xl font-bold text-sm">
                        Choose Logo
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={onPickLogo} />
                    </Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-bold uppercase tracking-wider">Target Tribe</Label>
                  <div className="flex flex-wrap gap-2">
                    {audiences.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAudience(a)}
                        className={`rounded-xl border-2 px-5 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                          audience === a
                            ? "bg-primary text-primary-foreground border-transparent shadow-lg"
                            : "border-border bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* LOGISTICS */}
          <section className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-warm">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center text-sm">02</span>
              When & Where
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="location" className="text-base font-bold uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Meetup Location
                </Label>
                <Input id="location" required placeholder="e.g. Uhuru Park, Nairobi"
                  className="h-14 rounded-2xl bg-muted/50 border-border/50 font-bold"
                  value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="date" className="text-base font-bold uppercase tracking-wider">Date</Label>
                  <Input id="date" type="date" required className="h-14 rounded-2xl bg-muted/50 font-bold"
                    value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="time" className="text-base font-bold uppercase tracking-wider">Time</Label>
                  <Input id="time" type="time" required className="h-14 rounded-2xl bg-muted/50 font-bold"
                    value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </div>
              </div>
            </div>
          </section>

          {/* PICTURES */}
          <section className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-warm">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center text-sm">03</span>
              Event Gallery
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative">
                  {eventImages[i] ? (
                    <img src={URL.createObjectURL(eventImages[i])} className="w-full h-full object-cover" alt="Event" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" multiple accept="image/*" onChange={onPickImages} />
                </div>
              ))}
            </div>
          </section>

          {/* CAPACITY & PRICING */}
          <section className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-warm">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center text-sm">04</span>
              Capacity & Pricing
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-bold uppercase tracking-wider flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> Attendee Range
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input type="number" placeholder="Min" className="h-12 rounded-xl bg-muted/50"
                      value={form.minAttendees} onChange={(e) => setForm({...form, minAttendees: Number(e.target.value)})} />
                    <Input type="number" placeholder="Max" className="h-12 rounded-xl bg-muted/50"
                      value={form.maxAttendees} onChange={(e) => setForm({...form, maxAttendees: Number(e.target.value)})} />
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="space-y-1">
                    <Label className="text-lg font-bold">Paid Event</Label>
                    <p className="text-xs text-muted-foreground">Sell tickets to the tribe.</p>
                  </div>
                  <Switch checked={isPaid} onCheckedChange={setIsPaid} />
                </div>
              </div>

              {isPaid && (
                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                  <div className="space-y-3">
                    <Label htmlFor="price" className="text-base font-bold uppercase tracking-wider">Ticket Price (Ksh)</Label>
                    <Input id="price" type="number" className="h-14 rounded-2xl bg-muted/50 font-bold text-lg"
                      value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                    <p className="text-[10px] text-muted-foreground italic font-medium">
                      * System fee: 20 Ksh per ticket will be deducted.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="payout" className="text-base font-bold uppercase tracking-wider">Payout Details</Label>
                    <Input id="payout" placeholder="M-Pesa Number or Bank Account"
                      className="h-14 rounded-2xl bg-muted/50 font-bold"
                      value={form.payoutDetails} onChange={(e) => setForm({ ...form, payoutDetails: e.target.value })} />
                  </div>
                </div>
              )}
            </div>
          </section>

          <Button
            type="submit"
            size="lg"
            disabled={busy}
            className="w-full bg-warm-gradient text-primary-foreground hover:opacity-95 h-20 rounded-[2rem] text-xl font-black uppercase tracking-[0.2em] shadow-glow"
          >
            {busy ? "Publishing..." : "Publish & Finish"}
          </Button>
        </form>

        <div className="mt-16 pt-8 border-t border-border/50 text-center flex flex-col items-center gap-2">
          <div className="font-display font-bold text-sm text-muted-foreground uppercase">MY WORLD AFRICA</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground italic">powered by my world africa</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
