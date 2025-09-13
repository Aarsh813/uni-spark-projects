-- Fix security vulnerability: Restrict profiles table access and create public author view

-- Drop the existing permissive SELECT policy on profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a restrictive policy - users can only view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Create a secure view for public author information (no email addresses)
CREATE VIEW public.public_authors AS 
SELECT 
    id,
    full_name,
    major,
    avatar_url,
    created_at
FROM public.profiles;

-- Enable RLS on the view would be ideal, but views inherit permissions
-- Instead, create a security definer function to safely get author info
CREATE OR REPLACE FUNCTION public.get_author_info(author_id UUID)
RETURNS TABLE(
    id UUID,
    full_name TEXT,
    major TEXT, 
    avatar_url TEXT
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT p.id, p.full_name, p.major, p.avatar_url
  FROM profiles p 
  WHERE p.id = author_id;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_author_info(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_author_info(UUID) TO anon;