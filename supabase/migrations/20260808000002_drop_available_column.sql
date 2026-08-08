-- Migration: Drop unused 'available' column and add 'menu_date' column on public.this_week_menu
-- Date: 2026-08-08

ALTER TABLE public.this_week_menu DROP COLUMN IF EXISTS available;
ALTER TABLE public.this_week_menu ADD COLUMN IF NOT EXISTS menu_date DATE;
