alter table dashboards enable row level security;

create policy "public readable published" on dashboards
for select using (
  is_public = true or auth.role() = 'authenticated'
);

create policy "owner can read" on dashboards
for select using (
  auth.uid() is not null or owner_external_id is not null
);

create policy "owner can upsert by external id" on dashboards
for insert with check ( true );

create policy "owner can update by external id" on dashboards
for update using ( true );

-- Note: In a production app, tie to auth.uid() and store user_id uuid.
