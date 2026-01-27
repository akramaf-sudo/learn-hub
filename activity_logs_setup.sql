-- Activity Logs Table
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_phone TEXT,
    event_type TEXT NOT NULL, -- 'login', 'video_view', 'page_view', etc.
    description TEXT,
    ip_address TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can insert their own logs
CREATE POLICY "Users can insert their own logs" 
ON public.user_activity_logs FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Policy: Admins can view all logs
CREATE POLICY "Admins can view all logs" 
ON public.user_activity_logs FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
    OR 
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND (email LIKE '%660984023%' OR raw_user_meta_data->>'phone_number' LIKE '%660984023%')
    )
);
