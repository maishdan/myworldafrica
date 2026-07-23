import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import heroImg from "@/assets/hero-africa.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Join the tribe · MyWorldAfrica" },
      { name: "description", content: "Sign up or sign in as a rider, driver or explorer and start sharing the African road." },
      { property: "og:title", content: "Join the tribe · MyWorldAfrica" },
      { property: "og:description", content: "Create your MyWorldAfrica account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Auth,
});

const roles = ["Rider", "Driver", "Explorer"] as const;

function Auth() {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [role, setRole] = useState<(typeof roles)[number]>("Rider");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(mode === "signup" ? `Welcome to the ${role} tribe!` : "Welcome back, explorer.");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={heroImg} alt="African savanna at sunset" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-warm-gradient grid place-items-center">
              <Compass className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="font-display font-bold text-lg">My World Africa</div>
          </Link>
          <div>
            <blockquote className="font-display text-3xl leading-snug max-w-md">
              "The best stories start with red dust on your boots and a full tank of fuel."
            </blockquote>
            <div className="mt-4 text-sm text-white/70">— Kaya Ndlovu, Cape Town</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-full bg-warm-gradient grid place-items-center">
              <Compass className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="font-display font-bold text-lg">My World Africa</div>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">
            {mode === "signup" ? "Join the tribe" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Create your MyWorldAfrica account and hit the road."
              : "Sign in to continue your journey."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" required maxLength={50} placeholder="kaya_rides" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required maxLength={100} placeholder="you@myworldafrica.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={8} placeholder="••••••••" />
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label>I am a...</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                        role === r
                          ? "bg-warm-gradient text-primary-foreground border-transparent"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full bg-warm-gradient text-primary-foreground hover:opacity-90 h-11">
              {mode === "signup" ? "Create account" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already ride with us?" : "New to MyWorldAfrica?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="text-primary font-medium hover:underline"
            >
              {mode === "signup" ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
