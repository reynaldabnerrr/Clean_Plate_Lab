-- Store all five tier snapshots atomically with their menu.
alter table public.this_week_menu
  add column if not exists nutrition_by_tier jsonb;

-- Existing rows contain one nutrition snapshot. Use it as the baseline to
-- create editable estimates for all five protein tiers.
with generated_tiers as (
  select
    menu.id,
    jsonb_object_agg(
      tier.grams::text,
      jsonb_build_object(
        'protein', tier.grams,
        'carbs', round(menu.carbs * tier.grams / greatest(menu.protein, 1), 2),
        'fat', round(menu.fat * tier.grams / greatest(menu.protein, 1), 2),
        'fiber', round(menu.fiber * tier.grams / greatest(menu.protein, 1), 2),
        'sodium', round(menu.sodium * tier.grams / greatest(menu.protein, 1), 2),
        'potassium', round(menu.potassium * tier.grams / greatest(menu.protein, 1), 2),
        'kcal', round(menu.kcal * tier.grams / greatest(menu.protein, 1), 2)
      )
      order by tier.grams
    ) as nutrition
  from public.this_week_menu as menu
  cross join unnest(array[25, 40, 60, 80, 100]) as tier(grams)
  group by menu.id
)
update public.this_week_menu as menu
set nutrition_by_tier = generated.nutrition
from generated_tiers as generated
where menu.id = generated.id
  and menu.nutrition_by_tier is null;

alter table public.this_week_menu
  alter column nutrition_by_tier set default
  '{
    "25":{"protein":25,"carbs":0,"fat":0,"fiber":0,"sodium":0,"potassium":0,"kcal":0},
    "40":{"protein":40,"carbs":0,"fat":0,"fiber":0,"sodium":0,"potassium":0,"kcal":0},
    "60":{"protein":60,"carbs":0,"fat":0,"fiber":0,"sodium":0,"potassium":0,"kcal":0},
    "80":{"protein":80,"carbs":0,"fat":0,"fiber":0,"sodium":0,"potassium":0,"kcal":0},
    "100":{"protein":100,"carbs":0,"fat":0,"fiber":0,"sodium":0,"potassium":0,"kcal":0}
  }'::jsonb,
  alter column nutrition_by_tier set not null;

alter table public.this_week_menu
  drop constraint if exists this_week_menu_nutrition_by_tier_check;

alter table public.this_week_menu
  add constraint this_week_menu_nutrition_by_tier_check
  check (
    jsonb_typeof(nutrition_by_tier) = 'object'
    and nutrition_by_tier ?& array['25', '40', '60', '80', '100']
    and jsonb_typeof(nutrition_by_tier -> '25') = 'object'
    and jsonb_typeof(nutrition_by_tier -> '40') = 'object'
    and jsonb_typeof(nutrition_by_tier -> '60') = 'object'
    and jsonb_typeof(nutrition_by_tier -> '80') = 'object'
    and jsonb_typeof(nutrition_by_tier -> '100') = 'object'
  );

comment on column public.this_week_menu.nutrition_by_tier is
  'Nutrition facts keyed by protein tier: 25, 40, 60, 80, and 100 grams.';
