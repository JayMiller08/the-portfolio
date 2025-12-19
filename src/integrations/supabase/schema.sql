-- Create the subscribers table
create table public.subscribers (
  id uuid not null default gen_random_uuid (),
  email text not null,
  source text null default 'Artifacts Page'::text,
  created_at timestamp with time zone not null default now(),
  constraint subscribers_pkey primary key (id),
  constraint subscribers_email_key unique (email)
) tablespace pg_default;

-- Enable Row Level Security (RLS)
alter table public.subscribers enable row level security;

-- Create a policy to allow anyone to insert (since it's a public lead magnet)
create policy "Enable insert for all users" on public.subscribers
  for insert
  with check (true);

-- Create a policy to allow admins (or everyone for now, if no auth) to select
-- IMPORTANT: For a real production app, you'd want to restrict this to authenticated admins only.
-- For this portfolio demo, we'll allow read access so the Admin Dashboard works without complex auth.
create policy "Enable read access for all users" on public.subscribers
  for select
  using (true);
