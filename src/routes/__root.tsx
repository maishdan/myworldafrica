import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

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
      { title: "My World Africa Ltd | Software Engineering, Cybersecurity & African Tours" },
      { property: "og:title", content: "My World Africa Ltd | Software Engineering, Cybersecurity & African Tours" },
      { name: "twitter:title", content: "My World Africa Ltd | Software Engineering, Cybersecurity & African Tours" },
      {
        name: "description",
        content:
          "My World Africa Ltd is a premier Technology and Tours & Travel company. We provide elite software engineering, cybersecurity, DevOps, and curated African safaris and expeditions.",
      },
      {
        property: "og:description",
        content:
          "My World Africa Ltd is a premier Technology and Tours & Travel company. We provide elite software engineering, cybersecurity, DevOps, and curated African safaris and expeditions.",
      },
      {
        name: "twitter:description",
        content:
          "My World Africa Ltd is a premier Technology and Tours & Travel company. We provide elite software engineering, cybersecurity, DevOps, and curated African safaris and expeditions.",
      },
      {
        name: "keywords",
        content:
          "My World Africa, My World Africa Ltd, Software Engineering Kenya, Cybersecurity Nairobi, DevOps Engineering Africa, African Safaris, Tours and Travel Africa, Kilimanjaro Trekking, Maasai Mara Tours, Serengeti Safaris, Web Development Kenya, Mobile App Development Nairobi, ERP Systems Africa, CRM Systems Kenya, Enterprise Software Nairobi, Digital Marketing Kenya, SEO Services Nairobi, Graphic Design Kenya, IT Consulting Nairobi, Penetration Testing Kenya, Security Audits Africa, Cloud Architecture Kenya, Tech Company Nairobi, Travel Community Africa, Motorcycle Tours Africa, 4x4 Expeditions Africa, Adventure Travel Kenya, Luxury Safaris Africa, Wildlife Tours Africa, Ride Africa, Drive Africa, Explore Africa, Online World Kenya rebranding, Daniel Maina Wangui, Daniwest Technologies, Justice Ultimate Automobiles, Justice Automotive Kenya, Justice Corporate Logistics Kenya, Stepping To Destiny, Titan X Series Chip, Car Dealer Kenya, Car Rentals Nairobi, Vehicle Marketplace Africa, Automobile Management Systems",
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
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
