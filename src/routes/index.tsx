import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Play, Ticket, Users, Video, Route as RouteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import ridersImg from "@/assets/riders.jpg";
import driversImg from "@/assets/drivers.jpg";
import explorersImg from "@/assets/explorers.jpg";
import { events } from "@/lib/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MyWorldAfrica — Ride, Drive & Explore the Continent" },
      {
        name: "description",
        content:
          "Community for African riders, drivers and explorers. Share shorts and vlogs, host events, and get PDF tickets delivered instantly.",
      },
      { property: "og:title", content: "MyWorldAfrica — Ride, Drive & Explore the Continent" },
      {
        property: "og:description",
        content:
          "Community for African riders, drivers and explorers. Share shorts and vlogs, host events, and get PDF tickets delivered instantly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* HERO */}
      <section className="relative min-h-screen w-full overflow-hidden">
        <img
          src="/back 1.png"
          alt="African savanna with wildlife and Mount Kilimanjaro"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1200}
        />
        {/* Clean, targeted overlays for maximum visibility */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent hidden lg:block" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 sm:pt-40 pb-16 sm:pb-24 min-h-screen flex flex-col justify-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-4 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/90 mb-6 shadow-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              From Cape to Cairo — 54 countries, one community
            </div>
            <h1 className="font-display text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1] sm:leading-[0.95] drop-shadow-2xl">
              Ride the road.<br />
              <span className="text-gradient-warm drop-shadow-sm">Own the story.</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed drop-shadow-lg font-medium">
              MyWorldAfrica is where African explorers, riders and drivers meet. Post
              shorts and vlogs from your journey, host meetups anywhere on the
              continent, and get automated PDF tickets in your inbox.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/events" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-warm-gradient text-primary-foreground shadow-glow hover:scale-105 transition-all duration-300 h-12 sm:h-14 px-8 text-base font-bold">
                  Explore Events <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/feed" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-8 text-base border-white/40 bg-black/20 text-white hover:bg-black/40 backdrop-blur-md transition-all duration-300">
                  <Play className="mr-2 h-4 w-4" /> Watch the Feed
                </Button>
              </Link>
            </div>

            <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 max-w-lg">
              <Stat n="12K+" l="Explorers" />
              <Stat n="540+" l="Events hosted" />
              <Stat n="38" l="Countries" className="col-span-2 sm:col-span-1" />
            </div>
          </div>
        </div>
      </section>

      {/* TRIBES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3">
            Three tribes · One road
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">Find your people</h2>
          <p className="mt-4 text-muted-foreground">
            Whether you burn fuel on two wheels, four wheels, or two feet — there's a
            tribe waiting on the other side of the horizon.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Tribe img={ridersImg} tag="Riders" title="Two wheels, endless dust" desc="From Honda Ace 125s to KTM Adventures — join weekend runs and cross-border rallies." />
          <Tribe img={driversImg} tag="Drivers" title="Four wheels, open dunes" desc="4x4 convoys, offroad meets, and long-haul road trips across the continent." />
          <Tribe img={explorersImg} tag="Explorers" title="Culture, food, stories" desc="Trekkers, foodies, photographers — the people who chase experiences." />
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-muted/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-14 lg:grid-cols-2 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3">
                Everything a modern community needs
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Built for the way <span className="text-gradient-warm">Africa moves.</span>
              </h2>
              <p className="mt-5 text-muted-foreground text-lg">
                Post shorts and vlogs. Plan custom trips. Host events targeted to
                the exact tribe you want. Every RSVP triggers an automated PDF
                ticket delivered to the inbox — with a QR code, ready to scan.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Feature icon={Video} title="Shorts & Vlogs" desc="Upload vertical shorts and horizontal vlogs. Auto-compressed with ffmpeg." />
              <Feature icon={MapPin} title="Custom Trips" desc="Plot routes across borders. Share checkpoints with your convoy." />
              <Feature icon={Users} title="Targeted Events" desc="Send a Riders-Only invite. Or open to all explorers. You choose." />
              <Feature icon={Ticket} title="PDF Tickets" desc="Auto-generated on RSVP. Delivered instantly with a scannable QR code." />
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3">
              Upcoming
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">Ride into these</h2>
          </div>
          <Link to="/events" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            See all events <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 3).map((e) => (
            <Link
              key={e.id}
              to="/events"
              className="group rounded-2xl overflow-hidden bg-card border border-border/60 shadow-warm hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={e.image}
                  alt={e.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 rounded-full bg-warm-gradient px-3 py-1 text-[10px] font-bold text-primary-foreground shadow-lg">
                  {e.audience}
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {e.location}, {e.country}
                </div>
                <h3 className="mt-2 text-xl font-bold">{e.title}</h3>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="font-semibold text-primary">{e.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-primary-foreground shadow-2xl min-h-[400px] flex items-center">
          <img
            src="/backg2.png"
            alt="Adventure background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-warm-gradient/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

          <div className="relative z-10 max-w-2xl">
            <RouteIcon className="h-10 w-10 mb-4 opacity-90 drop-shadow-lg" />
            <h2 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-xl">
              Your next adventure is already on the map.
            </h2>
            <p className="mt-4 text-lg opacity-95 drop-shadow-md max-w-xl font-medium">
              Join thousands of riders, drivers and explorers writing the next
              chapter of African travel. Free to join. Always.
            </p>
            <div className="mt-8 flex gap-3 flex-wrap">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="h-13 px-8 bg-background text-foreground hover:bg-background/90 shadow-xl hover:scale-105 transition-transform font-bold">
                  Create your account
                </Button>
              </Link>
              <Link to="/events/create">
                <Button size="lg" variant="outline" className="h-13 px-8 border-white/40 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md shadow-xl hover:scale-105 transition-transform font-bold">
                  Host an event
                </Button>
              </Link>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-24 h-72 w-72 rounded-full bg-black/20 blur-3xl" />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ n, l, className }: { n: string; l: string; className?: string }) {
  return (
    <div className={className}>
      <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white">{n}</div>
      <div className="text-[10px] sm:text-xs uppercase tracking-widest text-white/70 mt-1">{l}</div>
    </div>
  );
}

function Tribe({ img, tag, title, desc }: { img: string; tag: string; title: string; desc: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-warm border border-white/10">
      <img src={img} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white transform transition-transform duration-500 group-hover:-translate-y-2">
        <div className="inline-block rounded-full bg-warm-gradient px-3 py-1 text-xs font-semibold mb-3 shadow-lg">
          {tag}
        </div>
        <h3 className="text-2xl font-bold drop-shadow-md">{title}</h3>
        <p className="mt-2 text-sm text-white/90 leading-relaxed drop-shadow-sm">{desc}</p>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="rounded-xl bg-card border border-border p-5 hover:shadow-warm transition-shadow">
      <div className="h-10 w-10 rounded-lg bg-warm-gradient grid place-items-center mb-3">
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="font-semibold">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
