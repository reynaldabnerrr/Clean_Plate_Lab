-- Migration: Create admin_users table for Superadmin and Admin roles
-- Date: 2026-08-08

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('superadmin', 'admin')) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public and authenticated users to read admin roles
CREATE POLICY "Public Read Admin Users"
  ON public.admin_users
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage admin profiles
CREATE POLICY "Authenticated Manage Admin Users"
  ON public.admin_users
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
