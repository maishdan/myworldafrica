-- =========================================================
-- COMPLETE PERMISSIONS FIX FOR MY WORLD AFRICA
-- Run this in Supabase SQL Editor to resolve "Check Permission" errors
-- =========================================================

-- 1. Ensure Role Enum
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('rider', 'driver', 'explorer', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Profiles Table - Explicit Permissions
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow user update own profile" ON public.profiles;
CREATE POLICY "Allow user update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow user insert own profile" ON public.profiles;
CREATE POLICY "Allow user insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow all read profiles" ON public.profiles;
CREATE POLICY "Allow all read profiles" ON public.profiles
  FOR SELECT USING (true);

-- 3. User Roles - Explicit Permissions for Onboarding
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow user manage own role" ON public.user_roles;
CREATE POLICY "Allow user manage own role" ON public.user_roles
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage all roles" ON public.user_roles;
CREATE POLICY "Admins manage all roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 4. Storage Permissions (For Logos & Images)
-- Allow anyone to read, but only owners/authenticated to upload to their folders
CREATE POLICY "Public Read" ON storage.objects FOR SELECT USING (bucket_id = 'event-assets');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'event-assets');

-- 5. GRANTS - Direct access for the frontend
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.user_roles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- 6. LOGIN BY USERNAME HELPER (Ensuring it's secure)
CREATE OR REPLACE FUNCTION get_email_from_username(u_name TEXT)
RETURNS TEXT AS $$
  SELECT email FROM public.profiles WHERE username = u_name LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;
