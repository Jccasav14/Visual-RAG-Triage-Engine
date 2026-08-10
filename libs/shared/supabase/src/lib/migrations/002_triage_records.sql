-- Create Triage Records Table
CREATE TABLE IF NOT EXISTS public.triage_records (
  ticket_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  image_url TEXT NOT NULL,
  context_id TEXT NOT NULL,
  severity TEXT DEFAULT 'PENDING',
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
