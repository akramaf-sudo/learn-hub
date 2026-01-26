create table if not exists site_settings (
  key text primary key,
  value text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table site_settings enable row level security;

create policy "Allow read access for all" on site_settings for select using (true);

create policy "Allow admin insert/update" on site_settings for insert with check (
  exists (
    select 1 from user_roles 
    where user_id = auth.uid() 
    and role = 'admin'
  )
);

create policy "Allow admin update" on site_settings for update using (
  exists (
    select 1 from user_roles 
    where user_id = auth.uid() 
    and role = 'admin'
  )
);

-- Insert default banner if not exists
insert into site_settings (key, value)
values ('hero_banner', '')
on conflict (key) do nothing;
