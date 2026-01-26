# Database Migration Instructions

## ⚠️ IMPORTANT: Run this migration to fix "Failed to generate OTP" error

### Steps to Execute:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Log in with your credentials
   - Select your **Training Yola** project

2. **Navigate to SQL Editor**
   - Click on **SQL Editor** in the left sidebar
   - Click **"New Query"** button

3. **Copy and Paste the SQL Below**
   - Copy the entire SQL code from `migration.sql` file (in this same directory)
   - Paste it into the SQL Editor

4. **Execute the Migration**
   - Click **"Run"** button (bottom right)
   - Wait for confirmation message

5. **Verify Success**
   - You should see: "Success. No rows returned"
   - Check the **Table Editor** to confirm `otp_codes` table exists

6. **Test Your App**
   - Refresh your Training Yola application
   - Try sending OTP again - it should work now!

---

## What This Migration Does:

✅ Adds `phone_number` column to `profiles` table  
✅ Creates `otp_codes` table for storing verification codes  
✅ Sets up Row Level Security policies  
✅ Creates indexes for performance  
✅ **Deletes all existing users** (as you requested)  

---

## Troubleshooting:

If you get an error about existing columns:
- This is normal if you've run parts of this before
- The migration uses `if not exists` to prevent errors

If OTP still doesn't work after migration:
- Check browser console for errors (F12)
- Verify your Infobip API key is correct
- Ensure phone number format is correct (+212...)

---

## Need Help?

Contact support or check the migration file for the exact SQL commands.
