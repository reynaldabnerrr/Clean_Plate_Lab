-- Repair the legacy admin account that was inserted directly into auth.users.
-- GoTrue expects token columns to contain empty strings instead of NULL.
update auth.users
set
  confirmation_token = coalesce(confirmation_token, ''),
  recovery_token = coalesce(recovery_token, ''),
  email_change_token_new = coalesce(email_change_token_new, ''),
  email_change = coalesce(email_change, '')
where lower(email) = 'reynald030685@gmail.com';

-- Direct inserts into auth.users do not create the email identity required by Auth.
insert into auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
select
  user_record.id::text,
  user_record.id,
  coalesce(user_record.raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
    'sub', user_record.id::text,
    'email', lower(user_record.email),
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  now(),
  now(),
  now()
from auth.users as user_record
where lower(user_record.email) = 'reynald030685@gmail.com'
on conflict (provider_id, provider) do nothing;

-- Link the repaired Auth user to the application authorization table.
insert into public.admin_users (user_id, email, full_name, role)
select
  user_record.id,
  lower(user_record.email),
  coalesce(user_record.raw_user_meta_data ->> 'full_name', 'Admin User'),
  'admin'
from auth.users as user_record
where lower(user_record.email) = 'reynald030685@gmail.com'
on conflict (email) do update
set
  user_id = excluded.user_id,
  full_name = excluded.full_name,
  role = excluded.role,
  updated_at = now();

alter table public.admin_users
  alter column user_id set not null;

-- Admin profiles are private. An authenticated user may only read their row.
drop policy if exists "Allow Authenticated Manage Admin Roles" on public.admin_users;
drop policy if exists "Allow Public Read Admin Roles" on public.admin_users;
drop policy if exists "Public Read Admin Users" on public.admin_users;
drop policy if exists "Authenticated Manage Admin Users" on public.admin_users;

revoke all on table public.admin_users from anon, authenticated;
grant select on table public.admin_users to authenticated;

create policy "Admins read own profile"
  on public.admin_users
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Menus remain publicly readable, but only registered admins may mutate them.
drop policy if exists "Enable full access for this_week_menu" on public.this_week_menu;
drop policy if exists "Public Read Access" on public.this_week_menu;
drop policy if exists "Admin Full Access" on public.this_week_menu;
drop policy if exists "Public Read Menu" on public.this_week_menu;
drop policy if exists "Authenticated Write Menu" on public.this_week_menu;

revoke all on table public.this_week_menu from anon, authenticated;
grant select on table public.this_week_menu to anon, authenticated;
grant insert, update, delete on table public.this_week_menu to authenticated;

create policy "Public reads menus"
  on public.this_week_menu
  for select
  to anon, authenticated
  using (true);

create policy "Admins insert menus"
  on public.this_week_menu
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.admin_users as admin_user
      where admin_user.user_id = (select auth.uid())
    )
  );

create policy "Admins update menus"
  on public.this_week_menu
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.admin_users as admin_user
      where admin_user.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.admin_users as admin_user
      where admin_user.user_id = (select auth.uid())
    )
  );

create policy "Admins delete menus"
  on public.this_week_menu
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.admin_users as admin_user
      where admin_user.user_id = (select auth.uid())
    )
  );
