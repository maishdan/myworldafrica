import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, X, Home, Search, Calendar, MapPin, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { events, shorts } from "@/lib/mockData";

export function SiteNav() {
  const { user, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    nav({ to: "/" });
    setIsMenuOpen(false);
  };

  const filteredEvents = searchQuery
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredShorts = searchQuery
    ? shorts.filter(
        (s) =>
          s.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(true);
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
              src="/a (2).png"
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
        <div className="hidden lg:flex flex-1 max-w-md relative" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative w-full">
            <Input
              type="text"
              placeholder="Search African safaris, tours, events..."
              className="w-full bg-white/5 border-white/10 text-white pl-10 focus:ring-accent focus:border-accent rounded-full text-xs h-10 transition-all focus:bg-white/10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          </form>

          {/* Search Results Dropdown */}
          {isSearchOpen && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[100] max-h-[70vh] overflow-y-auto">
              {filteredEvents.length === 0 && filteredShorts.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-sm italic">
                  No results found for "{searchQuery}". Try "Safari", "Kenya", or "Rally".
                </div>
              ) : (
                <div className="p-2 space-y-4">
                  {filteredEvents.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                        <Calendar className="h-3 w-3" /> Events & Tours
                      </div>
                      <div className="space-y-1">
                        {filteredEvents.map((event) => (
                          <Link
                            key={event.id}
                            to={`/events/${event.id}`}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                            onClick={() => setIsSearchOpen(false)}
                          >
                            <img src={event.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                              <div className="text-sm font-bold text-white group-hover:text-accent transition-colors">{event.title}</div>
                              <div className="text-[10px] text-white/40 flex items-center gap-1">
                                <MapPin className="h-2 w-2" /> {event.location}, {event.country}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredShorts.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                        <Play className="h-3 w-3" /> Shorts & Vlogs
                      </div>
                      <div className="space-y-1">
                        {filteredShorts.map((short) => (
                          <Link
                            key={short.id}
                            to="/feed"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                            onClick={() => setIsSearchOpen(false)}
                          >
                            <img src={short.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                              <div className="text-sm font-bold text-white group-hover:text-accent transition-colors line-clamp-1">{short.caption}</div>
                              <div className="text-[10px] text-white/40">{short.author} · {short.location}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="bg-black/50 p-3 text-center border-t border-white/5">
                 <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Showing {filteredEvents.length + filteredShorts.length} results</p>
              </div>
            </div>
          )}
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
                src="/a (2).png"
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
