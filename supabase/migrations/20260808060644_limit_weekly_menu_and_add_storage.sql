-- Give each weekly menu a stable Monday-Saturday slot. A unique, required
-- slot constrained to 1..6 makes a seventh row impossible without a trigger.
alter table public.this_week_menu
  add column if not exists menu_slot smallint;

with ranked_menus as (
  select
    id,
    row_number() over (
      order by
        case
          when lower(day || ' ' || code) ~ '(monday|senin|cpl-mon)' then 1
          when lower(day || ' ' || code) ~ '(tuesday|selasa|cpl-tue)' then 2
          when lower(day || ' ' || code) ~ '(wednesday|rabu|cpl-wed)' then 3
          when lower(day || ' ' || code) ~ '(thursday|kamis|cpl-thu)' then 4
          when lower(day || ' ' || code) ~ '(friday|jumat|cpl-fri)' then 5
          when lower(day || ' ' || code) ~ '(saturday|sabtu|cpl-sat)' then 6
          else 99
        end,
        created_at,
        id
    ) as slot
  from public.this_week_menu
)
update public.this_week_menu as menu
set menu_slot = ranked.slot
from ranked_menus as ranked
where menu.id = ranked.id
  and menu.menu_slot is null;

alter table public.this_week_menu
  alter column menu_slot set not null;

alter table public.this_week_menu
  drop constraint if exists this_week_menu_menu_slot_check;

alter table public.this_week_menu
  add constraint this_week_menu_menu_slot_check
  check (menu_slot between 1 and 6);

alter table public.this_week_menu
  drop constraint if exists this_week_menu_menu_slot_key;

alter table public.this_week_menu
  add constraint this_week_menu_menu_slot_key unique (menu_slot);

-- Public delivery keeps storefront images fast and simple. Object mutations
-- remain protected by storage.objects RLS policies below.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'menu-images',
  'menu-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Registered admins can view menu images" on storage.objects;
create policy "Registered admins can view menu images"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'menu-images'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

drop policy if exists "Registered admins can upload menu images" on storage.objects;
create policy "Registered admins can upload menu images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'menu-images'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

drop policy if exists "Registered admins can update menu images" on storage.objects;
create policy "Registered admins can update menu images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'menu-images'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
)
with check (
  bucket_id = 'menu-images'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

drop policy if exists "Registered admins can delete menu images" on storage.objects;
create policy "Registered admins can delete menu images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'menu-images'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);
