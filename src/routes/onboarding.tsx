import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Compass, ShieldCheck, Lock, User, CheckCircle2, Eye, EyeOff, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Setup Your Profile · MyWorldAfrica" },
      { name: "description", content: "Complete your onboarding to join the tribe." },
    ],
  }),
  component: Onboarding,
});

const roles = ["Rider", "Driver", "Explorer"] as const;

function Onboarding() {
  const { user, profile } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<(typeof roles)[number]>("Explorer");
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    if (profile?.onboarding_complete) {
      nav({ to: "/dashboard" });
    }
    if (profile?.username && !username) setUsername(profile.username);
  }, [profile, nav, username]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (strength < 5) {
      toast.error("Password is not strong enough. Add numbers, capital letters, and symbols.");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      // 1. Update Password in Supabase Auth
      const { error: pwdErr } = await supabase.auth.updateUser({ password });
      if (pwdErr) throw pwdErr;

      // 2. Update Role
      const { error: rErr } = await supabase.from("user_roles").upsert({
        user_id: user.id,
        role: role.toLowerCase()
      }, { onConflict: 'user_id,role' });
      if (rErr) throw rErr;

      // 3. Update Profile & Mark Onboarding Complete
      const { error: pErr } = await supabase.from("profiles").update({
        username,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      }).eq("id", user.id);
      if (pErr) throw pErr;

      setFinished(true);
      toast.success("Identity secured. Welcome to the Tribe.");
      setTimeout(() => nav({ to: "/dashboard" }), 2000);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Setup failed. Check permissions.");
    } finally {
      setBusy(false);
    }
  };

  if (finished) {
     return (
        <div className="min-h-screen bg-black grid place-items-center p-6 text-center">
           <div className="space-y-6 animate-in zoom-in duration-500">
              <CheckCircle2 className="h-24 w-24 text-accent mx-auto" />
              <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Welcome to the Tribe!</h1>
              <p className="text-white/60 font-bold uppercase tracking-widest text-xs">Directing you to headquarters...</p>
           </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <img src="/back 1.png" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,1)]">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">FINAL STEP</h1>
            <p className="text-white/50 text-[10px] uppercase font-black tracking-widest leading-relaxed">
               Define your identity and join the continental road.
            </p>
          </header>

          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Username</Label>
              <div className="relative group">
                 <Input required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="AdventureID" className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white focus:bg-white/10 transition-all" />
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-accent transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end pr-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Secure Password</Label>
                <div className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${getStrengthColor()} text-white transition-colors`}>
                  {getStrengthText()}
                </div>
              </div>

              <div className="relative group">
                 <Input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create your mission password"
                    className={`h-14 bg-white/5 border-white/10 rounded-2xl pl-12 pr-12 text-white focus:bg-white/10 transition-all ${strength > 0 ? (strength >= 5 ? 'border-green-500/50' : 'border-red-500/50') : ''}`}
                 />
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-accent transition-colors" />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                 </button>
              </div>

              {/* Password Strength Meter */}
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`h-full flex-1 transition-all duration-500 ${i < strength ? getStrengthColor() : "bg-transparent"}`} />
                ))}
              </div>
            </div>

            <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Confirm Identity Key</Label>
               <div className="relative group">
                  <Input
                    required
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat mission password"
                    className={`h-14 bg-white/5 border-white/10 rounded-2xl pl-12 pr-12 text-white focus:bg-white/10 transition-all ${confirmPassword ? (passwordsMatch ? 'border-green-500/50' : 'border-red-500/50') : ''}`}
                  />
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-accent transition-colors" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {confirmPassword && (
                      passwordsMatch ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
               </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 block text-center">My Specialization</Label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                      role === r
                        ? "bg-accent border-accent text-black shadow-lg"
                        : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={busy || !passwordsMatch || strength < 5}
              className="w-full h-20 bg-warm-gradient text-primary-foreground font-black uppercase tracking-[0.2em] rounded-[2.5rem] shadow-glow text-lg transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
            >
              {busy ? "Locking Profile..." : "Secure My Identity"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
