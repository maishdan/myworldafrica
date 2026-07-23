export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-black text-white mt-24 overflow-hidden">
      {/* Background Graphic Image */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <img
          src="/footer.png"
          alt="Footer Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-4 mb-8 group text-center sm:text-left">
            <img
              src="/a (2).png"
              alt="My World Africa Logo"
              className="h-16 sm:h-24 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            />
            <div className="hidden sm:block w-1.5 sm:w-2 h-16 sm:h-24 bg-accent rounded-full shadow-[0_0_20px_rgba(255,165,0,0.6)]" />
            <div className="flex flex-col items-center sm:items-start font-sans font-black leading-[0.85] text-2xl sm:text-4xl tracking-tighter uppercase drop-shadow-2xl">
              <div className="text-white">MY WORLD</div>
              <div className="text-accent mt-1">AFRICA</div>
            </div>
          </div>
          <p className="mt-4 text-base text-white/80 max-w-sm leading-relaxed font-medium text-center sm:text-left mx-auto sm:mx-0">
            The community-driven platform for African explorers, riders, and drivers.
            Share your journey. Host events. Live the road.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-accent mb-5 font-black">Explore</div>
          <ul className="space-y-3 text-sm font-bold uppercase tracking-wide text-white/70">
            <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
              <span className="h-1 w-1 bg-accent rounded-full" /> Shorts & Vlogs
            </li>
            <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
              <span className="h-1 w-1 bg-accent rounded-full" /> Ride Events
            </li>
            <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
              <span className="h-1 w-1 bg-accent rounded-full" /> Trip Planner
            </li>
            <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
              <span className="h-1 w-1 bg-accent rounded-full" /> Community
            </li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-accent mb-5 font-black">MyWorldAfrica</div>
          <ul className="space-y-3 text-sm font-bold uppercase tracking-wide text-white/70">
            <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
              <span className="h-1 w-1 bg-accent rounded-full" /> About
            </li>
            <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
              <span className="h-1 w-1 bg-accent rounded-full" /> Safety on the road
            </li>
            <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
              <span className="h-1 w-1 bg-accent rounded-full" /> Contact
            </li>
            <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
              <span className="h-1 w-1 bg-accent rounded-full" /> Terms & Privacy
            </li>
          </ul>
        </div>
      </div>
      <div className="relative z-10 border-t border-white/10 py-8 text-center flex flex-col items-center gap-2">
        <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/30">
          © {new Date().getFullYear()} MyWorldAfrica.com — Made with red dust and open skies.
        </div>
        <a
          href="https://onlineworldkenya.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-white/40 hover:text-accent transition-colors italic tracking-widest"
        >
          powered by online world kenya
        </a>
      </div>
    </footer>
  );
}
