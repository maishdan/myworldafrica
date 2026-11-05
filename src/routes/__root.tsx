import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=5.0" },
      { httpEquiv: "X-UA-Compatible", content: "IE=edge" },
      { name: "author", content: "My World Africa Ltd" },
      { name: "theme-color", content: "#c15a2b" },
      { title: "My World Africa | Kenya Safari Tours, Flights & Helicopter Charters" },
      { property: "og:title", content: "My World Africa - Luxury Kenyan Safaris & Travel" },
      { name: "twitter:title", content: "My World Africa - Luxury Kenyan Safaris & Travel" },
      {
        name: "description",
        content:
          "Discover the beauty of Africa with My World Africa. We offer premium Kenya safari tours, domestic flights, helicopter charters, and tailor-made Christmas holiday packages.",
      },
      {
        property: "og:description",
        content:
          "Discover the beauty of Africa with My World Africa. We offer premium Kenya safari tours, domestic flights, helicopter charters, and tailor-made Christmas holiday packages.",
      },
      {
        name: "twitter:description",
        content:
          "Discover the beauty of Africa with My World Africa. We offer premium Kenya safari tours, domestic flights, helicopter charters, and tailor-made Christmas holiday packages.",
      },
      {
        name: "keywords",
        content:
          "Kenya tours and travel, Maasai Mara safari packages, Helicopter charter Nairobi, Wilson Airport flights, Christmas safari Kenya, Diani beach holidays, Private charter flights Kenya, Scenic helicopter flights Rift Valley, Great Migration Kenya packages, Amboseli National Park safari tours, Tsavo East and West safari, Tailor-made Kenya safaris, Honeymoon safari Kenya, Luxury Maasai Mara tours, My World Africa, African Safaris, Overland Tours East Africa, Corporate travel agency Nairobi, MICE travel Kenya, Best tour operators in Nairobi",
      },
      { property: "og:image", content: "/logo.png" },
      { name: "twitter:image", content: "/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://myworldafrica.com" },
      { property: "og:site_name", content: "My World Africa Ltd" },
      { property: "og:locale", content: "en_US" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow" },
      { name: "bingbot", content: "index, follow" },
      { name: "geo.region", content: "KE" },
      { name: "geo.placename", content: "Nairobi" },
      { name: "geo.position", content: "-1.286389;36.817223" },
      { name: "ICBM", content: "-1.286389, 36.817223" },
      { name: "apple-mobile-web-app-title", content: "My World Africa" },
      { name: "application-name", content: "My World Africa" },
      { name: "format-detection", content: "telephone=no" },
      { name: "twitter:site", content: "@myworldafrica" },
      { name: "twitter:creator", content: "@myworldafrica" },
      { property: "article:publisher", content: "https://www.facebook.com/myworldafrica" },
      { name: "category", content: "Technology, Travel, Adventure" },
      { name: "coverage", content: "Worldwide" },
      { name: "distribution", content: "Global" },
      { name: "rating", content: "General" },
      { name: "revisit-after", content: "7 days" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        async: true,
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6348784444572786",
        crossOrigin: "anonymous",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { useAuth } from "@/hooks/useAuth";

// Global Loading Screen Component
function GlobalLoader() {
  const router = useRouter();
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Whenever the route changes, show the loader for 15 seconds
    const unsubscribe = router.subscribe("onLoad", () => {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 15000);
      return () => clearTimeout(timer);
    });

    // Also trigger on initial page load
    setShow(true);
    const initialTimer = setTimeout(() => setShow(false), 15000);

    return () => {
      clearTimeout(initialTimer);
      unsubscribe();
    };
  }, [router]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#030303] flex flex-col items-center justify-between text-white overflow-hidden selection:bg-accent selection:text-black">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Header Section */}
      <div className="pt-20 flex flex-col items-center relative z-10 animate-in fade-in slide-in-from-top-10 duration-1000">
        <img
          src="/logo.png"
          alt="My World Africa Logo"
          className="h-24 md:h-32 w-auto object-contain mb-6 drop-shadow-[0_0_15px_rgba(255,165,0,0.5)] animate-pulse"
        />
        <h1 className="font-sans font-black leading-[0.85] text-4xl md:text-5xl tracking-tighter uppercase text-center">
          <div className="text-white">MY WORLD</div>
          <div className="text-accent mt-1">AFRICA</div>
        </h1>
        <p className="mt-8 text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-zinc-400 text-center px-6 drop-shadow-sm">
          Discover the beauty of Africa, one journey at a time
        </p>
      </div>

      {/* Center GIF */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full max-w-lg px-8">
        <img
          src="/guanxian_gif 800×600 Pixel.gif"
          alt="Loading Interface"
          className="w-full h-auto object-contain mix-blend-screen opacity-80"
        />
      </div>

      {/* Footer Section */}
      <div className="pb-10 relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/30 text-center">
          © {new Date().getFullYear()} MyWorldAfrica.com
          <br/>
          <span className="mt-2 inline-block">Initializing Continental Core...</span>
        </div>
      </div>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Tawk.to Script Injection
    var Tawk_API = (window as any).Tawk_API || {};
    var Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "https://embed.tawk.to/6a6da03c96b8361d472ce741/1juu3jrec";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode?.insertBefore(s1, s0);
    })();
  }, []);

  useEffect(() => {
    if (!loading && user && profile) {
      const isNavigatingToOnboarding = router.state.location.pathname === "/onboarding";
      const isNavigatingToAuth = router.state.location.pathname === "/auth";

      if (!profile.onboarding_complete && !isNavigatingToOnboarding && !isNavigatingToAuth) {
        console.log("Onboarding incomplete. Redirecting...");
        router.navigate({ to: "/onboarding" });
      }
    }
  }, [loading, user, profile, router.state.location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalLoader />
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
