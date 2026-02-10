
-- Partnership requests table
CREATE TABLE public.partnership_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  partnership_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.partnership_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a partnership request
CREATE POLICY "Anyone can insert partnership requests"
ON public.partnership_requests FOR INSERT
WITH CHECK (true);

-- Only admins can view partnership requests
CREATE POLICY "Admins can manage partnership requests"
ON public.partnership_requests FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));
