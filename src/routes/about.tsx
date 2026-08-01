import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Users, Globe, Zap } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About My World Africa | Our Story, Mission & Community" },
      {
        name: "description",
        content:
          "My World Africa connects riders, drivers and explorers across all 54 African countries — hosting rallies, safaris and expeditions, and telling the continent's stories from the saddle.",
      },
      { property: "og:title", content: "About My World Africa" },
      {
        property: "og:description",
        content:
          "Who we are: a community of riders, drivers and explorers mapping Africa from Cape to Cairo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteNav />

      <section className="relative overflow-hidden pt-32 pb-20">
        <img src="/all.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-6">
            Our story
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
            We map Africa <span className="text-accent">from the saddle</span>
          </h1>
          <p className="mt-8 text-lg text-white/70 font-medium leading-relaxed">
            My World Africa started as a handful of riders chasing dust roads out of Nairobi. Today
            it's a continental community of riders, drivers and explorers who host events, share
            routes, and prove that the best way to understand Africa is to travel it yourself.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Value icon={Zap} title="Riders" text="Weekend runs, cross-border rallies and long-haul expeditions on two wheels." />
        <Value icon={Compass} title="Drivers" text="4x4 convoys, offroad meets and overland routes built for four wheels." />
        <Value icon={Globe} title="Explorers" text="Trekkers, photographers and food hunters chasing culture and stories." />
        <Value icon={Users} title="Community" text="Free to join, always. Every event is hosted by real people on the ground." />
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-32 space-y-10">
        <Block title="What we do">
          We help hosts publish rallies, safaris and meetups with ticketing and audience targeting,
          and we help travellers find the right adventure for their machine, budget and skill level.
        </Block>
        <Block title="Why it matters">
          Africa is 54 countries of wildly different roads, permits, weather and cultures. Local
          knowledge is the difference between a great trip and a stranded one — so we put that
          knowledge in one place, shared by people who've actually ridden it.
        </Block>
        <div className="flex flex-wrap gap-4">
          <Link to="/events">
            <Button className="h-14 px-10 rounded-2xl bg-warm-gradient text-black font-black uppercase tracking-widest text-xs">
              Explore events
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              variant="outline"
              className="h-14 px-10 rounded-2xl border-white/20 bg-white/5 font-black uppercase tracking-widest text-xs hover:bg-white/10"
            >
              Talk to us
            </Button>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Value({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
      <Icon className="h-8 w-8 text-accent mb-6" />
      <div className="text-xl font-black uppercase italic tracking-tighter">{title}</div>
      <p className="mt-3 text-sm text-white/50 leading-relaxed font-medium">{text}</p>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4 flex items-center gap-4">
        <span className="w-10 h-1 bg-accent rounded-full" /> {title}
      </h2>
      <p className="text-white/60 leading-relaxed font-medium text-lg">{children}</p>
    </div>
  );
}
