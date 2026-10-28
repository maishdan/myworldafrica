import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Play, Ticket, Users, Video, Route as RouteIcon, Sparkles, Code, ShieldCheck, Cpu, Globe, Car, BarChart3, Briefcase, Zap, Smartphone, Search, Database, ChevronRight, MessageSquare, Terminal, Server, Heart, Droplets, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import ridersImg from "@/assets/riders.jpg";
import driversImg from "@/assets/drivers.jpg";
import explorersImg from "@/assets/explorers.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My World Africa Ltd | Engineering, Travel & Impact Foundation" },
      {
        name: "description",
        content:
          "My World Africa Ltd: Premier Technology solutions, overland African Safari tours, and a dedicated Humanitarian Foundation bringing solar electricity and clean water to local communities.",
      },
      { name: "keywords", content: "African Safari, Tech Company Nairobi, Software Engineering Kenya, Volunteer Tourism Kenya, My World Africa PBO, Solar Electricity Kenya, Clean Water Africa, Overland tours Africa" },
      { property: "og:title", content: "My World Africa Ltd | Engineering, Travel & Impact Foundation" },
      { property: "og:description", content: "Building great software, leading amazing tours across the continent, and funding community relief projects." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300 font-sans selection:bg-accent selection:text-black relative">
      {/* Clean Tech Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <SiteNav />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] w-full flex items-center justify-center border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 h-full w-full object-cover opacity-60 bg-[url('/back%201.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-[#030303]/40" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-12 flex flex-col items-center">
            {/* Tech Logo Area */}
            <div className="flex flex-col items-center justify-center mb-10">
              <img
                src="/logo.png"
                alt="My World Africa Logo"
                className="h-28 sm:h-40 w-auto object-contain mb-8 drop-shadow-[0_0_15px_rgba(255,165,0,0.3)]"
              />
            </div>

            {/* Official Node Badge */}
            <div className="inline-flex items-center gap-3 border border-accent/40 bg-accent/5 backdrop-blur-sm px-5 py-1.5 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-accent mb-10">
              <Terminal className="h-3.5 w-3.5" />
              Official Technology & Travel Node
            </div>

            <h1 className="text-white text-4xl sm:text-6xl md:text-7xl font-bold uppercase leading-tight max-w-5xl text-center tracking-tight mb-6">
              Engineering the <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-500">Future of Africa</span>
            </h1>

            <p className="text-base md:text-lg text-zinc-400 max-w-3xl text-center leading-relaxed font-light mb-12">
              My World Africa Ltd bridges the gap between high-performance software engineering and elite continental exploration. We architect robust enterprise systems and orchestrate premium adventures.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <Link to="/events" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-accent text-black hover:bg-accent/90 h-14 px-10 text-xs font-bold uppercase tracking-widest rounded-none border border-accent transition-all">
                   Initialize Network
                </Button>
              </Link>
              <Link to="/services" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-xs border-white/20 bg-black/40 text-white hover:bg-white/10 backdrop-blur-xl transition-all font-bold uppercase tracking-widest rounded-none">
                  View Infrastructure
                </Button>
              </Link>
            </div>
        </div>
      </section>

      {/* Modern Services Grid */}
      <section className="py-24 px-6 relative border-b border-white/10 bg-[#060606]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 border-l-2 border-accent pl-6">
             <div className="max-w-2xl">
               <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-3">Core Capabilities</div>
               <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white leading-tight">Dual-Core <br/> Operations</h2>
             </div>
             <p className="text-zinc-400 max-w-md text-sm font-light leading-relaxed">
               A professional synthesis of digital innovation and physical exploration. Our infrastructure supports scalable enterprise systems alongside cross-border travel operations.
             </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             <DivisionTile
                icon={Server}
                title="Technology Division"
                subtitle="Build & Secure"
                desc="Custom enterprise software, cybersecurity audits, and scalable cloud architecture engineered for the modern African landscape."
                items={["Software Engineering", "Cybersecurity", "DevOps", "Digital Marketing"]}
             />
             <DivisionTile
                icon={Globe}
                title="Travel Division"
                subtitle="Explore Africa"
                desc="Connecting a continental community of riders and drivers through curated events, detailed route planning, and cross-border expeditions."
                items={["Adventure Rallies", "4x4 Convoys", "Route Planning", "Expeditions"]}
             />
          </div>
        </div>
      </section>

      {/* Humanitarian Impact Section */}
      <section className="py-24 px-6 relative border-b border-white/10 bg-[#030303] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/explorers.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-[#030303]/80" />
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
             <div className="max-w-2xl border-l-2 border-accent pl-6">
               <div className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-3 flex items-center gap-2">
                 <Heart className="h-3 w-3" /> Impact Foundation (PBO)
               </div>
               <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white leading-tight">Beyond <br/> Exploration</h2>
             </div>
             <p className="text-zinc-400 max-w-md text-sm font-light leading-relaxed">
               A percentage of every tech contract and tour booking funds our humanitarian mission. We are dedicated to providing off-grid Kenyan communities with sustainable electricity and clean water.
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
             <div className="p-8 border border-white/10 bg-[#0a0a0a] group hover:border-accent/40 transition-colors">
                <Sun className="h-8 w-8 text-accent mb-6" />
                <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-3">Solar Power</h3>
                <p className="text-zinc-400 font-light text-xs leading-relaxed">Funding and installing solar panels to bring sustainable light and power to off-grid villages across Kenya.</p>
             </div>
             <div className="p-8 border border-white/10 bg-[#0a0a0a] group hover:border-accent/40 transition-colors">
                <Droplets className="h-8 w-8 text-accent mb-6" />
                <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-3">Clean Water</h3>
                <p className="text-zinc-400 font-light text-xs leading-relaxed">Building solar-powered water pumps and boreholes to ensure communities have access to safe, clean drinking water.</p>
             </div>
             <div className="p-8 border border-white/10 bg-accent/5 group hover:bg-accent/10 transition-colors flex flex-col justify-center items-center text-center">
                <h3 className="text-lg font-bold uppercase tracking-tight text-accent mb-4">Join The Mission</h3>
                <p className="text-zinc-400 font-light text-xs leading-relaxed mb-6">Partner with us. Your donations go directly towards our next community relief project.</p>
                <Link to="/impact">
                  <Button size="sm" className="bg-accent text-black hover:bg-accent/90 font-bold uppercase tracking-widest text-[10px] rounded-none px-8">
                    View Projects
                  </Button>
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 px-6 relative border-b border-white/10 bg-[#030303]">
         <div className="mx-auto max-w-7xl">
            <div className="mb-16 border-l-2 border-white/20 pl-6">
               <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-3">Portfolio</div>
               <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white">Engineered Success</h2>
               <p className="text-zinc-400 mt-4 max-w-xl font-light text-sm">
                  Professional platforms architected and maintained by My World Africa Ltd.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
               <ProjectTile
                  title="Justice Ultimate"
                  tag="Car Dealer Platform"
                  img="/back 1.png"
                  link="https://www.justiceultimateautomobiles.com"
                  desc="Enterprise management system for high-end automobile sales and financing."
               />
               <ProjectTile
                  title="Justice Logistics"
                  tag="Fleet Management"
                  img="/backg2.png"
                  link="https://www.justicecorporatelogistics.co.ke"
                  desc="High-performance rental tracking and corporate fleet management architecture."
               />
               <ProjectTile
                  title="Justice Automotive"
                  tag="Marketplace Data"
                  img="/all.png"
                  link="https://www.justiceautomotive.co.ke"
                  desc="Continental vehicle marketplace integrated with real-time analytics."
               />
            </div>

            <div className="mt-16 flex justify-end">
               <Link to="/about">
                  <Button variant="link" className="text-accent font-bold uppercase tracking-widest text-xs hover:gap-3 transition-all flex items-center pr-0">
                    Access Full Portfolio <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
               </Link>
            </div>
         </div>
      </section>

      {/* Tribes Section */}
      <section className="py-24 px-6 bg-[#060606] border-b border-white/10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 border-l-2 border-accent pl-6">
            <div className="max-w-2xl">
              <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-3">Community Protocol</div>
              <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white">Find Your Sector</h2>
            </div>
            <p className="text-sm text-zinc-400 font-light max-w-sm leading-relaxed">
              Integrate with thousands of explorers defining the next generation of African travel logistics.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Tribe img={ridersImg} tag="Sector A: Riders" title="Motorcycle Expeditions" desc="High-endurance routes and cross-border navigation designed exclusively for two wheels." />
            <Tribe img={driversImg} tag="Sector B: Drivers" title="4x4 Convoys" desc="Tactical off-road navigation and group safari deployments in 4x4 vehicles." />
            <Tribe img={explorersImg} tag="Sector C: Explorers" title="Cultural Mapping" desc="Documenting natural landscapes and local cultures through precision photography." />
          </div>
        </div>
      </section>

      {/* Clean Call to Action */}
      <section className="py-32 px-6 bg-[#030303]">
        <div className="mx-auto max-w-7xl">
          <div className="relative border border-white/10 bg-[#0a0a0a] p-12 md:p-24 flex flex-col items-center text-center overflow-hidden">
            {/* Tech accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-accent"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-accent"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-accent"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-accent"></div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <Cpu className="h-64 w-64" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white mb-6 relative z-10">
              Awaiting <span className="text-accent">Directives</span>
            </h2>
            <p className="text-sm md:text-base text-zinc-400 font-light max-w-xl mb-10 relative z-10">
              Establish a secure connection with our technology core or enroll in the next coordinated mission into the wild.
            </p>

            <div className="flex gap-4 flex-wrap justify-center relative z-10">
              <Link to="/auth">
                <Button size="lg" className="h-14 px-8 bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-xs rounded-none border border-white transition-all">
                  Initialize Connection
                </Button>
              </Link>
              <a href="https://wa.me/254701460110" target="_blank" rel="noreferrer">
                <Button size="lg" variant="outline" className="h-14 px-8 border-accent/50 bg-accent/5 text-accent hover:bg-accent hover:text-black font-bold uppercase tracking-widest text-xs rounded-none transition-all">
                  <MessageSquare className="mr-2 h-4 w-4" /> Secure Comms
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function DivisionTile({ icon: Icon, title, subtitle, desc, items }: any) {
   return (
      <div className="p-10 border border-white/10 bg-[#0a0a0a] hover:border-accent/50 transition-colors duration-300 group flex flex-col justify-between min-h-[400px] relative">
         {/* Tech corner accent */}
         <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-accent/0 group-hover:border-accent/100 transition-colors"></div>

         <div>
            <div className="flex items-center justify-between mb-8">
               <div className="h-12 w-12 border border-white/10 bg-[#050505] flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all">
                  <Icon className="h-5 w-5" />
               </div>
               <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600 group-hover:text-accent transition-colors">{subtitle}</div>
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-4">{title}</h3>
            <p className="text-zinc-400 font-light text-sm leading-relaxed mb-8">{desc}</p>
         </div>
         <div className="flex flex-wrap gap-2">
            {items.map((item: string) => (
               <span key={item} className="px-3 py-1.5 bg-[#050505] text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-300 border border-white/5">{item}</span>
            ))}
         </div>
      </div>
   );
}

