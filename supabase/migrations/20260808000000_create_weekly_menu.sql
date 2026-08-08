-- Migration: Create this_week_menu table and RLS policies
-- Date: 2026-08-08

CREATE TABLE IF NOT EXISTS public.this_week_menu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  day TEXT NOT NULL,
  protein NUMERIC NOT NULL DEFAULT 40,
  carbs NUMERIC NOT NULL DEFAULT 50,
  fat NUMERIC NOT NULL DEFAULT 15,
  fiber NUMERIC NOT NULL DEFAULT 0.14,
  sodium NUMERIC NOT NULL DEFAULT 500,
  potassium NUMERIC NOT NULL DEFAULT 350,
  kcal NUMERIC NOT NULL DEFAULT 500,
  image TEXT NOT NULL,
  tags_id JSONB DEFAULT '[]'::jsonb,
  tags_en JSONB DEFAULT '[]'::jsonb,
  desc_id TEXT NOT NULL DEFAULT '',
  desc_en TEXT NOT NULL DEFAULT '',
  batch TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.this_week_menu ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public read access for menu items
CREATE POLICY "Public Read Menu"
  ON public.this_week_menu
  FOR SELECT
  TO public
  USING (true);

-- RLS Policy: Authenticated admin write access (INSERT, UPDATE, DELETE)
CREATE POLICY "Authenticated Write Menu"
  ON public.this_week_menu
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
