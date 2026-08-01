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

      // Basic SEO
      { title: "My World Africa | Adventure Touring, Software Engineering & Cybersecurity" },
      {
        name: "title",
        content: "My World Africa | Adventure Touring, Software Engineering & Cybersecurity",
      },
      {
        name: "description",
        content:
          "My World Africa is a premier exploration, software engineering, and cybersecurity ecosystem. Discover African adventure touring, motorcycle expeditions, and world-class digital solutions.",
      },
      {
        name: "keywords",
        content:
          "My World Africa, African adventure touring, motorcycle expeditions Kenya, software engineering Africa, cybersecurity solutions, tech talent training Kenya, custom enterprise systems, digital branding, DevOps engineering, Nairobi tech firm",
      },
      { name: "author", content: "Daniwest Technologies" },
      { name: "robots", content: "index, follow" },
      { name: "language", content: "English" },
      { name: "geo.region", content: "KE-30" },
      { name: "geo.placename", content: "Nairobi, Kenya" },
      { name: "geo.position", content: "-1.2921;36.8219" },
      { name: "ICBM", content: "-1.2921, 36.8219" },

      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:title", content: "My World Africa | Explore, Discover, and Build the Future" },
      {
        property: "og:description",
        content:
          "Pushing boundaries in software engineering, cybersecurity, and long-distance African motorcycle exploration. Empowering the next generation of tech talent.",
      },
      { property: "og:site_name", content: "My World Africa" },
      { property: "og:locale", content: "en_KE" },

      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:url", content: "/" },
      {
        name: "twitter:title",
        content: "My World Africa | Tech, Cybersecurity & African Expeditions",
      },
      {
        name: "twitter:description",
        content:
          "World-class digital solutions fused with epic African adventure touring and motorcycle exploration. Engineered in Nairobi, Kenya.",
      },
      { name: "twitter:creator", content: "@Daniwest" },

      // Mobile / PWA
      { name: "theme-color", content: "#0f172a" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "My World Africa" },
      { name: "application-name", content: "My World Africa" },
      { name: "format-detection", content: "telephone=no" },
      { name: "referrer", content: "strict-origin-when-cross-origin" },

      // Niche / industry
      {
        name: "classification",
        content: "Software Engineering, Cybersecurity, Adventure Tourism, Tech Training",
      },
      {
        name: "target",
        content: "Tech Enterprises, Travelers, Motorcycle Adventurers, Software Clients",
      },
      { name: "coverage", content: "Worldwide" },
      { name: "distribution", content: "Global" },
      { name: "rating", content: "General" },
      { name: "owner", content: "Daniel Maina Wangui (Daniwest)" },
      { name: "designer", content: "Daniwest Technologies" },
      { name: "copyright", content: "© 2026 My World Africa. All Rights Reserved." },
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
      {
        children: `var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/6a6da03c96b8361d472ce741/1juu3jrec';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();`,
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
