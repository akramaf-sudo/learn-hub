-- Add phone_number to profiles
alter table profiles add column if not exists phone_number text unique;

-- Create OTP codes table
create table if not exists otp_codes (
  id uuid primary key default gen_random_uuid(),
  phone_number text not null,
  code text not null,
  expires_at timestamp with time zone not null,
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table otp_codes enable row level security;

-- Policies for OTP codes (allow insert for anyone, but only read own codes)
create policy "Allow insert OTP codes" on otp_codes for insert with check (true);

create policy "Allow read own OTP codes" on otp_codes for select using (true);

create policy "Allow update own OTP codes" on otp_codes for update using (true);

-- Index for faster lookups
create index if not exists otp_codes_phone_number_idx on otp_codes(phone_number);
create index if not exists otp_codes_expires_at_idx on otp_codes(expires_at);

-- Function to cleanup expired OTPs (optional, can be called periodically)
create or replace function cleanup_expired_otps()
returns void as $$
begin
  delete from otp_codes where expires_at < now();
end;
$$ language plpgsql security definer;

-- Delete all existing users (as requested)
-- WARNING: This will delete all user data
delete from user_roles;
delete from profiles;
