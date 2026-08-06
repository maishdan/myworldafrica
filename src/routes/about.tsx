import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Target, Eye, Rocket, Users, Award, Shield, Globe, Cpu, Mail, MapPin, Phone, CheckCircle2, ChevronRight, Zap, History, Building2, Flag, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | My World Africa Ltd - Technology & Travel" },
      {
        name: "description",
        content: "Learn about My World Africa Ltd. We build great software and lead amazing tours across Africa.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-accent selection:text-black">
      <SiteNav />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img src="/back 1.png" className="absolute inset-0 w-full h-full object-cover opacity-50" alt="About Hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-accent mb-6 shadow-2xl">
            <Zap className="h-3 w-3 animate-pulse" />
            Our Vision & Journey
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-6">
            The Story of My World Africa
          </h1>
          <p className="text-xl md:text-2xl text-white/70 font-medium max-w-2xl mx-auto leading-relaxed">
            We build high-quality technology and lead exciting travel adventures across the African continent.
          </p>
        </div>
      </section>

      {/* Rebranding Section */}
      <section className="bg-white/[0.02] border-y border-white/5 py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <div className="mx-auto max-w-7xl">
           <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="flex items-start gap-8 max-w-3xl">
                 <div className="h-20 w-20 rounded-[2rem] bg-accent grid place-items-center text-black shrink-0 shadow-glow">
                    <History className="h-10 w-10" />
                 </div>
                 <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Evolution of Excellence</h2>
                    <p className="text-white/60 text-xl font-medium leading-relaxed">
                       My World Africa Ltd is the official new name for <span className="text-accent font-bold italic">Online World Kenya</span>.
                       We have expanded our mission from a local tech hub to a continental leader in engineering and exploration.
                    </p>
                 </div>
              </div>
              <div className="flex flex-col gap-4 w-full lg:w-auto">
                 <div className="bg-white/5 border border-white/10 px-8 py-6 rounded-3xl">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-1">Entity Status</div>
                    <div className="text-lg font-black text-accent uppercase tracking-wider">Active & Compliant</div>
                 </div>
                 <div className="bg-white/5 border border-white/10 px-8 py-6 rounded-3xl">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-1">Operational Hub</div>
                    <div className="text-lg font-black text-white uppercase tracking-wider">Nairobi, Kenya</div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* CEO Section */}
      <section className="py-32 px-6 relative overflow-hidden">
         <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-20 items-center">
            <div className="relative group">
               <div className="aspect-[4/5] rounded-[4rem] overflow-hidden border border-white/10 relative z-10 shadow-2xl">
                  <img src="/auth 1.png" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="CEO" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
               </div>
               <div className="absolute -bottom-10 -right-10 bg-accent p-10 rounded-[3rem] shadow-glow z-20">
                  <div className="text-4xl font-black text-black leading-none italic">15+</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-black/60 mt-1">Specialists</div>
               </div>
            </div>

            <div className="space-y-10">
               <div className="space-y-4">
                  <div className="text-xs uppercase tracking-[0.4em] text-accent font-black">Visionary Founder & CEO</div>
                  <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">Daniel Maina</h2>
               </div>
               <p className="text-2xl text-white/60 leading-relaxed font-medium italic">
                 "I am dedicated to building the next generation of digital infrastructure in Africa. We focus on security, scalability, and quality in everything we build."
               </p>
               <div className="flex flex-wrap gap-4">
                  <Badge icon={ShieldCheck} label="Systems Architect" />
                  <Badge icon={Globe} label="Explorer" />
                  <Badge icon={Cpu} label="Cybersecurity" />
               </div>
            </div>
         </div>
      </section>

      {/* Mission & Vision Nodes */}
      <section className="py-32 px-6 bg-zinc-950/50">
         <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-12">
            <NodeBox
               icon={Target}
               title="Our Mission"
               desc="To build great technology and travel experiences that help businesses succeed and help people discover the beauty of Africa."
            />
            <NodeBox
               icon={Eye}
               title="Our Vision"
               desc="To be Africa's leading technology and travel company, known everywhere for engineering excellence and a strong community."
            />
         </div>
      </section>

      {/* Verified Ecosystem */}
      <section className="py-32 px-6">
         <div className="mx-auto max-w-7xl">
            <div className="text-center mb-24">
               <div className="text-xs uppercase tracking-[0.4em] text-accent font-black mb-4">The Portfolio</div>
               <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">Engineered Success</h2>
               <p className="text-white/40 mt-8 max-w-2xl mx-auto font-medium text-xl leading-relaxed">
                 We have successfully built and launched these verified enterprise platforms.
               </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               <ProjectMiniCard title="My World Africa" link="https://share.google/u0jTWg7wWy81I8EdA" />
               <ProjectMiniCard title="Justice Ultimate" link="https://www.justiceultimateautomobiles.com" />
               <ProjectMiniCard title="Justice Automotive" link="https://www.justiceautomotive.co.ke" />
               <ProjectMiniCard title="Justice Logistics" link="https://www.justicecorporatelogistics.co.ke" />
               <ProjectMiniCard title="Stepping To Destiny" link="https://share.google/DVwqFaCwTrcMW5utj" />
               <ProjectMiniCard title="Titan X Series" link="https://onlineworldke.vercel.app/" status="In Progress" />
            </div>
         </div>
      </section>

      {/* Simplified Contact Node */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="bg-white/[0.03] border border-white/10 rounded-[4rem] p-16 md:p-24 shadow-2xl flex flex-col items-center text-center">
            <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-tight mb-12">Establish <br/> <span className="text-accent">Connection</span></h2>

            <div className="grid sm:grid-cols-2 gap-12 w-full max-w-3xl mb-16">
               <div className="space-y-3">
                  <Mail className="h-10 w-10 text-accent mx-auto mb-4" />
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Official Email</div>
                  <div className="text-xl font-bold">daniwesttechnologies@gmail.com</div>
               </div>
               <div className="space-y-3">
                  <Phone className="h-10 w-10 text-accent mx-auto mb-4" />
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Direct Line</div>
                  <div className="text-xl font-bold">+254 701 460 110</div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
               <a href="https://wa.me/254701460110" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-20 px-12 bg-accent text-black font-black uppercase tracking-widest text-sm rounded-2xl shadow-glow hover:scale-105 transition-all">
                     <MessageSquare className="mr-3 h-5 w-5 fill-current" /> WhatsApp CEO
                  </Button>
               </a>
               <Link to="/auth" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto h-20 px-12 border-white/10 bg-white/5 font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/10 transition-all hover:scale-105">
                     Join Recruitment Core
                  </Button>
               </Link>
            </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function NodeBox({ icon: Icon, title, desc }: any) {
   return (
      <div className="p-16 rounded-[4rem] bg-white/[0.02] border border-white/5 hover:border-accent/30 transition-all group">
         <div className="h-20 w-20 rounded-3xl bg-white/5 grid place-items-center text-accent mb-10 group-hover:bg-accent group-hover:text-black transition-all">
            <Icon className="h-10 w-10" />
         </div>
         <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-6 group-hover:text-accent transition-colors">{title}</h3>
         <p className="text-white/50 text-xl leading-relaxed font-medium group-hover:text-white/80 transition-colors">{desc}</p>
      </div>
   );
}

function DNACard({ label }: { label: string }) {
   return (
      <div className="p-8 bg-white/5 border border-white/5 rounded-3xl hover:bg-accent hover:text-black transition-all duration-300 text-center">
         <div className="text-sm font-black uppercase tracking-[0.2em]">{label}</div>
      </div>
   );
}

function ProjectMiniCard({ title, link, status }: any) {
   return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all group flex flex-col justify-between h-[280px]">
         <h4 className="text-3xl font-black uppercase italic tracking-tighter leading-[0.9] group-hover:text-accent transition-colors">{title}</h4>
         <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>
               {status || 'Live & Verified'}
            </div>
            <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-accent group-hover:translate-x-2 transition-all" />
         </div>
      </a>
   );
}

function Badge({ icon: Icon, label }: any) {
   return (
      <div className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60">
         <Icon className="h-4 w-4 text-accent" /> {label}
      </div>
   );
}
