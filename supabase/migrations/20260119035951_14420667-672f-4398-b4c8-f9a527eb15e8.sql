-- Create clients table for managing clients and partners
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  type TEXT NOT NULL DEFAULT 'client' CHECK (type IN ('client', 'partner')),
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage all clients"
ON public.clients
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view published clients"
ON public.clients
FOR SELECT
USING (published = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for client logos
INSERT INTO storage.buckets (id, name, public) VALUES ('client-logos', 'client-logos', true);

-- Storage policies for client logos
CREATE POLICY "Client logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'client-logos');

CREATE POLICY "Admins can upload client logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'client-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update client logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'client-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete client logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'client-logos' AND has_role(auth.uid(), 'admin'::app_role));