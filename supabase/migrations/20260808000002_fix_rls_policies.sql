-- Migration: Fix RLS policy warnings for this_week_menu and admin_users
-- Date: 2026-08-08

-- 1. Fix RLS policies on public.this_week_menu
DROP POLICY IF EXISTS "Enable full access for this_week_menu" ON public.this_week_menu;
DROP POLICY IF EXISTS "Public Read Access" ON public.this_week_menu;
DROP POLICY IF EXISTS "Admin Full Access" ON public.this_week_menu;
DROP POLICY IF EXISTS "Public Read Menu" ON public.this_week_menu;
DROP POLICY IF EXISTS "Authenticated Write Menu" ON public.this_week_menu;

CREATE POLICY "Public Read Menu"
  ON public.this_week_menu
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated Write Menu"
  ON public.this_week_menu
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 2. Fix RLS policies on public.admin_users
DROP POLICY IF EXISTS "Allow Authenticated Manage Admin Roles" ON public.admin_users;
DROP POLICY IF EXISTS "Public Read Admin Users" ON public.admin_users;
DROP POLICY IF EXISTS "Authenticated Manage Admin Users" ON public.admin_users;

CREATE POLICY "Public Read Admin Users"
  ON public.admin_users
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated Manage Admin Users"
  ON public.admin_users
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
