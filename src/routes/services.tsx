import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Code, ShieldCheck, Database, Search, Smartphone, Briefcase,
  Car, MapPin, Camera, Users, Zap, Globe, Cpu, Layout,
  BarChart3, Settings, Shield, Laptop, Terminal, Server, Heart, Sun, Droplets,
  Plane, Tent, Building, Bus, FileText, Wine, Compass, Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Divisions & Services | My World Africa Ltd" },
      {
        name: "description",
        content: "Explore My World Africa Ltd's core divisions: Enterprise Software Engineering, Overland Tours & Travel, and our Humanitarian Impact Foundation.",
      },
      { name: "keywords", content: "Software Engineering Nairobi, Cybersecurity Kenya, Overland Tours Africa, Safari Travel Agency, Impact Philanthropy, PBO Kenya, Enterprise Systems" }
    ],
  }),
  component: ServicesPage,
});

const travelServices = [
  {
    icon: Plane,
    title: "Air Travel & Aviation",
    items: [
      "International air ticketing",
      "Domestic scheduled flights (Wilson Airport)",
      "Private charter flights",
      "Helicopter charters & aerial safaris",
      "Airport transfers & VIP lounge",
      "Medical evacuation flights"
    ]
  },
  {
    icon: Tent,
    title: "Safari & Wildlife",
    items: [
      "Private 4×4 safaris",
      "Group joining safaris",
      "Tailor-made itineraries",
      "Game drives & walking safaris",
      "Balloon safaris",
      "Photographic & birdwatching tours"
    ]
  },
  {
    icon: Building,
    title: "Accommodation",
    items: [
      "Lodge & camp bookings",
      "Hotel reservations",
      "Private villas & homestays",
      "Apartment & serviced stays",
      "Room upgrades & special requests",
      "Last-minute availability sourcing"
    ]
  },
  {
    icon: Bus,
    title: "Ground Transport",
    items: [
      "Airport transfers (JKIA, Wilson, Moi)",
      "Car hire (self-drive or chauffeur)",
      "SGR train bookings",
      "Luxury coach & shuttle services",
      "Professional driver-guides",
      "Boat & dhow transfers"
    ]
  },
  {
    icon: FileText,
    title: "Travel Documentation",
    items: [
      "Visa assistance (eTA, Tourist Visa)",
      "Passport & document checks",
      "Travel insurance",
      "Yellow fever & vaccination guidance",
      "Entry/exit form support",
      "Minor & unaccompanied travel paperwork"
    ]
  },
  {
    icon: Users,
    title: "Corporate & MICE",
    items: [
      "Corporate travel management",
      "Conferences & conventions",
      "Incentive travel & team retreats",
      "Meetings & workshops",
      "Events & exhibitions",
      "Executive/VIP travel"
    ]
  },
  {
    icon: Wine,
    title: "Special-Interest & Lifestyle",
    items: [
      "Honeymoon & anniversary packages",
      "Destination weddings",
      "Golf safaris",
      "Adventure tourism (hiking, rafting)",
      "Diving, snorkelling & fishing",
      "Wellness & spa retreats"
    ]
  },
  {
    icon: Compass,
    title: "Concierge & Trip Support",
    items: [
      "24/7 in-trip support",
      "Itinerary design & costing",
      "Multi-country coordination",
      "Restaurant & activity reservations",
      "Weather & season advisory",
      "Accessibility travel"
    ]
  },
  {
    icon: Gift,
    title: "Peak-Season Add-Ons",
    items: [
      "Festive bush & beach packages",
      "Special festive dinners",
      "New Year's Eve events",
      "Family reunion travel",
      "Peak-season flight/helo priority",
      "Gift vouchers & travel gifts"
    ]
  }
];

const techServices = [
  {
    icon: Code,
    title: "Software Engineering",
    items: [
      "Custom Web Applications",
      "Mobile App Development",
      "Enterprise Systems (ERP/CRM)",
      "API Integrations & Development",
      "Database Architecture",
      "Legacy System Migration"
    ]
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    items: [
      "Vulnerability Assessments",
      "Penetration Testing",
      "Security Audits & Compliance",
      "Data Encryption Strategies",
      "Threat Intelligence",
      "Incident Response Planning"
    ]
  },
  {
    icon: Database,
    title: "Cloud Infrastructure",
    items: [
      "Cloud Architecture Design",
      "AWS/Azure/GCP Deployment",
      "Serverless Operations",
      "DevOps Automation (CI/CD)",
      "Database Hosting & Backups",
      "Disaster Recovery Systems"
    ]
  },
  {
    icon: Search,
    title: "Digital Marketing & SEO",
    items: [
      "Search Engine Optimization",
      "Pay-Per-Click Campaigns",
      "Social Media Management",
      "Content Strategy & Copywriting",
      "Analytics & Reporting",
      "Conversion Rate Optimization"
    ]
  },
  {
    icon: Briefcase,
    title: "Branding & Design",
    items: [
      "Corporate Identity Design",
      "UI/UX Design for Apps",
      "Website Wireframing",
      "Logo & Asset Creation",
      "Brand Guidelines",
      "Marketing Materials Design"
    ]
  },
  {
    icon: Settings,
    title: "IT Consulting",
    items: [
      "Technology Roadmapping",
      "Digital Transformation",
      "System Architecture Review",
      "Vendor & Software Selection",
      "Project Management",
      "IT Cost Optimization"
    ]
  }
];