function ProjectTile({ title, tag, img, link, desc }: any) {
   return (
      <a href={link} target="_blank" rel="noreferrer" className="group block relative aspect-[4/5] border border-white/10 overflow-hidden bg-[#0a0a0a]">
         <img src={img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-100" alt={title} />
         <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/80 to-transparent" />

         {/* Corner Accents */}
         <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-accent/0 group-hover:border-accent/100 transition-all z-20"></div>

         <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end z-10 border-t border-white/5 backdrop-blur-sm group-hover:border-accent/20 transition-colors">
            <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent mb-2">{tag}</div>
            <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-3">{title}</h3>
            <p className="text-xs text-zinc-400 line-clamp-2 font-light group-hover:text-zinc-300 transition-colors leading-relaxed">{desc}</p>
         </div>
      </a>
   );
}

function Tribe({ img, tag, title, desc }: { img: string; tag: string; title: string; desc: string }) {
  return (
    <div className="group relative overflow-hidden aspect-square border border-white/10 bg-[#0a0a0a]">
      <img src={img} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />

      {/* Top right indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-[8px] uppercase tracking-widest text-accent font-bold">Active</span>
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-8 text-white">
        <div className="inline-block border border-accent bg-accent/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest mb-4 text-accent backdrop-blur-sm">
          {tag}
        </div>
        <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-3">{title}</h3>
        <p className="text-xs text-zinc-400 leading-relaxed font-light line-clamp-2 group-hover:text-zinc-300 transition-colors">{desc}</p>
      </div>
    </div>
  );
}
