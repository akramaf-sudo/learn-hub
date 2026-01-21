-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'employee');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create training_videos table
CREATE TABLE public.training_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration TEXT,
    category TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on training_videos
ALTER TABLE public.training_videos ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view videos
CREATE POLICY "Authenticated users can view videos"
ON public.training_videos
FOR SELECT
TO authenticated
USING (true);

-- Only admins can insert videos
CREATE POLICY "Admins can insert videos"
ON public.training_videos
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update videos
CREATE POLICY "Admins can update videos"
ON public.training_videos
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete videos
CREATE POLICY "Admins can delete videos"
ON public.training_videos
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_training_videos_updated_at
BEFORE UPDATE ON public.training_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for training videos
INSERT INTO storage.buckets (id, name, public) VALUES ('training-videos', 'training-videos', true);

-- Storage policies for training videos bucket
CREATE POLICY "Anyone can view training videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'training-videos');

CREATE POLICY "Admins can upload training videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'training-videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update training videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'training-videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete training videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'training-videos' AND public.has_role(auth.uid(), 'admin'));