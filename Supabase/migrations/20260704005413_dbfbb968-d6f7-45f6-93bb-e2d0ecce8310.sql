
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.opportunity_source AS ENUM ('secop_i', 'secop_ii', 'sheets_privados');

-- ============ updated_at helper ============
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ============ profiles ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_self_select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_self_upsert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_profile_criteria (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END; $$;

-- ============ user_roles ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_self_read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- ============ user_profile_criteria ============
CREATE TABLE public.user_profile_criteria (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  sectors TEXT[] NOT NULL DEFAULT '{}',
  keywords TEXT[] NOT NULL DEFAULT '{}',
  ciiu TEXT[] NOT NULL DEFAULT '{}',
  departamentos TEXT[] NOT NULL DEFAULT '{}',
  monto_min NUMERIC,
  monto_max NUMERIC,
  pliegos_tipo TEXT[] NOT NULL DEFAULT '{}',
  sources TEXT[] NOT NULL DEFAULT ARRAY['secop_i','secop_ii','sheets_privados'],
  sheet_id TEXT,
  sheet_range TEXT DEFAULT 'Lista de Privados!A1:Z1000',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.user_profile_criteria TO authenticated;
GRANT ALL ON public.user_profile_criteria TO service_role;
ALTER TABLE public.user_profile_criteria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "criteria_self_select" ON public.user_profile_criteria FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "criteria_self_insert" ON public.user_profile_criteria FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "criteria_self_update" ON public.user_profile_criteria FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_criteria_updated BEFORE UPDATE ON public.user_profile_criteria FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ opportunities ============
CREATE TABLE public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source opportunity_source NOT NULL,
  external_id TEXT NOT NULL,
  entidad TEXT,
  objeto TEXT,
  modalidad TEXT,
  presupuesto NUMERIC,
  moneda TEXT DEFAULT 'COP',
  departamento TEXT,
  municipio TEXT,
  fecha_publicacion TIMESTAMPTZ,
  fecha_cierre TIMESTAMPTZ,
  url TEXT,
  pliego_tipo TEXT,
  pliego_tipo_confidence NUMERIC,
  raw JSONB,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(source, external_id)
);
GRANT SELECT ON public.opportunities TO authenticated;
GRANT ALL ON public.opportunities TO service_role;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "opportunities_read_authenticated" ON public.opportunities FOR SELECT TO authenticated USING (true);
CREATE INDEX idx_opps_source ON public.opportunities(source);
CREATE INDEX idx_opps_departamento ON public.opportunities(departamento);
CREATE INDEX idx_opps_pliego_tipo ON public.opportunities(pliego_tipo);
CREATE INDEX idx_opps_first_seen ON public.opportunities(first_seen_at DESC);
CREATE TRIGGER trg_opps_updated BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ opportunity_matches ============
CREATE TABLE public.opportunity_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL DEFAULT 0,
  reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  dismissed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, opportunity_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opportunity_matches TO authenticated;
GRANT ALL ON public.opportunity_matches TO service_role;
ALTER TABLE public.opportunity_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "matches_self_all" ON public.opportunity_matches FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_matches_user_score ON public.opportunity_matches(user_id, score DESC);
CREATE TRIGGER trg_matches_updated BEFORE UPDATE ON public.opportunity_matches FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ tenders (historial matriz) ============
CREATE TABLE public.tenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  entity TEXT,
  amount TEXT,
  deadline TEXT,
  file_name TEXT,
  scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  weights JSONB NOT NULL DEFAULT '{}'::jsonb,
  item_notes JSONB NOT NULL DEFAULT '{}'::jsonb,
  total NUMERIC,
  average NUMERIC,
  weighted NUMERIC,
  risk_level TEXT,
  recommendation TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenders TO authenticated;
GRANT ALL ON public.tenders TO service_role;
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenders_self_all" ON public.tenders FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_tenders_user ON public.tenders(user_id, created_at DESC);
CREATE TRIGGER trg_tenders_updated BEFORE UPDATE ON public.tenders FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
