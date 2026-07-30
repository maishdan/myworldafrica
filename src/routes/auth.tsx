import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Lock, Eye, EyeOff, ArrowLeft, Mail, ShieldCheck, CheckCircle, AlertTriangle, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [mode, setMode] = useState<"signup" | "signin" | "forgot">("signin");
  const [role, setRole] = useState<(typeof roles)[number]>("Explorer");
  const [username, setUsername] = useState("");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  // Strength Logic
  const getStrength = () => {
    let score = 0;
    if (password.length > 0) score++;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const passwordsMatch = password && password === confirmPassword;

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 4) return "bg-yellow-500";
    return "bg-green-600";
  };

  const getStrengthText = () => {
    if (strength === 0) return "Empty";
    if (strength <= 2) return "Weak";
    if (strength <= 4) return "Medium";
    return "Strong (Safe)";
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && profile) {
        if (!profile.onboarding_complete) {
          nav({ to: "/onboarding" });
        } else {
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
        if (strength < 5) throw new Error("Password is not strong enough.");
        if (!passwordsMatch) throw new Error("Passwords do not match");

        const { data, error } = await supabase.auth.signUp({
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

        if (error) {
          const msg = error.message.toLowerCase();
          // Supabase returns a 500 "Error sending confirmation email" when SMTP
          // is misconfigured — the account is usually created anyway, so try to log in.
          if (msg.includes("email") && (msg.includes("sending") || msg.includes("confirmation"))) {
            const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
            if (signInErr) {
              throw new Error(
                "Account created but the confirmation email could not be sent. Disable 'Confirm email' (or fix SMTP) in Supabase → Authentication → Providers → Email, then sign in.",
              );
            }
            toast.success("Account created! Welcome to the tribe.");
            nav({ to: "/onboarding" });
            return;
          }
          throw error;
        }

        if (data.session) {
          toast.success("Account created! Welcome to the tribe.");
          nav({ to: "/onboarding" });
          return;
        }

        toast.success("Account created!", {
          description: "Check your email to confirm your account and start your adventure.",
        });
      } else if (mode === "signin") {

        let loginEmail = emailOrUsername;
        if (!emailOrUsername.includes("@")) {
          const { data, error } = await supabase.rpc('get_email_from_username', { u_name: emailOrUsername });
          if (error || !data) throw new Error("Username not found");
          loginEmail = data;
        }

        const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
        if (error) throw error;
        toast.success("Welcome back to the road!");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?mode=reset`,
        });
        if (error) throw error;
        toast.success("Reset link sent!", { description: "Check your email to reset your password." });
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
        <img src="/back 1.png" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/80" />

        <Link to="/" className="absolute top-28 left-6 z-30 flex items-center gap-2 text-white/50 hover:text-white transition-all bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-black uppercase tracking-widest">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <div className="relative z-10 w-full max-w-[540px] px-4 py-12 flex flex-col items-center">
          <div className="w-full bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[3.5rem] p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,1)]">
            <div className="text-center mb-10">
               <div className="flex flex-col items-center gap-4 mb-8">
                  <img src="/logo.png" className="h-20 w-auto drop-shadow-glow" alt="Logo" />
                  <h1 className="font-sans font-black italic text-4xl sm:text-5xl tracking-tighter uppercase leading-[0.8]">
                    <span className="text-white">MY WORLD</span><br/>
                    <span className="text-accent">AFRICA</span>
                  </h1>
               </div>
               <p className="text-white/60 font-bold uppercase tracking-widest text-[10px]">
                 {mode === "signin" ? "Login to your adventure" : mode === "signup" ? "Join the continental tribe" : "Recover your identity"}
               </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
              {mode === "forgot" ? (
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Identity Email</Label>
                  <div className="relative group">
                    <Input
                      type="email"
                      required
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white placeholder:text-white/20 focus:bg-white/10 transition-all"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-accent transition-colors" />
                  </div>
                  <Button type="submit" disabled={busy} className="w-full h-16 bg-warm-gradient text-primary-foreground font-black uppercase tracking-[0.2em] rounded-2xl shadow-glow transition-all active:scale-95 text-lg">
                    {busy ? "Sending link..." : "Request Reset Link"}
                  </Button>
                  <center>
                    <button type="button" onClick={() => setMode("signin")} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-accent">Back to Sign In</button>
                  </center>
                </div>
              ) : (
                <>
                  {mode === "signup" && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Adventure Name</Label>
                        <div className="relative group">
                          <Input required placeholder="Choose Username" value={username} onChange={(e) => setUsername(e.target.value)} className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white placeholder:text-white/20 focus:bg-white/10 transition-all" />
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-accent transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Email Address</Label>
                        <div className="relative group">
                          <Input type="email" required placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white placeholder:text-white/20 focus:bg-white/10 transition-all" />
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-accent transition-colors" />
                        </div>
                      </div>
                    </>
                  )}

                  {mode === "signin" && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Identity</Label>
                      <div className="relative group">
                        <Input required placeholder="Username or Email" value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white placeholder:text-white/20 focus:bg-white/10 transition-all" />
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-accent transition-colors" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between items-end pr-1">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Secret Key</Label>
                      {mode === "signup" && (
                        <div className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${getStrengthColor()} text-white transition-colors`}>
                          {getStrengthText()}
                        </div>
                      )}
                    </div>
                    <div className="relative group">
                      <Input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder={mode === "signup" ? "Create mission password" : "Enter mission password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`h-14 bg-white/5 border-white/10 rounded-2xl pl-12 pr-12 text-white placeholder:text-white/20 focus:bg-white/10 transition-all ${mode === 'signup' && strength > 0 ? (strength >= 5 ? 'border-green-500/50' : 'border-red-500/50') : ''}`}
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-accent transition-colors" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {mode === "signup" && (
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`h-full flex-1 transition-all duration-500 ${i < strength ? getStrengthColor() : "bg-transparent"}`} />
                        ))}
                      </div>
                    )}
                  </div>

                  {mode === "signup" && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Confirm Identity Key</Label>
                      <div className="relative group">
                        <Input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="Repeat mission password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`h-14 bg-white/5 border-white/10 rounded-2xl pl-12 pr-12 text-white focus:bg-white/10 transition-all ${confirmPassword ? (passwordsMatch ? 'border-green-500/50' : 'border-red-500/50') : ''}`}
                        />
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-accent transition-colors" />
                        <div className="absolute right-12 top-1/2 -translate-y-1/2">
                          {confirmPassword && (
                            passwordsMatch ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {mode === "signup" && (
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 block text-center">My Specialization</Label>
                      <div className="grid grid-cols-3 gap-3">
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
                  )}

                  {mode === "signin" && (
                    <div className="text-right">
                       <button type="button" onClick={() => setMode("forgot")} className="text-[10px] font-bold text-white/30 hover:text-accent tracking-widest uppercase italic">Forgot Password?</button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={busy || (mode === "signup" && (!passwordsMatch || strength < 5))}
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
                </>
              )}
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

          {/* Developer Console - Security Bypass for Testing (MOVED OUTSIDE) */}
          <div className="mt-12 w-full max-w-sm">
             <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[8px] font-black uppercase tracking-widest text-red-500 backdrop-blur-sm">
                  <ShieldCheck className="h-3 w-3" /> Developer Bypass Active
                </div>
             </div>
             <div className="grid grid-cols-2 gap-3 px-4">
                <Link to="/dashboard" search={{ mock_role: 'admin' }}>
                  <Button variant="outline" className="w-full h-10 rounded-xl border-white/10 bg-black/40 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-accent transition-all backdrop-blur-md">
                    GM Console
                  </Button>
                </Link>
                <Link to="/dashboard" search={{ mock_role: 'rider' }}>
                  <Button variant="outline" className="w-full h-10 rounded-xl border-white/10 bg-black/40 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-accent transition-all backdrop-blur-md">
                    Rider View
                  </Button>
                </Link>
                <Link to="/dashboard" search={{ mock_role: 'driver' }}>
                  <Button variant="outline" className="w-full h-10 rounded-xl border-white/10 bg-black/40 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-accent transition-all backdrop-blur-md">
                    Driver View
                  </Button>
                </Link>
                <Link to="/dashboard" search={{ mock_role: 'explorer' }}>
                  <Button variant="outline" className="w-full h-10 rounded-xl border-white/10 bg-black/40 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-accent transition-all backdrop-blur-md">
                    Explorer Hub
                  </Button>
                </Link>
             </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
