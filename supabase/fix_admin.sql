-- RUN THIS SCRIPT IN THE SUPABASE SQL EDITOR

-- 1. Create a trigger to auto-promote any signup with the admin email
CREATE OR REPLACE FUNCTION public.handle_admin_signup()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'administrador@handzone.com' THEN
    -- Ensure the user_roles table exists and add the role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
    
    -- Update profile (assuming it exists via another trigger)
    UPDATE public.profiles 
    SET user_type = 'player' -- or whatever default
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_admin_signup ON auth.users;
CREATE TRIGGER tr_admin_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_signup();

-- 2. Promote the user if they ALREADY signed up
DO $$
DECLARE
    target_id UUID;
BEGIN
    SELECT id INTO target_id FROM auth.users WHERE email = 'administrador@handzone.com';
    
    IF target_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (target_id, 'admin')
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'User promoted to admin successfully.';
    ELSE
        RAISE NOTICE 'User not found. Please sign up first with administrador@handzone.com';
    END IF;
END $$;
