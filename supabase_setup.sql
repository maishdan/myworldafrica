-- =========================================================
-- FINAL CONSOLIDATED SQL FOR MY WORLD AFRICA
-- Handles: Profiles, Roles, Events, Bookings, RLS, and GM Oversight
-- =========================================================

-- 1. ROLES ENUM
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('rider', 'driver', 'explorer', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  profile_image_url TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. USER ROLES TABLE
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'explorer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- 4. EVENTS TABLE (Missions, Expeditions, Journeys)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  images TEXT[] DEFAULT '{}',
  min_attendees INTEGER DEFAULT 100,
  max_attendees INTEGER DEFAULT 1000,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  price NUMERIC(10,2) DEFAULT 0,
  payout_details TEXT,
  audience TEXT DEFAULT 'All',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BOOKINGS TABLE (Tickets)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  ticket_code TEXT UNIQUE NOT NULL,
  attended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- ==========================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Helper Function to check if current user is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR is_admin());
CREATE POLICY "Admins full control profiles" ON public.profiles FOR ALL USING (is_admin());

-- User Roles Policies
CREATE POLICY "Users read own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Admins full control roles" ON public.user_roles FOR ALL USING (is_admin());

-- Events Policies
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Users create events" ON public.events FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators update own events" ON public.events FOR UPDATE USING (auth.uid() = creator_id OR is_admin());
CREATE POLICY "Creators delete own events" ON public.events FOR DELETE USING (auth.uid() = creator_id OR is_admin());

-- Bookings Policies
CREATE POLICY "Users read own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Creators read event bookings" ON public.bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = event_id AND events.creator_id = auth.uid())
);
CREATE POLICY "Users insert bookings" ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins full control bookings" ON public.bookings FOR ALL USING (is_admin());

-- ==========================================
-- 7. AUTOMATION & TRIGGERS
-- ==========================================

-- Trigger to create profile and role on Auth Signup (Google/Email)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, onboarding_complete)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    FALSE
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'explorer')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Login Helper: Find Email by Username
CREATE OR REPLACE FUNCTION get_email_from_username(u_name TEXT)
RETURNS TEXT AS $$
  SELECT email FROM public.profiles WHERE username = u_name LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- ==========================================
-- 8. ANALYTICS VIEWS
-- ==========================================

-- RSVP Counts per event
CREATE OR REPLACE VIEW public.event_stats AS
SELECT e.id as event_id, COUNT(b.id) as taken
FROM public.events e
LEFT JOIN public.bookings b ON e.id = b.event_id
GROUP BY e.id;

-- ==========================================
-- 9. STORAGE & PERMISSIONS
-- ==========================================

-- Create Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-assets', 'event-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket Policies
CREATE POLICY "Public access to assets" ON storage.objects FOR SELECT USING (bucket_id = 'event-assets');
CREATE POLICY "Authenticated upload assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'event-assets');

-- Grants
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA storage TO authenticated;
