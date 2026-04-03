-- Drop existing restrictive policies on clients table
DROP POLICY IF EXISTS "Admins can manage all clients" ON public.clients;
DROP POLICY IF EXISTS "Anyone can view published clients" ON public.clients;

-- Recreate as permissive policies (default)
CREATE POLICY "Admins can manage all clients" 
ON public.clients 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view published clients" 
ON public.clients 
FOR SELECT 
TO public
USING (published = true);