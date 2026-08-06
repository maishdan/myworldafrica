import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Code, ShieldCheck, Database, Search, Smartphone, Briefcase,
  Car, MapPin, Camera, Users, Zap, Globe, Cpu, Layout,
  BarChart3, Settings, Shield, Laptop, Terminal, Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services | My World Africa Ltd - Technology & Travel" },
      {
        name: "description",
        content: "We provide great tech services like software development and security, plus exciting tours across Africa.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <SiteNav />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img src="/all.png" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Services Hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-accent mb-6">
            Tech & Travel Solutions
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.9] mb-6">
            What We <span className="text-accent">Offer</span>
          </h1>
          <p className="text-xl text-white/70 font-medium max-w-2xl mx-auto leading-relaxed">
            From building high-quality software to leading tours across Africa, we have the skills to help you.
          </p>
        </div>
      </section>

      {/* Technology Services */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <header className="mb-16">
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">Tech Services</h2>
            <p className="text-white/40 mt-4 max-w-md font-medium text-lg">
              We build secure and reliable technology for businesses.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             <ServiceDetailCard
                icon={Code}
                title="Software Building"
                specs={["Websites", "Mobile Apps", "Business Systems"]}
                desc="We create custom apps and websites that are easy to use and help your business grow."
             />
             <ServiceDetailCard
                icon={ShieldCheck}
                title="Cybersecurity"
                specs={["Security Checks", "System Protection"]}
                desc="We protect your data and systems from hackers and other digital threats."
             />
             <ServiceDetailCard
                icon={Database}
                title="Cloud Services"
                specs={["Online Storage", "System Automation"]}
                desc="We help you store your data safely online and make your systems work faster."
             />
             <ServiceDetailCard
                icon={Search}
                title="Marketing & SEO"
                specs={["Google Search", "Online Ads"]}
                desc="We help more people find your business online using Google and other tools."
             />
             <ServiceDetailCard
                icon={Briefcase}
                title="Branding & Design"
                specs={["Logo Design", "Graphic Design"]}
                desc="We create professional logos and designs that make your brand look great."
             />
             <ServiceDetailCard
                icon={Settings}
                title="Tech Consulting"
                specs={["IT Advice", "System Planning"]}
                desc="We give expert advice on how to use technology to improve your business."
             />
          </div>
        </div>
      </section>

      {/* Travel Services */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="mx-auto max-w-7xl">
          <header className="mb-16">
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">Travel Services</h2>
            <p className="text-white/40 mt-4 max-w-md font-medium text-lg">
              Discover the beauty of Africa with our expert travel team.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8">
             <AdventureSection
                title="Motorcycle Tours"
                icon={Zap}
                desc="Join us for exciting bike trips across Africa. We plan everything so you can just enjoy the ride."
                features={["Weekend Rides", "Cross-border Trips"]}
                img="/back 1.png"
             />
             <AdventureSection
                title="Car Adventures"
                icon={Car}
                desc="Explore the continent in a 4x4. We organize group trips and safari convoys for car lovers."
                features={["Group Safaris", "Off-road Trips"]}
                img="/backg2.png"
             />
             <AdventureSection
                title="Photography & Culture"
                icon={Camera}
                desc="For those who love to take photos and learn about new cultures. We take you to the best spots."
                features={["Culture Tours", "Photo Spots"]}
                img="/explorers.jpg"
             />
             <AdventureSection
                title="Car Rentals"
                icon={Shield}
                desc="We partner with Justice Group to help you rent reliable cars for your own trips."
                features={["Rentals", "Fleet Support"]}
                img="/all.png"
             />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="bg-warm-gradient rounded-[3rem] p-12 md:p-24 text-black text-center space-y-8 shadow-glow">
             <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter">Ready to Start?</h2>
             <p className="text-xl md:text-2xl font-bold max-w-2xl mx-auto">
                Whether you need a new app or an African adventure, we are here to help.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Button className="bg-black text-white h-16 px-12 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform">Start Tech Project</Button>
                <Link to="/events">
                   <Button variant="outline" className="h-16 px-12 rounded-2xl border-black bg-transparent text-black font-black uppercase tracking-widest text-sm hover:bg-black/10 transition-transform">Explore Tours</Button>
                </Link>
             </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function ServiceDetailCard({ icon: Icon, title, specs, desc }: any) {
   return (
      <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-accent transition-all group flex flex-col h-full">
         <Icon className="h-10 w-10 text-accent mb-6" />
         <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 group-hover:text-accent transition-colors">{title}</h3>
         <p className="text-white/60 text-sm font-medium leading-relaxed mb-6 flex-1">{desc}</p>
         <ul className="space-y-2 border-t border-white/5 pt-6">
            {specs.map((s: string) => (
               <li key={s} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                  <div className="h-1 w-1 rounded-full bg-accent" /> {s}
               </li>
            ))}
         </ul>
      </div>
   );
}

function AdventureSection({ title, icon: Icon, desc, features, img }: any) {
   return (
      <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden border border-white/5 group">
         <img src={img} className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700" alt={title} />
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
         <div className="absolute inset-0 p-10 flex flex-col justify-end">
            <Icon className="h-10 w-10 text-accent mb-4" />
            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">{title}</h3>
            <p className="text-white/60 text-sm font-medium leading-relaxed mb-6 max-w-md">{desc}</p>
            <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               {features.map((f: string) => (
                  <span key={f} className="px-3 py-1.5 bg-accent/20 border border-accent/20 rounded-full text-[8px] font-black uppercase tracking-widest text-accent">{f}</span>
               ))}
            </div>
         </div>
      </div>
   );
}
