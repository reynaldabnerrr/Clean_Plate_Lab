-- Every fixed Monday-Saturday menu slot must also identify its calendar date.
alter table public.this_week_menu
  add column if not exists menu_date date;

-- Backfill missing or mismatched legacy dates to the corresponding day in the
-- current ISO week. This keeps each stable menu_slot aligned with its date.
update public.this_week_menu
set menu_date = current_date + (menu_slot - extract(isodow from current_date)::integer)
where menu_date is null
   or extract(isodow from menu_date)::integer <> menu_slot;

alter table public.this_week_menu
  alter column menu_date set not null;

alter table public.this_week_menu
  drop constraint if exists this_week_menu_date_matches_slot_check;

alter table public.this_week_menu
  add constraint this_week_menu_date_matches_slot_check
  check (extract(isodow from menu_date)::integer = menu_slot);

comment on column public.this_week_menu.menu_date is
  'Calendar date for this Monday-Saturday menu slot.';
