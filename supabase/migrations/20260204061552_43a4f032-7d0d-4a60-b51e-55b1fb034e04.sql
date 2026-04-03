-- Fix 1: Add length constraints to contact_submissions table
ALTER TABLE public.contact_submissions
ADD CONSTRAINT contact_name_length CHECK (length(name) <= 100),
ADD CONSTRAINT contact_email_length CHECK (length(email) <= 255),
ADD CONSTRAINT contact_company_length CHECK (length(company) <= 200),
ADD CONSTRAINT contact_subject_length CHECK (length(subject) <= 100),
ADD CONSTRAINT contact_message_length CHECK (length(message) <= 5000);

-- Fix 2: Create a public view for team_members that excludes email
CREATE VIEW public.team_members_public
WITH (security_invoker = on) AS
SELECT 
  id,
  name,
  role,
  bio,
  image_url,
  linkedin_url,
  twitter_url,
  github_url,
  department,
  display_order,
  published,
  created_at,
  updated_at
FROM public.team_members;

-- Update RLS policy on team_members to deny direct public SELECT
DROP POLICY IF EXISTS "Anyone can view published team members" ON public.team_members;

-- Create new policy that only allows admins to select from base table
CREATE POLICY "Only admins can select team members directly"
ON public.team_members
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow public to select from the view (which excludes email)
GRANT SELECT ON public.team_members_public TO anon, authenticated;