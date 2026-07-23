import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import heroImg from "@/assets/hero-africa.jpg";
import { supabase } from "@/integrations/supabase/client";

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
  const nav = useNavigate();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [role, setRole] = useState<(typeof roles)[number]>("Rider");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      const { data: p } = await supabase
        .from("profiles")
        .select("phone, username")
        .eq("id", data.session.user.id)
        .maybeSingle();
      nav({ to: p?.phone && p?.username ? "/feed" : "/onboarding" });
    });
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
            data: {
              username,
              phone,
              role: role.toLowerCase(),
            },
          },
        });
        if (error) throw error;
        toast.success(`Welcome to the ${role} tribe!`, {
          description: "Check your email to confirm your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back, explorer.");
        const { data: u } = await supabase.auth.getUser();
        const { data: p } = await supabase
          .from("profiles")
          .select("phone, username")
          .eq("id", u.user!.id)
          .maybeSingle();
        nav({ to: p?.phone && p?.username ? "/feed" : "/onboarding" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const signInWithGoogle = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/onboarding` },
    });
    if (error) {
      toast.error(error.message);
      setBusy(false);
    }
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

          <Button
            type="button"
            variant="outline"
            onClick={signInWithGoogle}
            disabled={busy}
            className="mt-6 w-full h-11"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2.2 12 2.2 6.8 2.2 2.6 6.4 2.6 12s4.2 9.8 9.4 9.8c5.4 0 9-3.8 9-9.2 0-.6-.06-1.1-.15-1.6H12z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px bg-border flex-1" />
            or
            <div className="h-px bg-border flex-1" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" required maxLength={50} placeholder="kaya_rides" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required maxLength={100} placeholder="you@myworldafrica.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" type="tel" maxLength={30} placeholder="+254 700 000 000" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={8} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
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

            <Button type="submit" disabled={busy} className="w-full bg-warm-gradient text-primary-foreground hover:opacity-90 h-11">
              {busy ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
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
