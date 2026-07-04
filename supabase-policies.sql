-- Temporary policies for the first working shared version.
-- These allow the Vercel app to read and write with the publishable anon key.
-- Later, replace these with authenticated user policies for Megan and Winnie.

alter table profiles enable row level security;
alter table campaign_types enable row level security;
alter table campaigns enable row level security;
alter table documents enable row level security;
alter table holidays enable row level security;
alter table campaign_assets enable row level security;
alter table campaign_comments enable row level security;
alter table activity_log enable row level security;

drop policy if exists "public read profiles" on profiles;
drop policy if exists "public read campaign types" on campaign_types;
drop policy if exists "public read holidays" on holidays;
drop policy if exists "public manage campaigns" on campaigns;
drop policy if exists "public manage campaign assets" on campaign_assets;
drop policy if exists "public manage campaign comments" on campaign_comments;
drop policy if exists "public manage documents" on documents;
drop policy if exists "public manage activity log" on activity_log;

create policy "public read profiles" on profiles for select using (true);
create policy "public read campaign types" on campaign_types for select using (true);
create policy "public read holidays" on holidays for select using (true);

create policy "public manage campaigns" on campaigns for all using (true) with check (true);
create policy "public manage campaign assets" on campaign_assets for all using (true) with check (true);
create policy "public manage campaign comments" on campaign_comments for all using (true) with check (true);
create policy "public manage documents" on documents for all using (true) with check (true);
create policy "public manage activity log" on activity_log for all using (true) with check (true);

-- Optional starter data so you can immediately confirm the live database is feeding the app.
insert into campaigns (title, campaign_type, start_date, end_date, notes, owner, status)
values
('Protein Slider Packs', 'Product Launch', '2026-07-14', '2026-07-14', 'Launch support for protein slider packs.', 'Marketing', 'planned'),
('July Social Post', 'Social Media', '2026-07-14', '2026-07-14', 'Social support post for July.', 'Marketing', 'planned'),
('Q3 POP Kit', 'POP Kit', '2026-07-22', '2026-07-22', 'Quarterly required store POP kit.', 'Marketing', 'planned')
on conflict do nothing;

insert into documents (title, url, description)
values
('Google Drive', 'https://drive.google.com', 'Marketing files and shared folders'),
('Monday.com', 'https://monday.com', 'Project management workspace')
on conflict do nothing;
