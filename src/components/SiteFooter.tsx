export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-2xl font-bold">
            My World <span className="text-gradient-warm">Africa</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            The community-driven platform for African explorers, riders, and drivers.
            Share your journey. Host events. Live the road.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Explore</div>
          <ul className="space-y-2 text-sm">
            <li>Shorts & Vlogs</li>
            <li>Ride Events</li>
            <li>Trip Planner</li>
            <li>Community</li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">MyWorldAfrica</div>
          <ul className="space-y-2 text-sm">
            <li>About</li>
            <li>Safety on the road</li>
            <li>Contact</li>
            <li>Terms & Privacy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MyWorldAfrica.com — Made with red dust and open skies.
      </div>
    </footer>
  );
}
