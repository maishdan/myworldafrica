import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  profile_image_url: string | null;
  phone: string | null;
  email: string | null;
  role?: string | null;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndRole = async (userId: string) => {
      const [profileRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle()
      ]);

      if (profileRes.data) {
        setProfile({
          ...profileRes.data,
          role: rolesRes.data?.role || 'explorer'
        } as Profile);
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfileAndRole(s.user.id);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        fetchProfileAndRole(data.session.user.id);
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user, profile, loading, signOut: () => supabase.auth.signOut() };
}
