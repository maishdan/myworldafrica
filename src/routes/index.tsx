import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Play, Ticket, Users, Video, Route as RouteIcon, Sparkles } from "lucide-react";
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
      { property: "og:description", content: "Community for African riders, drivers and explorers." },
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

      {/* CINEMATIC HERO */}
      <section className="relative min-h-screen w-full overflow-hidden">
        <img
          src="/back 1.png"
          alt="African Adventure with Motorcycle and Pyramids"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Deep, professional cinematic overlays */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent hidden lg:block" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-16 min-h-screen flex flex-col justify-center items-center">
          {/* Floating Element at Absolute Furthest Top Right */}
          <div className="absolute top-24 right-2 sm:right-6 md:right-10 w-24 sm:w-32 md:w-44 lg:w-56 animate-float pointer-events-none z-20">
            <div className="relative rounded-full overflow-hidden aspect-square animate-rainbow-glow border-2 border-white/20">
              <img
                src="/Circular.png"
                alt="Circular Branding"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="w-full max-w-5xl flex flex-col items-center text-center">
            {/* BRANDING LOGO BLOCK - Centered & Bold */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-12 transform hover:scale-105 transition-transform duration-700 w-full px-4">
              <img
                src="/a (2).png"
                alt="My World Africa Logo"
                className="h-32 sm:h-48 md:h-64 lg:h-80 w-auto object-contain drop-shadow-2xl"
              />
              <div className="hidden sm:block w-2 h-32 sm:h-48 md:h-64 lg:h-80 bg-accent rounded-full shadow-glow" />
              <div className="flex flex-col items-center sm:items-start font-sans font-black leading-[0.8] text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter uppercase drop-shadow-2xl italic">
                <div className="text-white">MY WORLD</div>
                <div className="text-accent mt-2 sm:mt-4">AFRICA</div>
              </div>
            </div>

            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-6 py-2 text-[10px] sm:text-xs uppercase tracking-[0.4em] text-white/90 mb-10 shadow-2xl">
              <Sparkles className="h-4 w-4 text-accent animate-pulse" />
              From Cape to Cairo — 54 countries, one community
            </div>

            <h1 className="font-display text-white text-3xl sm:text-6xl md:text-7xl font-black italic uppercase leading-[1] max-w-4xl drop-shadow-2xl px-4 tracking-tighter">
              Ride the road. <br />
              <span className="text-gradient-warm">Own the story.</span>
            </h1>

            <p className="mt-8 text-base sm:text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed drop-shadow-lg font-medium px-6">
              The premium hub for African explorers. Post vertical memories,
              rally your group, and secure tickets for the continent\u0027s greatest adventures.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-6 w-full justify-center px-8">
              <Link to="/events" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-warm-gradient text-primary-foreground shadow-glow hover:scale-105 transition-all duration-300 h-16 sm:h-20 px-12 text-xl font-black uppercase tracking-widest">
                  Explore Events <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link to="/feed" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 sm:h-20 px-12 text-xl border-white/40 bg-black/40 text-white hover:bg-black/60 backdrop-blur-xl transition-all duration-300 font-black uppercase tracking-widest">
                  <Play className="mr-3 h-6 w-6" /> Watch the Feed
                </Button>
              </Link>
            </div>

            <div className="mt-16 sm:mt-24 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-16 w-full max-w-3xl justify-center px-6">
              <Stat n="12K+" l="Explorers" />
              <Stat n="540+" l="Events hosted" />
              <Stat n="38" l="Countries" className="col-span-2 sm:col-span-1" />
            </div>
          </div>
        </div>
      </section>

      {/* TRIBES */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 opacity-15 pointer-events-none grayscale">
          <img
            src="/all.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="text-xs uppercase tracking-[0.4em] text-primary font-black mb-4">
              Three tribes · One road
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">Find your people</h2>
            <p className="mt-6 text-xl text-muted-foreground font-medium leading-relaxed">
              Whether you burn fuel on two wheels, four wheels, or two feet — there\u0027s a
              tribe waiting on the other side of the horizon.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Tribe img={ridersImg} tag="Riders" title="Two wheels, endless dust" desc="From Honda Ace 125s to KTM Adventures — join weekend runs and cross-border rallies." />
            <Tribe img={driversImg} tag="Drivers" title="Four wheels, open dunes" desc="4x4 convoys, offroad meets, and long-haul road trips across the continent." />
            <Tribe img={explorersImg} tag="Explorers" title="Culture, food, stories" desc="Trekkers, foodies, photographers — the people who chase experiences." />
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="relative overflow-hidden rounded-[3rem] p-12 md:p-24 text-primary-foreground shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] min-h-[500px] flex items-center">
          <img
            src="/backg2.png"
            alt="Adventure background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

          <div className="relative z-10 max-w-3xl">
            <RouteIcon className="h-16 w-16 mb-8 text-accent drop-shadow-lg" />
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight drop-shadow-2xl">
              Your next adventure is <br /> <span className="text-accent">on the map.</span>
            </h2>
            <p className="mt-8 text-xl opacity-90 drop-shadow-md max-w-xl font-medium leading-relaxed">
              Join thousands of riders, drivers and explorers writing the next
              chapter of African travel. Free to join. Always.
            </p>
            <div className="mt-12 flex gap-4 flex-wrap">
              <Link to="/auth">
                <Button size="lg" className="h-16 px-10 bg-white text-black hover:bg-white/90 shadow-2xl hover:scale-105 transition-transform font-black uppercase tracking-widest text-sm rounded-2xl">
                  Create Account
                </Button>
              </Link>
              <Link to="/events">
                <Button size="lg" variant="outline" className="h-16 px-10 border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md shadow-2xl hover:scale-105 transition-transform font-black uppercase tracking-widest text-sm rounded-2xl">
                  Explore Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ n, l, className }: { n: string; l: string; className?: string }) {
  return (
    <div className={className}>
      <div className="font-display text-4xl sm:text-5xl md:text-6xl font-black italic text-white drop-shadow-2xl">{n}</div>
      <div className="text-[10px] sm:text-xs uppercase tracking-[0.4em] font-black text-white/60 mt-2">{l}</div>
    </div>
  );
}

function Tribe({ img, tag, title, desc }: { img: string; tag: string; title: string; desc: string }) {
  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] aspect-[3/4] shadow-2xl border border-white/10">
      <img src={img} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-x-0 bottom-0 p-10 text-white transform transition-transform duration-500 group-hover:-translate-y-4">
        <div className="inline-block rounded-full bg-accent px-4 py-1 text-[10px] font-black uppercase tracking-widest mb-4 shadow-lg text-primary-foreground">
          {tag}
        </div>
        <h3 className="text-3xl font-black uppercase italic tracking-tighter drop-shadow-md leading-tight">{title}</h3>
        <p className="mt-4 text-sm text-white/80 leading-relaxed drop-shadow-sm font-medium">{desc}</p>
      </div>
    </div>
  );
}
