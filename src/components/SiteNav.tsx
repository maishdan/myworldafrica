import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-full bg-warm-gradient grid place-items-center shadow-warm">
            <Compass className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-lg">
              My World <span className="text-gradient-warm">Africa</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground -mt-0.5">
              Ride · Drive · Explore
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/feed" className="hover:text-primary transition-colors">Feed</Link>
          <Link to="/events" className="hover:text-primary transition-colors">Events</Link>
          <Link to="/events/create" className="hover:text-primary transition-colors">Host</Link>
          <Link to="/auth" className="hover:text-primary transition-colors">Community</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/auth" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link to="/auth">
            <Button size="sm" className="bg-warm-gradient text-primary-foreground shadow-warm hover:opacity-90">
              Join the tribe
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
