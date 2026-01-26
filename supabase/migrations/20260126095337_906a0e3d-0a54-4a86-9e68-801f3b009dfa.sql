-- Update handle_new_user function to also insert into user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Insert into profiles
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    
    -- Insert into user_roles with role from metadata or default to 'employee'
    INSERT INTO public.user_roles (user_id, role)
    VALUES (
        NEW.id,
        (COALESCE(NEW.raw_user_meta_data->>'role', 'employee'))::public.app_role
    );
    
    RETURN NEW;
END;
$function$;