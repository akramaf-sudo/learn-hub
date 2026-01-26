-- ============================================
-- Learn Hub - Phone Authentication Migration
-- ============================================
-- This migration adds phone authentication support
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Add phone_number column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT UNIQUE;

-- Step 2: Create OTP codes table
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 3: Enable Row Level Security
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policies
-- Allow anyone to insert OTP codes (for registration/login)
CREATE POLICY "Allow insert OTP codes" 
ON otp_codes 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read OTP codes (for verification)
CREATE POLICY "Allow read own OTP codes" 
ON otp_codes 
FOR SELECT 
USING (true);

-- Allow anyone to update OTP codes (for marking as verified)
CREATE POLICY "Allow update own OTP codes" 
ON otp_codes 
FOR UPDATE 
USING (true);

-- Step 5: Create indexes for performance
CREATE INDEX IF NOT EXISTS otp_codes_phone_number_idx 
ON otp_codes(phone_number);

CREATE INDEX IF NOT EXISTS otp_codes_expires_at_idx 
ON otp_codes(expires_at);

-- Step 6: Create cleanup function (optional)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS VOID AS $$
BEGIN
  DELETE FROM otp_codes WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Delete all existing users (as requested)
-- WARNING: This will permanently delete all user data!
DELETE FROM user_roles;
DELETE FROM profiles;

-- ============================================
-- Migration Complete!
-- ============================================
-- You should see: "Success. No rows returned"
-- Now refresh your app and try OTP authentication
-- ============================================
