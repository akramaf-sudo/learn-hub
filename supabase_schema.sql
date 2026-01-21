-- 1. Updates to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS role text DEFAULT 'employee';

-- 2. Storage Bucket for Videos
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

create policy "Videos are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'videos' );

create policy "Employees and Admins can upload videos"
  on storage.objects for insert
  with check ( bucket_id = 'videos' and auth.role() = 'authenticated' );

-- 3. Trigger to handle new user signup metadata
-- This assumes you are passing metadata in supabase.auth.signUp()
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role, department)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'employee'),
    new.raw_user_meta_data->>'department'
  );
  
  -- Also insert into user_roles if you are using that table
  insert into public.user_roles (user_id, role)
  values (
    new.id,
    (coalesce(new.raw_user_meta_data->>'role', 'employee'))::public.app_role
  );
  
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger (drop first to be safe)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. RLS Policies for Videos (Assuming training_videos table exists)
alter table public.training_videos enable row level security;

create policy "Videos are viewable by everyone" 
  on public.training_videos for select 
  using (true);

create policy "Authenticated users can upload videos" 
  on public.training_videos for insert 
  with check (auth.role() = 'authenticated');
