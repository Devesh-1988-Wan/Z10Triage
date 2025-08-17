-- Restrict public read access on profiles to authenticated users only
-- 1) Drop overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- 2) Allow only authenticated users to select profiles
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);
