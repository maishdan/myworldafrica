import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, HardHat, Fuel, Radio, HeartPulse, CloudRain, Phone } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { CONTACT, telHref } from "@/lib/contact";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety on the Road | My World Africa Rider & Driver Safety Guide" },
      {
        name: "description",
        content:
          "Practical safety guidance for African road trips: gear checklists, convoy discipline, fuel and water planning, comms, weather, border paperwork and emergency contacts.",
      },
      { property: "og:title", content: "Safety on the Road — My World Africa" },
      {
        property: "og:description",
        content:
          "Gear, convoy rules, fuel planning, comms and emergency protocol for every My World Africa expedition.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SafetyPage,
});

const rules = [
  {
    icon: HardHat,
    title: "Gear is non-negotiable",
    text: "Helmet, gloves, boots and armoured jacket on every ride — no exceptions, even for short town runs. Drivers: seatbelts, fire extinguisher, recovery straps and a working jack.",
  },
  {
    icon: Radio,
    title: "Ride your own ride",
    text: "Never ride or drive beyond your skill to keep up with a group. Keep a two-second gap, stagger formation, and signal hazards down the line.",
  },
  {
    icon: Fuel,
    title: "Fuel, water, spares",
    text: "Plan fuel for 1.5x the longest gap between stations. Carry 3 litres of water per person per day, a tube/patch kit, tyre plugs and a compressor.",
  },
  {
    icon: CloudRain,
    title: "Respect the weather",
    text: "Rainy-season murram turns to grease. Check forecasts, avoid night riding, and never cross flowing water you can't walk.",
  },
  {
    icon: HeartPulse,
    title: "Medical & comms",
    text: "One first-aid kit per group minimum, plus a satellite messenger or offline maps on remote routes. Share your route with someone not on the trip.",
  },
  {
    icon: ShieldCheck,
    title: "Paperwork & borders",
    text: "Carry licence, insurance, logbook, Carnet where required, and passport copies. Photograph everything and keep a cloud backup.",
  },
];

function SafetyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteNav />

      <section className="relative overflow-hidden pt-32 pb-20">
        <img src="/backg2.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <ShieldCheck className="mx-auto h-14 w-14 text-accent mb-6" />
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
            Safety on the <span className="text-accent">road</span>
          </h1>
          <p className="mt-8 text-lg text-white/70 font-medium leading-relaxed">
            Every My World Africa event follows the same baseline. Read it before you roll out — it's
            what keeps the tribe coming home.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rules.map((r) => (
          <div key={r.title} className="rounded-[2.5rem] border border-white/10 bg-white/5 p-10">
            <r.icon className="h-8 w-8 text-accent mb-6" />
            <h2 className="text-xl font-black uppercase italic tracking-tighter leading-tight">
              {r.title}
            </h2>
            <p className="mt-4 text-sm text-white/50 leading-relaxed font-medium">{r.text}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-32">
        <div className="rounded-[3rem] border border-accent/30 bg-accent/10 p-10 md:p-14 text-center">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">
            Emergency on a My World Africa event?
          </h2>
          <p className="mt-4 text-white/70 font-medium">
            Call the ride marshal line immediately — day or night.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href={telHref}>
              <Button className="h-16 px-10 rounded-2xl bg-warm-gradient text-black font-black uppercase tracking-widest text-xs">
                <Phone className="h-5 w-5 mr-3" /> {CONTACT.phoneDisplay}
              </Button>
            </a>
            <Link to="/contact">
              <Button
                variant="outline"
                className="h-16 px-10 rounded-2xl border-white/20 bg-white/5 font-black uppercase tracking-widest text-xs hover:bg-white/10"
              >
                All contact options
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
