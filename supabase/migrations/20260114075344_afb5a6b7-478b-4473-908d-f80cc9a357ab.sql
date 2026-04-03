-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  github_url TEXT,
  department TEXT,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can manage all team members"
ON public.team_members
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public can view published team members
CREATE POLICY "Anyone can view published team members"
ON public.team_members
FOR SELECT
USING (published = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();