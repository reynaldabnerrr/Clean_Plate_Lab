-- The storefront and admin no longer use meal photography. Remove the old
-- database pointer and revoke all access paths to the dedicated image bucket.
alter table public.this_week_menu
  drop column if exists image;

drop policy if exists "Registered admins can view menu images" on storage.objects;
drop policy if exists "Registered admins can upload menu images" on storage.objects;
drop policy if exists "Registered admins can update menu images" on storage.objects;
drop policy if exists "Registered admins can delete menu images" on storage.objects;

-- The menu-images bucket itself is emptied and deleted through the Storage
-- API by scripts/remove-menu-images-bucket.mjs. Storage object metadata must
-- not be deleted directly with SQL because that can orphan physical files.
