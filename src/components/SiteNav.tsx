import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, X, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export function SiteNav() {
  const { user, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const nav = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    nav({ to: "/" });
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery} in Africa...`);
      // In a real app, you would navigate to a search results page
      // nav({ to: `/search?q=${searchQuery}` });
    }
  };

  const NavLinks = () => (
    <>
      <Link
        to="/"
        className="hover:text-accent transition-colors"
        onClick={() => setIsMenuOpen(false)}
      >
        Home
      </Link>
      <Link
        to="/feed"
        className="hover:text-accent transition-colors"
        onClick={() => setIsMenuOpen(false)}
      >
        Feed
      </Link>
      <Link
        to="/events"
        className="hover:text-accent transition-colors"
        onClick={() => setIsMenuOpen(false)}
      >
        Events
      </Link>
    </>
  );

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-black border-b border-white/10 shadow-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="My World Africa"
              className="h-8 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="w-0.5 h-8 sm:h-10 bg-accent rounded-full" />
            <div className="flex flex-col items-start font-sans font-black leading-[0.85] text-[10px] sm:text-base tracking-tighter uppercase">
              <div className="text-white">MY WORLD</div>
              <div className="text-accent">AFRICA</div>
            </div>
          </div>
        </Link>

        {/* Search Bar - Optimized for SEO and UX */}
        <div className="hidden lg:flex flex-1 max-w-md">
          <form onSubmit={handleSearch} className="relative w-full">
            <Input
              type="text"
              placeholder="Search African safaris, tours, events..."
              className="w-full bg-white/5 border-white/10 text-white pl-10 focus:ring-accent focus:border-accent rounded-full text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          </form>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-white shrink-0">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="h-10 border-white/10 bg-white/5 text-accent hover:bg-accent hover:text-black font-black uppercase tracking-widest text-[10px] px-6 rounded-xl transition-all">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="bg-warm-gradient text-primary-foreground shadow-warm hover:scale-105 transition-transform font-bold px-6">
                  JOIN THE TRIBE
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* MOBILE MENU FLOATING TILE - Centered perfectly */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 h-[100dvh] w-screen z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="relative w-full max-w-[320px] overflow-hidden border border-white/20 animate-rainbow-glow rounded-none p-10 flex flex-col items-center gap-8 animate-in zoom-in-95 duration-300 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Image for Tile */}
            <div className="absolute inset-0 z-0">
              <img
                src="/auth 1.png"
                alt="Background"
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-black/70" />
            </div>

            {/* Logo branding - Increased visibility */}
            <div className="relative z-10 flex items-center justify-center gap-3 transform scale-125 mb-4">
              <img
                src="/logo.png"
                alt="My World Africa Logo"
                className="h-12 w-auto object-contain"
              />
              <div className="w-1 h-12 bg-accent rounded-full shadow-[0_0_15px_rgba(255,165,0,0.5)]" />
              <div className="flex flex-col items-start font-sans font-black leading-[0.85] text-lg tracking-tighter uppercase text-white">
                <div className="text-white">MY WORLD</div>
                <div className="text-accent mt-0.5">AFRICA</div>
              </div>
            </div>

            <nav className="relative z-10 flex flex-col items-center gap-6 text-xl font-black uppercase tracking-[0.2em] w-full mt-4 text-white">
              <NavLinks />
            </nav>

            <div className="relative z-10 w-full h-px bg-white/20 mt-2" />

            {user ? (
              <Button
                variant="destructive"
                className="relative z-10 w-full rounded-none h-14 font-black tracking-widest text-xs border border-white/10"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" /> SIGN OUT
              </Button>
            ) : (
              <Link to="/auth" className="relative z-10 w-full" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-warm-gradient text-primary-foreground h-14 rounded-none font-black tracking-widest text-xs shadow-glow">
                  JOIN THE TRIBE
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
