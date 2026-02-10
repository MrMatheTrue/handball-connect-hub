
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS terms_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz,
ADD COLUMN IF NOT EXISTS privacy_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS data_sharing_consent boolean DEFAULT false;
