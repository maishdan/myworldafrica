-- FINAL ROBUST SQL SETUP FOR MY WORLD AFRICA

-- 1. ENUMS
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('rider', 'driver', 'explorer', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. USER ROLES
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'explorer',
  UNIQUE (user_id, role)
);

-- 4. RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles read by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- 5. TRIGGER FOR NEW USERS (GOOGLE & EMAIL)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, email, full_name, avatar_url, onboarding_complete)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    FALSE -- Explicitly set to false for everyone initially
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert into user_roles
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

-- 6. LOGIN HELPERS
CREATE OR REPLACE FUNCTION get_email_from_username(u_name TEXT)
RETURNS TEXT AS $$
  SELECT email FROM public.profiles WHERE username = u_name LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- 7. EVENT TABLES (Ensuring they exist for the system)
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

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  ticket_code TEXT UNIQUE NOT NULL,
  attended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

CREATE OR REPLACE VIEW public.event_stats AS
SELECT e.id as event_id, COUNT(b.id) as taken
FROM public.events e
LEFT JOIN public.bookings b ON e.id = b.event_id
GROUP BY e.id;

-- 8. STORAGE
INSERT INTO storage.buckets (id, name, public) VALUES ('event-assets', 'event-assets', true) ON CONFLICT (id) DO NOTHING;

-- 9. GRANTS
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
