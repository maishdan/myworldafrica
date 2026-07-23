import { createFileRoute } from "@tanstack/react-router";
import { Heart, MessageCircle, Share2, MapPin } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { shorts } from "@/lib/mockData";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "The Feed · MyWorldAfrica" },
      { name: "description", content: "Shorts, vlogs and memories from riders, drivers and explorers all across Africa." },
      { property: "og:title", content: "The Feed · MyWorldAfrica" },
      { property: "og:description", content: "Shorts, vlogs and memories from African adventurers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Feed,
});

function Feed() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 pt-28 pb-16">
        <header className="mb-10 max-w-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3">
            Shorts · Vlogs · Memories
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">The Feed</h1>
          <p className="mt-3 text-muted-foreground">
            The pulse of the continent — freshly uploaded moments from the road.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shorts.map((s) => (
            <article key={s.id} className="group rounded-2xl overflow-hidden bg-card border border-border shadow-warm hover:shadow-glow transition-all">
              <div className="relative aspect-[9/12] overflow-hidden">
                <img src={s.image} alt={s.caption} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3 rounded-full bg-black/50 backdrop-blur px-3 py-1 text-xs text-white inline-flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" /> {s.location}
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-9 w-9 rounded-full bg-warm-gradient grid place-items-center text-sm font-bold text-primary-foreground">
                      {s.author.charAt(0)}
                    </div>
                    <div className="leading-tight">
                      <div className="font-semibold text-sm">{s.author}</div>
                      <div className="text-xs text-white/70">{s.handle}</div>
                    </div>
                  </div>
                  <p className="text-sm text-white/90 line-clamp-3">{s.caption}</p>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3 text-sm text-muted-foreground">
                <button className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                  <Heart className="h-4 w-4" /> {s.likes.toLocaleString()}
                </button>
                <button className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                  <MessageCircle className="h-4 w-4" /> {s.comments}
                </button>
                <button className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
