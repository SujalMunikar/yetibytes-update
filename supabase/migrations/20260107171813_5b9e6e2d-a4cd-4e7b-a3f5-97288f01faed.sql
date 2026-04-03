-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create roles enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- User roles policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  featured_image TEXT,
  published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts"
ON public.blog_posts FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage all posts"
ON public.blog_posts FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors can manage all posts"
ON public.blog_posts FOR ALL
USING (public.has_role(auth.uid(), 'editor'));

-- Portfolio projects table
CREATE TABLE public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[],
  featured_image TEXT,
  gallery_images TEXT[],
  client_name TEXT,
  project_url TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published projects"
ON public.portfolio_projects FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage all projects"
ON public.portfolio_projects FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors can manage all projects"
ON public.portfolio_projects FOR ALL
USING (public.has_role(auth.uid(), 'editor'));

-- Job listings table
CREATE TABLE public.job_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  type TEXT DEFAULT 'Full-time',
  description TEXT,
  requirements TEXT,
  benefits TEXT,
  salary_range TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published jobs"
ON public.job_listings FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage all jobs"
ON public.job_listings FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Job applications table
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.job_listings(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all applications"
ON public.job_applications FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can submit applications"
ON public.job_applications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update applications"
ON public.job_applications FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Contact submissions table
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all submissions"
ON public.contact_submissions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update submissions"
ON public.contact_submissions FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Timestamp triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_listings_updated_at
  BEFORE UPDATE ON public.job_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();