const philanthropyServices = [
  {
    icon: Sun,
    title: "Solar Energy Integration",
    items: [
      "Rural School Electrification",
      "Off-grid Community Lighting",
      "Solar Panel Procurement",
      "Installation & Maintenance",
      "Battery Storage Systems",
      "Renewable Energy Education"
    ]
  },
  {
    icon: Droplets,
    title: "Clean Water Access",
    items: [
      "Solar-Powered Boreholes",
      "Water Purification Systems",
      "Community Water Tanks",
      "Irrigation Systems",
      "Sanitation Solutions",
      "Water Resource Management"
    ]
  },
  {
    icon: Users,
    title: "Community Support",
    items: [
      "Local Employment Creation",
      "Educational Sponsorships",
      "Healthcare Supply Drops",
      "Youth Mentorship Programs",
      "Disaster Relief Operations",
      "Small Business Grants"
    ]
  }
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out transform h-full ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-95"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300 font-sans selection:bg-accent selection:text-black relative">
      {/* Clean Tech Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <SiteNav />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden border-b border-white/10 pt-20">
        <div className="absolute inset-0 w-full h-full object-cover opacity-20 bg-[url('/all.png')] bg-cover bg-center mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]" />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="inline-flex items-center gap-3 border border-accent/40 bg-accent/5 backdrop-blur-sm px-5 py-1.5 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-accent mb-6">
            <Terminal className="h-3.5 w-3.5" />
            Tech, Travel & Impact
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold uppercase tracking-tight text-white leading-[0.9] mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-500">Divisions</span>
          </h1>
          <p className="text-sm md:text-lg text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
            From architecting enterprise software to leading continental expeditions and funding community relief. We provide a comprehensive service catalogue.
          </p>
        </div>
      </section>

      {/* Motto Banner */}
      <div className="w-full bg-accent text-black py-5 overflow-hidden border-y border-accent/20 shadow-[0_0_30px_rgba(255,165,0,0.15)] relative z-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs md:text-sm font-black uppercase tracking-[0.4em] drop-shadow-sm">
            MY WORLD AFRICA - DISCOVER THE BEAUTY OF AFRICA, ONE JOURNEY AT A TIME
          </p>
        </div>
      </div>

      {/* Travel Services (The 9 Categories) */}
      <section className="py-32 px-6 relative border-b border-white/10 bg-[#060606]">
        <div className="mx-auto max-w-7xl">
          <header className="mb-20 text-center">
            <div className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-4">Expeditions</div>
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white mb-6">Travel Division</h2>
            <p className="text-zinc-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
              We sell coordination, not just components. We connect flights, safaris, ground transport, accommodation, paperwork, and 24/7 support into one seamless itinerary.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelServices.map((service, index) => (
              <ServiceTile key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Technology Services */}
      <section className="py-32 px-6 relative border-b border-white/10 bg-[#030303]">
        <div className="mx-auto max-w-7xl">
          <header className="mb-20 text-center">
            <div className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-4">Build & Secure</div>
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white mb-6">Tech Division</h2>
            <p className="text-zinc-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
              We build secure and reliable technology for businesses. From custom applications to full cybersecurity audits and cloud deployment.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techServices.map((service, index) => (
              <ServiceTile key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Humanitarian Impact Services */}
      <section className="py-32 px-6 relative border-b border-white/10 bg-[#060606] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/explorers.jpg')] bg-cover bg-center opacity-5 mix-blend-luminosity" />
        <div className="mx-auto max-w-7xl relative z-10">
          <header className="mb-20 text-center">
            <div className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-4 flex items-center justify-center gap-2">
               <Heart className="h-3 w-3" /> Philanthropy
            </div>
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white mb-6">Impact Foundation</h2>
            <p className="text-zinc-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
              Our registered PBO initiative. We channel resources into off-grid communities, ensuring sustainable development alongside our commercial success.
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-6">
            {philanthropyServices.map((service, index) => (
              <ServiceTile key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              Ready to <span className="text-accent">Initiate?</span>
            </h2>
            <p className="text-sm md:text-base text-zinc-400 font-light max-w-xl mb-10 relative z-10">
              Whether you need to architect a new enterprise system or plan a cross-continental African adventure, we are standing by.
            </p>

            <div className="flex gap-4 flex-wrap justify-center relative z-10">
              <Button size="lg" className="h-14 px-8 bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-xs rounded-none border border-white transition-all">
                Start Tech Project
              </Button>
              <Link to="/events">
                <Button size="lg" variant="outline" className="h-14 px-8 border-accent/50 bg-accent/5 text-accent hover:bg-accent hover:text-black font-bold uppercase tracking-widest text-xs rounded-none transition-all">
                  Explore Tours
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

function ServiceTile({ service, index }: { service: any, index: number }) {
  return (
    <FadeIn delay={(index % 3) * 150}>
      <div className="p-8 border border-white/10 bg-[#0a0a0a] hover:border-accent/40 transition-colors h-full flex flex-col group relative">
        {/* Tech corner accent */}
        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-accent/0 group-hover:border-accent transition-colors"></div>

        <service.icon className="h-10 w-10 text-accent mb-6 opacity-80 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-6">{service.title}</h3>

        <ul className="space-y-4 flex-1">
          {service.items.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-accent/50 group-hover:bg-accent shrink-0 transition-colors" />
              <span className="text-xs text-zinc-400 font-light leading-relaxed group-hover:text-zinc-300 transition-colors">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </FadeIn>
  );
}
