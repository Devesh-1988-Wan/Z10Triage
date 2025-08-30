alter table public.scenes enable row level security;
alter table public.comments enable row level security;

-- public readers for scenes/comments only when the underlying dashboard is public
create policy "public can select scenes for published" on public.scenes
for select using (
  exists (
    select 1 from public.dashboards d
    where d.share_slug = scenes.share_slug and d.is_public = true
  )
);

create policy "public can select comments for published" on public.comments
for select using (
  exists (
    select 1 from public.dashboards d
    where d.share_slug = comments.share_slug and d.is_public = true
  )
);

-- authorship of comments can be expanded later; keep insert restricted to authenticated in next PR
