import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Play, Ticket, Users, Video, Route as RouteIcon, Sparkles, Code, ShieldCheck, Cpu, Globe, Car, BarChart3, Briefcase, Zap, Smartphone, Search, Database, ChevronRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import ridersImg from "@/assets/riders.jpg";
import driversImg from "@/assets/drivers.jpg";
import explorersImg from "@/assets/explorers.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My World Africa Ltd | Engineering & African Exploration" },
      {
        name: "description",
        content:
          "My World Africa Ltd is a top Technology and Travel company. We build great software and lead exciting tours across Africa.",
      },
      { property: "og:title", content: "My World Africa Ltd | Engineering & African Exploration" },
      { property: "og:description", content: "Building great software and leading amazing tours across the continent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-accent selection:text-black">
      <SiteNav />

      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
        <img
          src="/back 1.png"
          alt="African Adventure"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 text-center">
          <div className="w-full flex flex-col items-center">
            {/* Logo and Brand */}
            <div className="flex flex-col items-center justify-center mb-12 transform hover:scale-105 transition-transform duration-700">
              <img
                src="/logo.png"
                alt="My World Africa Logo"
                className="h-32 sm:h-48 w-auto object-contain drop-shadow-[0_0_30px_rgba(255,165,0,0.4)] mb-8"
              />
              <div className="flex flex-col items-center font-sans font-black leading-[0.8] text-6xl sm:text-8xl tracking-tighter uppercase italic text-white">
                <div>MY WORLD</div>
                <div className="text-accent mt-2">AFRICA</div>
              </div>
            </div>

            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 py-2.5 text-[10px] sm:text-xs uppercase tracking-[0.4em] text-accent mb-8 shadow-2xl">
              <ShieldCheck className="h-4 w-4 animate-pulse" />
              Official Technology & Travel Node
            </div>

            <h1 className="text-white text-4xl sm:text-7xl md:text-8xl font-black italic uppercase leading-[0.9] max-w-5xl drop-shadow-2xl px-4 tracking-tighter mb-8">
              Engineering the <span className="text-gradient-warm">Future of Africa.</span>
            </h1>

            <p className="text-base sm:text-xl md:text-2xl text-white/80 max-w-3xl leading-relaxed font-medium px-6 mb-12">
              My World Africa Ltd builds professional software and organizes the best travel adventures across the continent.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center px-8">
              <Link to="/events" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-warm-gradient text-black shadow-glow hover:scale-105 transition-all duration-300 h-20 px-12 text-xl font-black uppercase tracking-widest rounded-2xl">
                   Join the Tribe
                </Button>
              </Link>
              <Link to="/services" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-20 px-12 text-xl border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-xl transition-all duration-300 font-black uppercase tracking-widest rounded-2xl">
                  Our Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Services Grid */}
      <section className="py-32 px-6 bg-black relative">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-24">
             <div className="max-w-2xl">
               <div className="text-xs uppercase tracking-[0.4em] text-accent font-black mb-4">Core Capabilities</div>
               <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">Dual-Core Operations</h2>
             </div>
             <p className="text-white/40 max-w-sm text-lg font-medium">
               We bridge the gap between high-end software engineering and continental exploration.
             </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
             <DivisionTile
                icon={Code}
                title="Technology"
                subtitle="Build & Secure"
                desc="Custom enterprise software, cybersecurity audits, and scalable cloud systems designed for the modern African landscape."
                items={["Software Engineering", "Cybersecurity", "DevOps", "Digital Marketing"]}
                color="border-white/5 bg-white/[0.02] hover:border-accent/40"
             />
             <DivisionTile
                icon={MapPin}
                title="Travel"
                subtitle="Explore Africa"
                desc="Connecting a continental community of riders and drivers through curated events and cross-border expeditions."
                items={["Adventure Rallies", "4x4 Convoys", "Route Planning", "Expeditions"]}
                color="border-white/5 bg-white/[0.02] hover:border-accent/40"
             />
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-32 px-6 bg-zinc-950/50 relative overflow-hidden">
         <div className="mx-auto max-w-7xl">
            <div className="text-center mb-24">
               <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter">Engineered Success</h2>
               <p className="text-white/40 mt-6 max-w-xl mx-auto font-medium text-xl">
                  Professional platforms built and managed by My World Africa Ltd.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               <ProjectTile
                  title="Justice Ultimate"
                  tag="Car Dealer"
                  img="/back 1.png"
                  link="https://www.justiceultimateautomobiles.com"
                  desc="Enterprise system for automobile sales and financing."
               />
               <ProjectTile
                  title="Justice Logistics"
                  tag="Car Rentals"
                  img="/backg2.png"
                  link="https://www.justicecorporatelogistics.co.ke"
                  desc="High-performance rental and fleet management platform."
               />
               <ProjectTile
                  title="Justice Automotive"
                  tag="Marketplace"
                  img="/all.png"
                  link="https://www.justiceautomotive.co.ke"
                  desc="Continental vehicle marketplace and data engine."
               />
            </div>

            <div className="mt-20 text-center">
               <Link to="/about">
                  <Button variant="link" className="text-accent font-black uppercase tracking-widest text-sm hover:gap-4 transition-all flex items-center mx-auto">
                    View Full Portfolio <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
               </Link>
            </div>
         </div>
      </section>

      {/* Tribes Section */}
      <section className="py-32 px-6 bg-black">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24">
            <div className="text-center md:text-left">
              <div className="text-xs uppercase tracking-[0.4em] text-primary font-black mb-4">Community Core</div>
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">Find Your Tribe</h2>
            </div>
            <p className="text-xl text-white/50 font-medium max-w-md text-center md:text-right">
              Join thousands of explorers writing the next chapter of African travel.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Tribe img={ridersImg} tag="Riders" title="Motorcycle Trips" desc="Fun weekend rides and long trips across borders on two wheels." />
            <Tribe img={driversImg} tag="Drivers" title="4x4 Adventures" desc="Off-road car meets and group safari trips in 4x4 vehicles." />
            <Tribe img={explorersImg} tag="Explorers" title="Culture & Stories" desc="For people who love photography, nature, and discovering local cultures." />
          </div>
        </div>
      </section>

      {/* Clean Call to Action */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="relative overflow-hidden rounded-[4rem] p-16 md:p-32 bg-white/[0.03] border border-white/10 shadow-2xl flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 p-20 opacity-5 rotate-12">
            <Globe className="h-64 w-64" />
          </div>

          <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] mb-10 relative z-10">
            Ready to build <br /> or <span className="text-accent">explore?</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/60 font-medium max-w-2xl mb-12 relative z-10">
            Establish a connection with our technology core or join the next mission into the wild.
          </p>

          <div className="flex gap-6 flex-wrap justify-center relative z-10">
            <Link to="/auth">
              <Button size="lg" className="h-20 px-12 bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-sm rounded-2xl shadow-2xl transition-transform hover:scale-105">
                Establish Connection
              </Button>
            </Link>
            <a href="https://wa.me/254701460110" target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="h-20 px-12 border-accent bg-accent/5 text-accent hover:bg-accent hover:text-black font-black uppercase tracking-widest text-sm rounded-2xl transition-all hover:scale-105">
                <MessageSquare className="mr-2 h-5 w-5 fill-current" /> WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function DivisionTile({ icon: Icon, title, subtitle, desc, items, color }: any) {
   return (
      <div className={`p-12 rounded-[3.5rem] border transition-all duration-500 group flex flex-col justify-between min-h-[450px] ${color}`}>
         <div>
            <div className="flex items-center justify-between mb-10">
               <div className="h-16 w-16 rounded-2xl bg-white/5 grid place-items-center text-accent group-hover:bg-accent group-hover:text-black transition-all">
                  <Icon className="h-8 w-8" />
               </div>
               <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-white/60 transition-colors">{subtitle}</div>
            </div>
            <h3 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter mb-8 group-hover:text-accent transition-colors">{title}</h3>
            <p className="text-white/50 font-medium text-lg leading-relaxed mb-10 group-hover:text-white/80 transition-colors">{desc}</p>
         </div>
         <div className="flex flex-wrap gap-2">
            {items.map((item: string) => (
               <span key={item} className="px-5 py-2 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition-colors">{item}</span>
            ))}
         </div>
      </div>
   );
}

