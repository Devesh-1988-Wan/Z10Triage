create table if not exists public.scenes (
  id uuid primary key default gen_random_uuid(),
  share_slug text not null,
  page int not null,
  title text,
  notes text,
  layout jsonb not null default '[]'::jsonb,
  theme jsonb,
  created_at timestamptz default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  share_slug text not null,
  widget_id text not null,
  author text,
  body text not null,
  created_at timestamptz default now()
);
