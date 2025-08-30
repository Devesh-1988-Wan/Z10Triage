create table if not exists dashboards (
  id uuid primary key,
  name text not null,
  description text,
  layout jsonb not null default '[]'::jsonb,
  theme jsonb,
  is_public boolean not null default false,
  share_slug text unique,
  owner_external_id text,
  created_at timestamp with time zone default now()
);

-- Example dataset for Table widget
create table if not exists samples (
  id bigint generated always as identity primary key,
  category text,
  value numeric,
  created_at timestamp with time zone default now()
);

insert into samples (category, value)
select x.cat, (random()*100)::int
from (values ('Alpha'),('Beta'),('Gamma'),('Delta'),('Epsilon')) as x(cat)
limit 5;
