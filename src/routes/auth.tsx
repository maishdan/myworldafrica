import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || "/feed",
    };
  },
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
  const { redirect } = Route.useSearch();
  const nav = useNavigate();
  const [mode, setMode] = useState<"signup" | "signin">("signin");
  const [role, setRole] = useState<(typeof roles)[number]>("Rider");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;

      // If we have a session, redirect to the intended page or dashboard
      const target = redirect === "/feed" ? "/dashboard" : redirect;
      nav({ to: target });
    });
  }, [nav, redirect]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${redirect}`,
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
        nav({ to: redirect });
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
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      },
    });
    if (error) {
      toast.error(error.message);
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNav />

      <main
        className="relative flex-1 w-full flex items-center md:items-end justify-center bg-cover bg-center bg-no-repeat pt-24 pb-12 px-4 sm:px-6"
        style={{ backgroundImage: 'url("/auth.png")' }}
      >
        <div className="absolute inset-0 bg-black/20 md:bg-black/10" />

        {/* Back to Home Button - Adjusted for better mobile placement */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-[60] flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/40 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 text-xs sm:text-sm font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Back to Home</span>
          <span className="xs:hidden">Home</span>
        </Link>

        <div
          className="relative z-10 w-full max-w-[480px] bg-cover bg-center bg-no-repeat rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 md:p-10 border border-white/10 shadow-2xl overflow-hidden"
          style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url("/auth%201.png")' }}
        >
          <div className="text-center mb-6 sm:mb-8">
            {/* BRANDING LOGO BLOCK - Unified Design */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 transform hover:scale-105 transition-transform duration-500 w-full">
              <img
                src="/a (2).png"
                alt="My World Africa Logo"
                className="h-20 sm:h-28 w-auto object-contain drop-shadow-2xl"
              />
              <div className="hidden sm:block w-1 h-20 sm:h-28 bg-accent rounded-full shadow-glow" />
              <div className="flex flex-col items-center sm:items-start font-sans font-black leading-[0.85] text-2xl sm:text-4xl tracking-tighter uppercase drop-shadow-2xl">
                <div className="text-white">MY WORLD</div>
                <div className="text-accent mt-1 sm:mt-2">AFRICA</div>
              </div>
            </div>

            <p className="mt-4 sm:mt-6 text-white text-xs sm:text-sm md:text-base font-normal opacity-90">
              {mode === "signin"
                ? "Welcome Back! Login to Continue Your Adventure"
                : "Join the Tribe! Create Your Account to Start Exploring"}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <Input
                  id="username"
                  required
                  maxLength={50}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black/60 border-white/5 h-12 rounded-xl text-white placeholder:text-white/20 pl-5 pr-12 focus-visible:ring-1 focus-visible:ring-[#c15a2b]"
                />
                <User className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
              </div>
            )}

            <div className="relative">
              <Input
                id="email"
                type="email"
                required
                maxLength={100}
                placeholder={mode === "signin" ? "Email or Username" : "Email Address"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/60 border-white/5 h-12 rounded-xl text-white placeholder:text-white/20 pl-5 pr-12 focus-visible:ring-1 focus-visible:ring-[#c15a2b]"
              />
              <User className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
            </div>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/60 border-white/5 h-12 rounded-xl text-white placeholder:text-white/20 pl-12 pr-12 focus-visible:ring-1 focus-visible:ring-[#c15a2b]"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {mode === "signup" && (
              <>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    maxLength={30}
                    placeholder="Phone number (+254...)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-black/60 border-white/5 h-12 rounded-xl text-white placeholder:text-white/20 pl-5 pr-12 focus-visible:ring-1 focus-visible:ring-[#c15a2b]"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-white/70">I am a...</p>
                  <div className="grid grid-cols-3 gap-2">
                    {roles.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`rounded-xl border h-11 text-xs font-bold transition-all ${
                          role === r
                            ? "bg-[#c15a2b] text-white border-transparent shadow-lg shadow-[#c15a2b]/20"
                            : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {mode === "signin" && (
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    className="h-4 w-4 rounded-sm border-white/30 data-[state=checked]:bg-[#c15a2b] data-[state=checked]:border-none"
                  />
                  <label htmlFor="remember" className="text-[11px] text-white/70 font-medium cursor-pointer">
                    Remember Me
                  </label>
                </div>
                <button type="button" className="text-[11px] text-white/70 hover:text-[#c15a2b] font-medium transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={busy}
              className="w-full bg-[#c15a2b] hover:bg-[#c15a2b]/90 text-white font-bold h-12 rounded-xl text-base uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-[#c15a2b]/20"
            >
              {busy ? "PROCESSING..." : mode === "signin" ? "LOGIN" : "SIGN UP"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={signInWithGoogle}
              disabled={busy}
              className="w-full h-12 rounded-xl bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white transition-all font-semibold flex items-center justify-center gap-3"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/60 font-medium">
              {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-[#c15a2b] font-bold hover:underline ml-1"
              >
                {mode === "signin" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}


