import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function SiteNav() {
  const { user, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const nav = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    nav({ to: "/" });
    setIsMenuOpen(false);
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
      <Link
        to="/events/create"
        className="hover:text-accent transition-colors"
        onClick={() => setIsMenuOpen(false)}
      >
        Host
      </Link>
    </>
  );

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="flex items-center gap-2">
            <img
              src="/a (2).png"
              alt="My World Africa"
              className="h-8 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="w-0.5 h-8 sm:h-10 bg-accent rounded-full" />
            <div className="flex flex-col items-start font-sans font-black leading-[0.85] text-[10px] sm:text-base tracking-tighter uppercase">
              <div className="text-foreground">MY WORLD</div>
              <div className="text-accent">AFRICA</div>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-full border border-border/50">
                  {profile?.avatar_url || profile?.profile_image_url ? (
                    <img
                      src={profile.avatar_url ?? profile.profile_image_url ?? ""}
                      alt={profile?.username ?? "You"}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-warm-gradient grid place-items-center text-primary-foreground text-[10px] font-bold">
                      {(profile?.username ?? user.email ?? "?").slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold">{profile?.username ?? user.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="h-8 hover:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign out</span>
                </Button>
              </>
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
            className="md:hidden text-foreground hover:bg-accent/10"
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