function ProjectTile({ title, tag, img, link, desc }: any) {
   return (
      <a href={link} target="_blank" rel="noreferrer" className="group block relative aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
         <img src={img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-30 group-hover:opacity-100" alt={title} />
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
         <div className="absolute inset-x-0 bottom-0 p-10 flex flex-col justify-end">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3">{tag}</div>
            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">{title}</h3>
            <p className="text-base text-white/40 line-clamp-2 font-medium group-hover:text-white transition-colors leading-relaxed">{desc}</p>
         </div>
      </a>
   );
}

function Tribe({ img, tag, title, desc }: { img: string; tag: string; title: string; desc: string }) {
  return (
    <div className="group relative overflow-hidden rounded-[3rem] aspect-[3/4] shadow-2xl border border-white/10">
      <img src={img} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-x-0 bottom-0 p-10 text-white transform transition-transform duration-500 group-hover:-translate-y-4">
        <div className="inline-block rounded-full bg-accent px-5 py-1.5 text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg text-black">
          {tag}
        </div>
        <h3 className="text-3xl font-black uppercase italic tracking-tighter drop-shadow-md leading-tight mb-4">{title}</h3>
        <p className="text-sm text-white/60 leading-relaxed font-medium line-clamp-2 group-hover:line-clamp-none transition-all">{desc}</p>
      </div>
    </div>
  );
}
