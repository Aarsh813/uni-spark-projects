-- Add secure function to get public author information without exposing email addresses

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

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.get_author_info(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_author_info(UUID) TO anon;