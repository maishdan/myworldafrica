import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Compass, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Complete your profile · MyWorldAfrica" },
      { name: "description", content: "Finish setting up your MyWorldAfrica profile." },
    ],
  }),
  component: Onboarding,
});

const roles = ["Rider", "Driver", "Explorer"] as const;

function Onboarding() {
  const nav = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<(typeof roles)[number]>("Rider");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        nav({ to: "/auth" });
        return;
      }
      setUserId(data.user.id);
      const meta = data.user.user_metadata ?? {};
      setFullName(meta.full_name ?? meta.name ?? "");
      setUsername(meta.username ?? (data.user.email?.split("@")[0] ?? ""));
      setPhone(meta.phone ?? "");
      if (meta.role) {
        const r = String(meta.role);
        const match = roles.find((x) => x.toLowerCase() === r.toLowerCase());
        if (match) setRole(match);
      }
      setAvatarPreview(meta.avatar_url ?? meta.picture ?? null);

      const { data: existing } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();
      if (existing) {
        if (existing.full_name) setFullName(existing.full_name);
        if (existing.username) setUsername(existing.username);
        if (existing.phone) setPhone(existing.phone);
        if (existing.avatar_url) setAvatarPreview(existing.avatar_url);
      }
    })();
  }, [nav]);

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setBusy(true);
    try {
      let avatarUrl: string | null = avatarPreview;

      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop() || "jpg";
        const path = `${userId}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true, contentType: avatarFile.type });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
        avatarUrl = pub.publicUrl;
      }

      const { error: pErr } = await supabase.from("profiles").upsert({
        id: userId,
        username,
        full_name: fullName,
        phone,
        avatar_url: avatarUrl,
        profile_image_url: avatarUrl,
        updated_at: new Date().toISOString(),
      });
      if (pErr) throw pErr;

      const { error: rErr } = await supabase
        .from("user_roles")
        .upsert({ user_id: userId, role: role.toLowerCase() }, { onConflict: "user_id,role" });
      if (rErr) throw rErr;

      toast.success("Profile saved!");
      nav({ to: "/feed" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-6 py-12 bg-background">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-full bg-warm-gradient grid place-items-center">
            <Compass className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="font-display font-bold text-lg">My World Africa</div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Complete your profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a few details so the tribe knows who's on the road.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-muted border border-border grid place-items-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <label className="cursor-pointer">
              <span className="inline-flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent">
                Upload picture
              </span>
              <input type="file" accept="image/*" onChange={onPickFile} className="hidden" />
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" type="tel" required placeholder="+254 700 000 000" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

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

          <Button type="submit" disabled={busy} className="w-full bg-warm-gradient text-primary-foreground hover:opacity-90 h-11">
            {busy ? "Saving..." : "Save & continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
