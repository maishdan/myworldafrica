import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Compass, Upload, ShieldCheck, Lock, User, CheckCircle2 } from "lucide-react";
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

  useEffect(() => {
    if (profile?.onboarding_complete) {
      nav({ to: "/dashboard" });
    }
    if (profile?.username) setUsername(profile.username);
  }, [profile, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setBusy(true);
    try {
      // 1. Update Password (especially for Google users)
      if (password) {
        if (password !== confirmPassword) throw new Error("Passwords do not match");
        const { error: pwdErr } = await supabase.auth.updateUser({ password });
        if (pwdErr) throw pwdErr;
      }

      // 2. Update Profile & Mark Onboarding Complete
      const { error: pErr } = await supabase.from("profiles").update({
        username,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      }).eq("id", user.id);
      if (pErr) throw pErr;

      // 3. Set Role
      const { error: rErr } = await supabase.from("user_roles").upsert({
        user_id: user.id,
        role: role.toLowerCase()
      });
      if (rErr) throw rErr;

      setFinished(true);
      toast.success("Profile setup complete!");
      setTimeout(() => nav({ to: "/dashboard" }), 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Setup failed");
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
              <p className="text-white/60 font-bold uppercase tracking-widest text-xs">Taking you to your dashboard...</p>
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
        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl">
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 mb-6">
               <Compass className="h-8 w-8 text-accent animate-spin-slow" />
            </div>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Final Step</h1>
            <p className="text-white/50 text-[10px] uppercase font-black tracking-widest leading-relaxed">
               Set your identity and join the continental road.
            </p>
          </header>

          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Username</Label>
              <div className="relative group">
                 <Input required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="AdventureName" className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white" />
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Secure Password</Label>
              <div className="relative group">
                 <Input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Set local password" className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white" />
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
              </div>
            </div>

            <div className="relative group">
               <Input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white" />
               <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 block text-center">My Tribe Role</Label>
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

            <Button type="submit" disabled={busy} className="w-full h-16 bg-warm-gradient text-primary-foreground font-black uppercase tracking-[0.2em] rounded-2xl shadow-glow text-lg">
              {busy ? "Securing Account..." : "Join the Road"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
