import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Lock, Eye, EyeOff, ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || "/dashboard",
    };
  },
  head: () => ({
    meta: [
      { title: "Join the Tribe · MyWorldAfrica" },
      { name: "description", content: "Experience the ultimate African adventure." },
    ],
  }),
  component: Auth,
});

const roles = ["Rider", "Driver", "Explorer"] as const;

function Auth() {
  const { redirect } = Route.useSearch();
  const { profile } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"signup" | "signin">("signin");
  const [role, setRole] = useState<(typeof roles)[number]>("Rider");
  const [username, setUsername] = useState("");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && profile) {
        if (!profile.onboarding_complete) {
          nav({ to: "/onboarding" });
        } else {
          // If onboarding is complete, check role and send to correct dashboard
          nav({ to: "/dashboard" });
        }
      }
    });
  }, [profile, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              username,
              role: role.toLowerCase(),
            },
          },
        });
        if (error) throw error;
        toast.success("Account created!", {
          description: "Please check your email to confirm your account and start your adventure.",
        });
      } else {
        // Sign In Logic
        let loginEmail = emailOrUsername;

        // If it's not an email, assume it's a username and fetch the email
        if (!emailOrUsername.includes("@")) {
          const { data, error } = await supabase.rpc('get_email_from_username', { u_name: emailOrUsername });
          if (error || !data) throw new Error("Username not found");
          loginEmail = data;
        }

        const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
        if (error) throw error;
        toast.success("Welcome back to the road!");
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
    <div className="min-h-screen bg-black flex flex-col">
      <SiteNav />

      <main className="relative flex-1 w-full flex items-center justify-center pt-20 overflow-hidden">
        {/* Cinematic Background */}
        <img
          src="/back 1.png"
          alt="African Adventure"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/80" />

        {/* Back to Home */}
        <Link
          to="/"
          className="absolute top-28 left-6 z-30 flex items-center gap-2 text-white/50 hover:text-white transition-all bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-black uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <div className="relative z-10 w-full max-w-[540px] px-4">
          <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]">
            <div className="text-center mb-10">
               {/* Branding */}
               <div className="flex flex-col items-center gap-4 mb-8">
                  <img src="/a (2).png" className="h-20 w-auto drop-shadow-glow" alt="Logo" />
                  <h1 className="font-sans font-black italic text-4xl sm:text-5xl tracking-tighter uppercase leading-[0.8]">
                    <span className="text-white">MY WORLD</span><br/>
                    <span className="text-accent">AFRICA</span>
                  </h1>
               </div>
               <p className="text-white/60 font-bold uppercase tracking-widest text-[10px]">
                 {mode === "signin" ? "Login to your adventure" : "Join the continental tribe"}
               </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
              {mode === "signup" ? (
                <>
                  <div className="space-y-2">
                    <div className="relative group">
                      <Input
                        required
                        placeholder="Choose Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white placeholder:text-white/20 focus:bg-white/10 transition-all"
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-accent transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative group">
                      <Input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white placeholder:text-white/20 focus:bg-white/10 transition-all"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-accent transition-colors" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative group">
                  <Input
                    required
                    placeholder="Username or Email"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white placeholder:text-white/20 focus:bg-white/10 transition-all"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-accent transition-colors" />
                </div>
              )}

              <div className="space-y-2">
                <div className="relative group">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl px-12 text-white placeholder:text-white/20 focus:bg-white/10 transition-all"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-accent transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <>
                  <div className="relative group">
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Confirm Strong Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white placeholder:text-white/20 focus:bg-white/10 transition-all"
                    />
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-accent transition-colors" />
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 text-center">I am a...</p>
                    <div className="grid grid-cols-3 gap-2">
                      {roles.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                            role === r ? "bg-accent border-accent text-black shadow-lg" : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={busy}
                className="w-full h-16 bg-warm-gradient text-primary-foreground font-black uppercase tracking-[0.2em] rounded-2xl shadow-glow transition-all active:scale-95 text-lg"
              >
                {busy ? "Processing..." : mode === "signin" ? "Explore Now" : "Join the Tribe"}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase font-black text-white/20"><span className="bg-black/0 px-4">Or continue with</span></div>
              </div>

              <Button
                type="button"
                onClick={signInWithGoogle}
                className="w-full h-14 bg-white text-black hover:bg-white/90 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-transform active:scale-95"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
            </form>

            <div className="mt-10 text-center">
              <button
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline transition-all"
              >
                {mode === "signin" ? "New here? Create your story" : "Already a member? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
